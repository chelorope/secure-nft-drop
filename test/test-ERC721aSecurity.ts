import axios from "axios";
import { expect } from "chai";
import { ethers, deployments, getNamedAccounts } from "hardhat";
import { CollectibleERC721ASecurity } from "../typechain/CollectibleERC721ASecurity";

describe("CollectibleERC721ASecurity", function () {
  let collectible: CollectibleERC721ASecurity;
  let deployer: string;

  beforeEach(async () => {
    await deployments.fixture(["erc721a-security"]);
    const Collectible = await deployments.get("CollectibleERC721ASecurity");
    collectible = (await ethers.getContractAt(
      "CollectibleERC721ASecurity",
      Collectible.address
    )) as CollectibleERC721ASecurity;
    deployer = (await getNamedAccounts()).deployer;
  });

  it("Total supply should be 0", async function () {
    console.log("Creating token...");
    const totalSupply = (await collectible.totalSupply()).toNumber();
    expect(totalSupply).equal(0);
  });

  it("Total supply should inrease after minting tokens", async function () {
    const MINT_AMMOUNT = 3;

    const response = (
      await axios.get(
        `https://dev.nft-drop.jam3.cloud.jam3.net/api/mint-signature?quantity=${MINT_AMMOUNT}&address=${deployer}`
      )
    ).data;

    console.log("RESPONSE: ", response);
    console.log("VALUE:", ethers.utils.parseEther("0.002"));
    console.log("DEPLOYER:", deployer);
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
});
