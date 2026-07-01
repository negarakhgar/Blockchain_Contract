// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Lottery is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public token;
    uint256 private winningNumber;

    uint256 public constant PRIZE = 10 * 10 ** 18;

    mapping(address => bool) public hasParticipated;

    constructor(address tokenAddress, uint256 initialWinningNumber) Ownable(msg.sender) {
        require(tokenAddress != address(0), "Invalid token address");

        token = IERC20(tokenAddress);
        winningNumber = initialWinningNumber;
    }

    function guess(uint256 number) public {
        require(!hasParticipated[msg.sender], "You already participated");

        hasParticipated[msg.sender] = true;

        if (number == winningNumber) {
            require(token.balanceOf(address(this)) >= PRIZE, "Not enough tokens");
            token.safeTransfer(msg.sender, PRIZE);
        }
    }

    function resetWinningNumber(uint256 newNumber) public onlyOwner {
        winningNumber = newNumber;
    }

    function depositTokens(uint256 amount) public onlyOwner {
        require(amount > 0, "Amount must be positive");

        token.safeTransferFrom(msg.sender, address(this), amount);
    }

    function lotteryBalance() public view returns (uint256) {
        return token.balanceOf(address(this));
    }
}