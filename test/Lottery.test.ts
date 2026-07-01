/**
 * Lottery Test Main Idea
 *
 * This test checks the first basic setup of the Lottery contract.
 *
 * We deploy two contracts:
 * 1. LotteryToken: the ERC20 token used as the prize.
 * 2. Lottery: the game contract where players guess a number.
 *
 * Test story:
 * - The owner deploys LotteryToken with initial supply 1000.
 * - The owner deploys Lottery and gives it:
 *   1. the LotteryToken contract address
 *   2. the winning number 7
 * - We check that Lottery correctly saved the token address.
 * - We check that the prize amount is 10 LTK.
 *
 * Main goal:
 * Make sure the Lottery contract knows which ERC20 token it must use for prizes,
 * and that the fixed prize is 10 LTK.
 *
 * Important:
 * This file currently does NOT test depositTokens, guess, resetWinningNumber,
 * wrong guess, correct guess, or one participation only.
 */
import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("Lottery", function () {
  async function deployLottery() {
    const [owner, player] = await ethers.getSigners();

    const token = await ethers.deployContract("LotteryToken", [1000]);
    const lottery = await ethers.deployContract("Lottery", [
      await token.getAddress(),
      7,
    ]);

    return { token, lottery, owner, player };
  }

  it("should store the token address and prize", async function () {
    const { token, lottery } = await deployLottery();

    expect(await lottery.token()).to.equal(await token.getAddress());
    expect(await lottery.PRIZE()).to.equal(ethers.parseUnits("10", 18));
  });
});