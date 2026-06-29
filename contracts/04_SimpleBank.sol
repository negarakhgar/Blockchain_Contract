// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract SimpleBank {
    mapping(address => uint256) public balances;

    
    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);

    function deposit() public payable {
        require(msg.value > 0, "You must deposit some ETH");

        balances[msg.sender] = balances[msg.sender] + msg.value;

        emit Deposited(msg.sender, msg.value);
    }

    function withdraw() public {
        uint256 amount = balances[msg.sender];

        require(amount > 0, "No balance to withdraw");

        
        balances[msg.sender] = 0;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Withdraw failed");

        emit Withdrawn(msg.sender, amount);
    }
}
