import { expect } from "chai";
import { ethers, deployments } from "hardhat";

describe("Collectible", function () {
  it("Should return the correct SVG URI", async function () {
    await deployments.fixture(["all"]);
    const Collectible = await deployments.get("Collectible");
    const collectible = await ethers.getContractAt(
      "Collectible",
      Collectible.address
    );
    console.log("Creating token...");
    const totalSuply = (await collectible.totalSuply()).toNumber();
  });
});
