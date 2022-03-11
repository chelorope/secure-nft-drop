import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import fs from "fs";
import { isDevelopementChain, sleep } from "../util";

const deployCollectible: DeployFunction = async ({
  getNamedAccounts,
  deployments,
  getChainId,
  run,
  network,
}: HardhatRuntimeEnvironment) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  log("Deploying contract from: ", deployer);

  const baseURI = await fs.promises.readFile(
    "./metadata/open-art/baseURI.txt",
    "utf8"
  );

  const collectible = await deploy("CollectibleERC721A", {
    from: deployer,
    args: [baseURI, 25],
    log: true,
    waitConfirmations: isDevelopementChain(chainId) ? 1 : 5,
  });

  log("Contract deployed on address:", collectible.address);

  if (!isDevelopementChain(chainId)) {
    log(
      `https://${
        network.name !== "mainnet" ? network.name : ""
      }.etherscan.io/address/${collectible.address}`
    );
    log("Verifying contract....");
    await sleep(10); // Wait for etherscan to list the contract
    try {
      await run("verify:verify", {
        address: collectible.address,
        constructorArguments: [baseURI, 25],
        network: network.name,
      });
    } catch (error: any) {
      log(error.message);
      log("The contract couldn't be verified yet");
      log("You can try later, running:");
      log(`npx hardhat verify-etherscan --network ${network.name}`);
    }
  }
  log("----------------------------------------------------");
};

export default deployCollectible;
deployCollectible.tags = ["all", "erc721a"];
