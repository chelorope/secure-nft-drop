import { expect } from "chai";
import { ethers, deployments, getNamedAccounts } from "hardhat";
import fs from "fs";
import { CollectibleERC721URIStorage } from "../typechain/CollectibleERC721URIStorage";

describe("Collectible", function () {
  let collectible: CollectibleERC721URIStorage;
  let deployer: string;

  beforeEach(async () => {
    await deployments.fixture(["erc721storage"]);
    const Collectible = await deployments.get("CollectibleERC721URIStorage");
    collectible = (await ethers.getContractAt(
      "CollectibleERC721URIStorage",
      Collectible.address
    )) as CollectibleERC721URIStorage;
    deployer = (await getNamedAccounts()).deployer;
  });

  it("Total supply should be 0", async function () {
    console.log("Creating token...");
    const totalSupply = (await collectible.totalSupply()).toNumber();
    expect(totalSupply).equal(0);
  });

  it("Total supply should inrease after minting tokens", async function () {
    const metadata = JSON.parse(
      await fs.promises.readFile(
        "./metadata/open-art/metadata-manifest.json",
        "utf8"
      )
    );

    // Assigns Minter role to deployer address
    const roleTx = await collectible.grantRole(
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE")),
      deployer
    );
    await roleTx.wait(1);

    const creationTx = await collectible.mint(metadata);
    await creationTx.wait(1);

    const totalSupply = (await collectible.totalSupply()).toNumber();
    expect(totalSupply).equal(metadata.length);
  });
});
