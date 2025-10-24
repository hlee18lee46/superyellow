// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC20 {
    function transfer(address, uint256) external returns (bool);
    function transferFrom(address, address, uint256) external returns (bool);
}

contract SimpleExchange {
    IERC20 public immutable tokenA;
    IERC20 public immutable tokenB;
    uint256 public immutable priceBPerA; // 1e18 scale (B per 1 A)

    event Swapped(address indexed user, uint256 amountAIn, uint256 amountBOut);

    constructor(address _a, address _b, uint256 _priceBPerA) {
        tokenA = IERC20(_a);
        tokenB = IERC20(_b);
        priceBPerA = _priceBPerA;
    }

    function swapAforB(uint256 amountAIn) external {
        require(tokenA.transferFrom(msg.sender, address(this), amountAIn), "pull A");
        uint256 out = (amountAIn * priceBPerA) / 1e18;
        require(tokenB.transfer(msg.sender, out), "send B");
        emit Swapped(msg.sender, amountAIn, out);
    }
}
