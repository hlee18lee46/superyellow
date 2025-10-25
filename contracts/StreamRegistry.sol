// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * StreamRegistry lets a wallet mark itself as "live" with a display name and (optional) URL.
 * Viewers discover active streams by reading the contract (or by indexing the events).
 */
contract StreamRegistry {
    struct Stream {
        address streamer;
        string  name;      // e.g. "Only SuperFans — Han"
        string  url;       // optional: link to player/room (Livepeer/HLS/WebRTC/etc.)
        bool    active;
    }

    // streamer => current stream info
    mapping(address => Stream) public streams;
    // enumerable active set (cheap-ish for small sets)
    address[] public activeList;
    mapping(address => uint256) private idxInActive; // 1-based index; 0 = not in list

    event StreamStarted(address indexed streamer, string name, string url);
    event StreamUpdated(address indexed streamer, string name, string url);
    event StreamStopped(address indexed streamer);

    function startStream(string calldata name, string calldata url) external {
        Stream storage s = streams[msg.sender];
        s.streamer = msg.sender;
        s.name     = name;
        s.url      = url;
        if (!s.active) {
            s.active = true;
            activeList.push(msg.sender);
            idxInActive[msg.sender] = activeList.length; // 1-based
            emit StreamStarted(msg.sender, name, url);
        } else {
            emit StreamUpdated(msg.sender, name, url);
        }
    }

    function updateStream(string calldata name, string calldata url) external {
        Stream storage s = streams[msg.sender];
        require(s.active, "not live");
        s.name = name;
        s.url  = url;
        emit StreamUpdated(msg.sender, name, url);
    }

    function stopStream() external {
        Stream storage s = streams[msg.sender];
        require(s.active, "not live");
        s.active = false;

        // remove from activeList (swap & pop)
        uint256 i = idxInActive[msg.sender];
        if (i != 0) {
            uint256 last = activeList.length;
            if (i != last) {
                address moved = activeList[last - 1];
                activeList[i - 1] = moved;
                idxInActive[moved] = i;
            }
            activeList.pop();
            idxInActive[msg.sender] = 0;
        }

        emit StreamStopped(msg.sender);
    }

    // --- Views ---
    function getStream(address streamer) external view returns (Stream memory) {
        return streams[streamer];
    }

    function getActiveStreams()
        external
        view
        returns (Stream[] memory)
    {
        uint256 n = activeList.length;
        Stream[] memory out = new Stream[](n);
        for (uint256 i = 0; i < n; i++) {
            out[i] = streams[activeList[i]];
        }
        return out;
    }

    function activeCount() external view returns (uint256) {
        return activeList.length;
    }
}