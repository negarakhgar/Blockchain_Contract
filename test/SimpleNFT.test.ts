/**
 * SimpleNFT Test Summary
 *
 * This test file checks the SimpleNFT smart contract.
 *
 * The connection to the contract happens here:
 * ethers.deployContract("SimpleNFT", ["Simple NFT", "SNFT"])
 *
 * "SimpleNFT" must match the Solidity contract name:
 * contract SimpleNFT is ERC721
 *
 * What we test:
 * 1. The NFT collection has the correct name: "Simple NFT"
 * 2. The NFT collection has the correct symbol: "SNFT"
 * 3. The first mint creates NFT #1 for the owner
 * 4. The second mint creates NFT #2 for account2
 * 5. nextTokenId becomes 2 after two NFTs are minted
 *
 * Where the functions come from:
 * - mint()        -> written in our SimpleNFT contract
 * - nextTokenId() -> automatic getter from public variable
 * - name()        -> inherited from OpenZeppelin ERC721
 * - symbol()      -> inherited from OpenZeppelin ERC721
 * - ownerOf()     -> inherited from OpenZeppelin ERC721
 *
 * Testing tools:
 * - ethers.getSigners() gives fake test accounts
 * - ethers.deployContract() deploys the contract in the test blockchain
 * - connect(account2) calls the contract as account2
 * - expect(...).to.equal(...) checks the expected result
 */

import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("SimpleNFT", function () {
  async function deployNFT() {
    const [owner, account2] = await ethers.getSigners();

    const nft = await ethers.deployContract("SimpleNFT", [
      "Simple NFT",
      "SNFT",
    ]);

    return { nft, owner, account2 };
  }

  it("should have correct name and symbol", async function () {
    const { nft } = await deployNFT();

    expect(await nft.name()).to.equal("Simple NFT");
    expect(await nft.symbol()).to.equal("SNFT");
  });

  it("should mint NFT with incremental tokenId", async function () {
    const { nft, owner, account2 } = await deployNFT();

    await nft.mint();
    expect(await nft.ownerOf(1)).to.equal(owner.address);

    await nft.connect(account2).mint();
    expect(await nft.ownerOf(2)).to.equal(account2.address);

    expect(await nft.nextTokenId()).to.equal(2n);
  });
});