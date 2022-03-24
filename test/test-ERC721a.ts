import { expect } from "chai";
import { ethers, deployments, getNamedAccounts } from "hardhat";
import fs from "fs";
import { CollectibleERC721A } from "../typechain/CollectibleERC721A";

describe("CollectibleERC721A", function () {
  let collectible: CollectibleERC721A;
  let deployer: string;

  beforeEach(async () => {
    await deployments.fixture(["erc721a"]);
    const Collectible = await deployments.get("CollectibleERC721A");
    collectible = (await ethers.getContractAt(
      "CollectibleERC721A",
      Collectible.address
    )) as CollectibleERC721A;
    deployer = (await getNamedAccounts()).deployer;
  });

  it("Total supply should be 0", async function () {
    const totalSupply = (await collectible.totalSupply()).toNumber();
    expect(totalSupply).equal(0);
  });

  it("Total supply should inrease after minting tokens", async function () {
    const MINT_AMMOUNT = 25;
    // Assigns Minter role to deployer address
    const roleTx = await collectible.grantRole(
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE")),
      deployer
    );
    await roleTx.wait(1);

    const creationTx = await collectible.mint(MINT_AMMOUNT);
    await creationTx.wait(1);

    const totalSupply = (await collectible.totalSupply()).toNumber();
    expect(totalSupply).equal(MINT_AMMOUNT);
  });
});
