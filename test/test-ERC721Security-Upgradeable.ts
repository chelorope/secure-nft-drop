import axios from "axios";
import { expect } from "chai";
import { ethers, deployments, getNamedAccounts, upgrades } from "hardhat";
import { CollectibleERC721SecurityUpgradeable } from "../typechain/CollectibleERC721SecurityUpgradeable";
import fs from "fs";

describe("CollectibleERC721SecurityUpgradeable", function () {
  let collectible: CollectibleERC721SecurityUpgradeable;
  let deployer: string;
  const MINT_AMMOUNT = 1;

  before(async () => {
    deployer = (await getNamedAccounts()).deployer;
    const baseURI = await fs.promises.readFile(
      "./metadata/open-art/baseURI.txt",
      "utf8"
    );
    const ERC721SecurityUpgradeable = await ethers.getContractFactory(
      "CollectibleERC721SecurityUpgradeable"
    );

    collectible = (await upgrades.deployProxy(
      ERC721SecurityUpgradeable,
      [baseURI],
      {
        initializer: "init",
        kind: "uups",
      }
    )) as CollectibleERC721SecurityUpgradeable;
    collectible.deployed();
  });

  it("Total supply should be 0 (Using proxy)", async function () {
    const totalSupply = (await collectible.totalSupply()).toNumber();
    expect(totalSupply).equal(0);
  });

  it("Contract version should be V1 (Using proxy)", async function () {
    const contractVersion = await collectible.CONTRACT_VERSION();
    expect(contractVersion).equal("V1");
  });

  it("Total supply should inrease after minting tokens (Using proxy)", async function () {
    const response = (
      await axios.get(
        `https://dev.nft-drop.jam3.cloud.jam3.net/api/mint-signature?quantity=${MINT_AMMOUNT}&address=${deployer}&recaptcha=tEs7Cap!?`
      )
    ).data;

    const creationTx = await collectible.mint(
      response.hash,
      response.signature,
      response.nonce,
      response.quantity,
      { value: ethers.utils.parseEther("0.002") }
    );
    await creationTx.wait(1);
    const totalSupply = (await collectible.totalSupply()).toNumber();
    expect(totalSupply).equal(MINT_AMMOUNT);
  });

  it("Total supply should be the same after upgrading (Using proxy)", async function () {
    const ERC721SecurityUpgradeable = await ethers.getContractFactory(
      "CollectibleERC721SecurityUpgradeableV2Test"
    );
    // Reassigns contract to upgrade
    collectible = (await upgrades.upgradeProxy(
      collectible.address,
      ERC721SecurityUpgradeable,
      {
        kind: "uups",
      }
    )) as CollectibleERC721SecurityUpgradeable;
    collectible.deployed();

    const totalSupply = (await collectible.totalSupply()).toNumber();
    expect(totalSupply).equal(MINT_AMMOUNT);
  });

  it("Contract version should be V2 (Using proxy)", async function () {
    const contractVersion = await collectible.CONTRACT_VERSION();
    expect(contractVersion).equal("V2");
  });
});
