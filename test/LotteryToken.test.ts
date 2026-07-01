/**
 * LotteryToken Test Main Idea
 *
 * This test checks the basic ERC20 token behavior.
 *
 * We deploy one contract:
 * 1. LotteryToken: creates an ERC20 token called "Lottery Token" with symbol "LTK".
 *
 * Test story:
 * - The owner deploys the LotteryToken contract with initial supply 1000.
 * - The owner receives all 1000 LTK at the beginning.
 * - We check that the token name, symbol, and decimals are correct.
 * - We transfer 10 LTK from owner to account2.
 * - We approve account2 to spend 50 LTK from the owner's balance.
 * - account2 uses transferFrom to take those 50 LTK.
 *
 * Main goal:
 * Make sure the ERC20 token can:
 * - store correct name, symbol, and decimals
 * - give initial supply to the deployer
 * - transfer tokens normally
 * - approve another account to spend tokens
 * - use transferFrom after approval
 */

import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("LotteryToken", function () {
  async function deployToken() {
    const [owner, account2] = await ethers.getSigners();

    const token = await ethers.deployContract("LotteryToken", [1000]);

    return { token, owner, account2 };
  }

  it("should have correct name, symbol and decimals", async function () {
    const { token } = await deployToken();

    expect(await token.name()).to.equal("Lottery Token");
    expect(await token.symbol()).to.equal("LTK");
    expect(await token.decimals()).to.equal(18n);
  });

  it("should assign initial supply to deployer", async function () {
    const { token, owner } = await deployToken();

    const expectedSupply = ethers.parseUnits("1000", 18);

    expect(await token.balanceOf(owner.address)).to.equal(expectedSupply);
  });

  it("should transfer tokens between accounts", async function () {
    const { token, owner, account2 } = await deployToken();

    const amount = ethers.parseUnits("10", 18);

    await token.transfer(account2.address, amount);

    expect(await token.balanceOf(account2.address)).to.equal(amount);
    expect(await token.balanceOf(owner.address)).to.equal(
      ethers.parseUnits("990", 18)
    );
  });

  it("should approve and transferFrom tokens", async function () {
    const { token, owner, account2 } = await deployToken();

    const amount = ethers.parseUnits("50", 18);

    await token.approve(account2.address, amount);

    expect(await token.allowance(owner.address, account2.address)).to.equal(
      amount
    );

    await token.connect(account2).transferFrom(
      owner.address,
      account2.address,
      amount
    );

    expect(await token.balanceOf(account2.address)).to.equal(amount);
    expect(await token.balanceOf(owner.address)).to.equal(
      ethers.parseUnits("950", 18)
    );
  });
});