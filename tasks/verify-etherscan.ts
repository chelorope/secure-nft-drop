import { task } from "hardhat/config";

task(
  "verify-etherscan",
  "Prints the list of contracts deployed",
  async (taskArgs, { run, deployments, network }) => {
    const Collectible = await deployments.get("Collectible");
    await run("verify:verify", {
      address: Collectible.address,
      constructorArguments: [],
      network: network.name,
    });
  }
);
