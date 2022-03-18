import { task } from "hardhat/config";
import fs from "fs";

task("verify-etherscan", "Prints the list of contracts deployed")
  .addParam("contract", "The contract name")
  .setAction(async (taskArgs, { run, deployments, network }) => {
    const { contract } = taskArgs;
    const Collectible = await deployments.get(contract);

    console.log("Verifying contract....", Collectible.address);

    const baseURI = await fs.promises.readFile(
      "./metadata/open-art/baseURI.txt",
      "utf8"
    );
    await run("verify:verify", {
      address: Collectible.address,
      constructorArguments: [baseURI],
      network: network.name,
    });
  });
