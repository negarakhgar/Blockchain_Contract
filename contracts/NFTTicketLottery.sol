// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTTicketLottery is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable prizeToken;
    IERC721 public immutable ticketNFT;

    uint256 private winningNumber;

    uint256 public constant PRIZE = 10 * 10 ** 18;

    mapping(uint256 => bool) public ticketUsed;

    constructor(
        address prizeTokenAddress,
        address ticketNFTAddress,
        uint256 initialWinningNumber
    ) Ownable(msg.sender) {
        require(prizeTokenAddress != address(0), "Invalid token address");
        require(ticketNFTAddress != address(0), "Invalid NFT address");

        prizeToken = IERC20(prizeTokenAddress);
        ticketNFT = IERC721(ticketNFTAddress);
        winningNumber = initialWinningNumber;
    }

    function guessWithTicket(uint256 ticketId, uint256 number) public {
        require(ticketNFT.ownerOf(ticketId) == msg.sender, "Not ticket owner");
        require(!ticketUsed[ticketId], "Ticket already used");

        ticketUsed[ticketId] = true;

        if (number == winningNumber) {
            require(
                prizeToken.balanceOf(address(this)) >= PRIZE,
                "Not enough prize tokens"
            );

            prizeToken.safeTransfer(msg.sender, PRIZE);
        }
    }

    function resetWinningNumber(uint256 newNumber) public onlyOwner {
        winningNumber = newNumber;
    }

    function depositPrizeTokens(uint256 amount) public onlyOwner {
        require(amount > 0, "Amount must be positive");

        prizeToken.safeTransferFrom(
            msg.sender,
            address(this),
            amount
        );
    }

    function lotteryBalance() public view returns (uint256) {
        return prizeToken.balanceOf(address(this));
    }
}