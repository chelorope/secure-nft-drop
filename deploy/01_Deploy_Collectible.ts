import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
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

  const collectible = await deploy("Collectible", {
    from: deployer,
    args: [],
    log: true,
  });

  log("Contract deployed on address:", collectible.address);

  if (!isDevelopementChain(chainId)) {
    log(
      `https://${
        network.name !== "mainnet" ? network.name : ""
      }.etherscan.io/address/${collectible.address}`
    );
    log("Verifying contract....");
    await sleep(30); // Wait for etherscan to list the contract
    try {
      await run("verify:verify", {
        address: collectible.address,
        constructorArguments: [],
        network: network.name,
      });
    } catch (error: any) {
      log(error.message);
      log("The contract couldn't be verified yet");
      log("You can try later, running:");
      log(`npx hardhat run verify-etherscan --network ${network.name}`);
    }
  }
  log("----------------------------------------------------");
};

export default deployCollectible;
export const tags = ["all", "collectible"];
