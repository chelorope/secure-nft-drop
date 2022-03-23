import { task } from "hardhat/config";
import fs from "fs";

task("verify-etherscan", "Prints the list of contracts deployed")
  .addParam("contract", "The contract name")
  .setAction(
    async (taskArgs, { run, deployments, network, getNamedAccounts }) => {
      const { contract } = taskArgs;
      const { deployer } = await getNamedAccounts();
      const Contract = await deployments.get(contract);
      const collectibleContract = await deployments.get(
        "CollectibleERC721ASecurity"
      );

      console.log("Verifying contract....", Contract.address);

      const baseURI = await fs.promises.readFile(
        "./metadata/open-art/baseURI.txt",
        "utf8"
      );
      await run("verify:verify", {
        address: Contract.address,
        constructorArguments: [collectibleContract.address, deployer, []],
        network: network.name,
      });
    }
  );
