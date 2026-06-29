// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Vault {
    uint256 public balance;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    function deposit(uint256 amount) public {
        require(amount > 0, "Amount must be greater than zero");
        balance = balance + amount;
    }

    function withdraw(uint256 amount) public onlyOwner {
        require(amount <= balance, "Not enough balance");
        balance = balance - amount;
    }
}
