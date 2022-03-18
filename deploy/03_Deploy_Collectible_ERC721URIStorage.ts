import { verifyContract } from "./../util";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
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

  const collectible = await deploy("CollectibleERC721URIStorage", {
    from: deployer,
    args: [25],
    log: true,
    waitConfirmations: isDevelopementChain(chainId) ? 1 : 5,
  });

  log("Contract deployed on address:", collectible.address);

  await verifyContract(
    {
      address: collectible.address,
      constructorArguments: [25],
      chainId,
    },
    run
  );
  log("----------------------------------------------------");
};

export default deployCollectible;
deployCollectible.tags = ["all", "erc721storage"];
