import { expect } from "chai";
import { ethers, deployments, getNamedAccounts } from "hardhat";
import fs from "fs";
import { Collectible } from "../typechain/Collectible";

describe("Collectible", function () {
  let collectible: Collectible;
  let deployer: string;

  beforeEach(async () => {
    await deployments.fixture(["collectible"]);
    const Collectible = await deployments.get("Collectible");
    collectible = await ethers.getContractAt(
      "Collectible",
      Collectible.address
    );
    deployer = (await getNamedAccounts()).deployer;
  });

  it("Total supply should be 0", async function () {
    console.log("Creating token...");
    const totalSupply = (await collectible.totalSupply()).toNumber();
    expect(totalSupply).equal(0);
  });

  it("Total supply should inrease after minting tokens", async function () {
    const metadata = JSON.parse(
      await fs.promises.readFile("./metadata/metadata-manifest.json", "utf8")
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
