// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract HelloWorld {
    string private message;
        uint256 public counter;


    constructor(string memory _message) {

            message = _message;

    }

    function getMessage() public view returns (string memory) {
        return message;
    }

    function setMessage(string memory _newMessage) public {
        message = _newMessage;
    }

    function increment() public {
        counter = counter + 1;
    }

    function decrement() public {
        require(counter > 0, "Counter cannot go below zero");
        counter = counter - 1;
    }
}
