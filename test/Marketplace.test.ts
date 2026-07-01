/**
 * Marketplace Test Main Idea
 *
 * This test checks the basic NFT marketplace flow.
 *
 * We deploy two contracts:
 * 1. SimpleNFT: creates NFTs.
 * 2. Marketplace: sells NFTs.
 *
 * Test story:
 * - The seller mints NFT #1.
 * - The seller approves the Marketplace to move NFT #1.
 * - The seller lists NFT #1 for sale.
 * - The buyer buys NFT #1 by sending ETH.
 * - The Marketplace transfers NFT #1 from seller to buyer.
 * - The sale is deleted after buying.
 *
 * We also test that the seller can cancel a sale before it is bought.
 *
 * Main goal:
 * Make sure the Marketplace can:
 * - create a sale
 * - buy an NFT
 * - cancel a sale
 * - delete the sale after buy/cancel
 */

import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("Marketplace", function () {
  async function deployMarketplace() {
    const [seller, buyer] = await ethers.getSigners();

    const nft = await ethers.deployContract("SimpleNFT", [
      "Simple NFT",
      "SNFT",
    ]);

    const marketplace = await ethers.deployContract("Marketplace", [
      await nft.getAddress(),
    ]);

    await nft.mint();

    return { nft, marketplace, seller, buyer };
  }

  it("should create a sale", async function () {
    const { nft, marketplace, seller } = await deployMarketplace();

    const price = ethers.parseEther("1");

    await nft.approve(await marketplace.getAddress(), 1);

    await marketplace.createSale(1, price);

    const sale = await marketplace.sales(1);

    expect(sale.seller).to.equal(seller.address);
    expect(sale.tokenId).to.equal(1n);
    expect(sale.price).to.equal(price);
  });

  it("should allow buyer to buy NFT", async function () {
    const { nft, marketplace, seller, buyer } = await deployMarketplace();

    const price = ethers.parseEther("1");

    await nft.approve(await marketplace.getAddress(), 1);

    await marketplace.createSale(1, price);

    await marketplace.connect(buyer).buy(1, {
      value: price,
    });

    expect(await nft.ownerOf(1)).to.equal(buyer.address);

    const sale = await marketplace.sales(1);
    expect(sale.seller).to.equal(ethers.ZeroAddress);
  });

  it("should allow seller to cancel sale", async function () {
    const { nft, marketplace } = await deployMarketplace();

    const price = ethers.parseEther("1");

    await nft.approve(await marketplace.getAddress(), 1);

    await marketplace.createSale(1, price);

    await marketplace.cancelSale(1);

    const sale = await marketplace.sales(1);

    expect(sale.seller).to.equal(ethers.ZeroAddress);
  });
});