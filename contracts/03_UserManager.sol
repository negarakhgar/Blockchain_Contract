// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract UserManager {
    mapping(address => uint256) public balances;

    struct User {
        string name;
        uint256 age;
    }

    mapping(address => User) public users;

    mapping(address => bool) public isRegistered;

    function increaseMyBalance(uint256 amount) public {
        require(amount > 0, "Amount must be greater than zero");
        balances[msg.sender] = balances[msg.sender] + amount;
    }

    function getBalance(address userAddress) public view returns (uint256) {
        return balances[userAddress];
    }

    function registerUser(string memory _name, uint256 _age) public {
        require(!isRegistered[msg.sender], "User already registered");

        users[msg.sender] = User(_name, _age);
        isRegistered[msg.sender] = true;
    }
}
