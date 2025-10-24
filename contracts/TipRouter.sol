// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC20 {
    function transfer(address, uint256) external returns (bool);
    function transferFrom(address, address, uint256) external returns (bool);
}

contract TipRouter {
    /// @notice Stable token used for payments (e.g., YUSD)
    address public immutable yusd;

    /// @notice Router owner (can set prices, sweep funds)
    address public owner;

    /// @notice tipToken => tipTokensPer1YUSD (1e18 scale)
    mapping(address => uint256) public price;

    event PriceUpdated(address indexed tipToken, uint256 tipPerYUSD_1e18);
    event Tipped(
        address indexed from,
        address indexed to,
        address indexed tipToken,
        uint256 yusdIn,
        uint256 tipOut,
        string  message
    );
    event TippedBatch(
        address indexed from,
        address indexed to,
        address[] tipTokens,
        uint256[] yusdIn,
        uint256[] tipOut,
        string  message
    );
    event Funded(address indexed tipToken, uint256 amount);
    event SweptYUSD(address indexed to, uint256 amount);
    event OwnerTransferred(address indexed oldOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    constructor(address _yusd) {
        require(_yusd != address(0), "yusd=0");
        yusd = _yusd;
        owner = msg.sender;
    }

    // ========== Admin ==========

    /// @notice Set the conversion rate for a tip token
    /// @param tipToken The badge token (e.g., LOVE, SMILE, WINK, SUPER)
    /// @param tipPerYUSD_1e18 How many tip tokens a streamer gets per 1 YUSD (1e18 scale)
    function setPrice(address tipToken, uint256 tipPerYUSD_1e18) external onlyOwner {
        require(tipToken != address(0), "token=0");
        require(tipPerYUSD_1e18 > 0, "price=0");
        price[tipToken] = tipPerYUSD_1e18;
        emit PriceUpdated(tipToken, tipPerYUSD_1e18);
    }

    /// @notice Fund the router's treasury with pre-minted tip tokens
    /// @dev Caller must approve this contract on the tipToken before calling
    function fundTipTreasury(address tipToken, uint256 amount) external {
        require(tipToken != address(0), "token=0");
        require(amount > 0, "amount=0");
        require(IERC20(tipToken).transferFrom(msg.sender, address(this), amount), "fund fail");
        emit Funded(tipToken, amount);
    }

    /// @notice Sweep accumulated YUSD to the treasury/streamer wallet
    function sweepYUSD(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "to=0");
        require(IERC20(yusd).transfer(to, amount), "sweep fail");
        emit SweptYUSD(to, amount);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "owner=0");
        emit OwnerTransferred(owner, newOwner);
        owner = newOwner;
    }

    // ========== Tipping ==========

    /// @notice Tip a single badge token to a streamer, paying in YUSD
    /// @param tipToken Badge token address (LOVE/SMILE/WINK/SUPER)
    /// @param streamer Destination wallet (the streamer)
    /// @param yusdAmount Amount of YUSD to charge the tipper (18 decimals)
    /// @param message Optional Superchat message
    function tip(address tipToken, address streamer, uint256 yusdAmount, string calldata message) external {
        uint256 p = price[tipToken];
        require(p > 0, "price not set");
        require(streamer != address(0), "streamer=0");
        require(yusdAmount > 0, "amount=0");

        // 1) Pull YUSD from the tipper
        require(IERC20(yusd).transferFrom(msg.sender, address(this), yusdAmount), "pull yusd");

        // 2) Compute tip token payout and send to streamer
        uint256 out = (yusdAmount * p) / 1e18;
        require(IERC20(tipToken).transfer(streamer, out), "send tip");

        emit Tipped(msg.sender, streamer, tipToken, yusdAmount, out, message);
    }

    /// @notice Tip multiple badge tokens in one transaction (good for batch settlement)
    /// @param tipTokens Array of badge token addresses
    /// @param streamer Destination wallet
    /// @param yusdAmounts Array of YUSD amounts (same length as tipTokens)
    /// @param message One message for the batch (UI can also encode per-tip messages off-chain)
    function tipBatch(address[] calldata tipTokens, address streamer, uint256[] calldata yusdAmounts, string calldata message) external {
        require(streamer != address(0), "streamer=0");
        require(tipTokens.length == yusdAmounts.length, "length mismatch");
        uint256 n = tipTokens.length;
        require(n > 0, "empty");

        uint256 totalYUSD = 0;
        uint256[] memory tipOut = new uint256[](n);

        // 1) Sum YUSD and precompute outputs
        for (uint256 i = 0; i < n; i++) {
            address t = tipTokens[i];
            uint256 amt = yusdAmounts[i];
            require(amt > 0, "amount=0");
            uint256 p = price[t];
            require(p > 0, "price not set");
            totalYUSD += amt;
            tipOut[i] = (amt * p) / 1e18;
        }

        // 2) Pull total YUSD once
        require(IERC20(yusd).transferFrom(msg.sender, address(this), totalYUSD), "pull yusd");

        // 3) Send all tip tokens
        for (uint256 i = 0; i < n; i++) {
            require(IERC20(tipTokens[i]).transfer(streamer, tipOut[i]), "send tip");
        }

        emit TippedBatch(msg.sender, streamer, tipTokens, yusdAmounts, tipOut, message);
    }
}
