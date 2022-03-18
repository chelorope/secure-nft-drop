import axios from "axios";
import { expect } from "chai";
import { ethers, deployments, getNamedAccounts } from "hardhat";
import { TransparentUpgradeableProxy } from "../typechain/TransparentUpgradeableProxy";
import { CollectibleERC721ASecurity } from "../typechain/CollectibleERC721ASecurity";

describe("CollectibleERC721ASecurity Proxy", function () {
  let proxy: TransparentUpgradeableProxy & CollectibleERC721ASecurity;
  let deployer: string;

  beforeEach(async () => {
    await deployments.fixture(["erc721a-security", "upgradeable-proxy"]);
    const Proxy = await deployments.get("TransparentUpgradeableProxy");
    proxy = (await ethers.getContractAt(
      "TransparentUpgradeableProxy",
      Proxy.address
    )) as TransparentUpgradeableProxy & CollectibleERC721ASecurity;
    deployer = (await getNamedAccounts()).deployer;
  });

  it("Delegation contract address should be the right one", async function () {
    const Collectible = await deployments.get("CollectibleERC721ASecurity");
    const implementationTx = await proxy.implementation();
    console.log("IMPLEMENTATION", implementationTx);

    const tst = await implementationTx.wait();
    console.log("ADDRESS:", Collectible.address, tst);
    expect(tst).equal(Collectible.address);
  });

  it("Total supply should be 0 (Using proxy)", async function () {
    console.log("Creating token...");
    const totalSupply = (await proxy.totalSupply()).toNumber();
    expect(totalSupply).equal(0);
  });

  it("Total supply should inrease after minting tokens (Using proxy)", async function () {
    const MINT_AMMOUNT = 2;

    const response = (
      await axios.get(
        `https://dev.nft-drop.jam3.cloud.jam3.net/api/mint-signature?quantity=${MINT_AMMOUNT}&address=${deployer}&recaptcha=tEs7Cap!?`
      )
    ).data;

    console.log("RESPONSE: ", response);
    const creationTx = await proxy.mint(
      response.hash,
      response.signature,
      response.nonce,
      response.quantity,
      { value: ethers.utils.parseEther("0.002") }
    );
    await creationTx.wait(1);

    const totalSupply = (await proxy.totalSupply()).toNumber();
    expect(totalSupply).equal(MINT_AMMOUNT);
  });
});
