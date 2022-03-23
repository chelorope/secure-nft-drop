import { verifyContract } from "./../util";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import fs from "fs";
import { isDevelopementChain, sleep } from "../util";

const deployCollectible: DeployFunction = async ({
  getNamedAccounts,
  deployments,
  getChainId,
  run,
}: HardhatRuntimeEnvironment) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  log("Deploying contract from: ", deployer);

  const baseURI = await fs.promises.readFile(
    "./metadata/open-art/baseURI.txt",
    "utf8"
  );

  const args = [baseURI, 25];

  const collectible = await deploy("CollectibleERC721A", {
    from: deployer,
    args,
    log: true,
    waitConfirmations: isDevelopementChain(chainId) ? 1 : 5,
  });

  log("Contract deployed on address:", collectible.address);

  await verifyContract(
    {
      address: collectible.address,
      constructorArguments: args,
      chainId,
    },
    run
  );
  log("----------------------------------------------------");
};

export default deployCollectible;
deployCollectible.tags = ["all", "erc721a"];
