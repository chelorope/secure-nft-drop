import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { isDevelopementChain, verifyContract } from "../util";

const deployCollectible: DeployFunction = async ({
  getNamedAccounts,
  deployments,
  getChainId,
  run,
}: HardhatRuntimeEnvironment) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();
  const contract = await deployments.get("CollectibleERC721ASecurity");

  log("Deploying contract from: ", deployer);

  const proxyContract = await deploy("TransparentUpgradeableProxy", {
    from: deployer,
    args: [contract.address, deployer, []],
    log: true,
    waitConfirmations: isDevelopementChain(chainId) ? 1 : 5,
  });

  log("Contract deployed on address:", proxyContract.address);

  await verifyContract(
    {
      address: proxyContract.address,
      constructorArguments: [],
      chainId,
    },
    run
  );
  log("----------------------------------------------------");
};

export default deployCollectible;
deployCollectible.tags = ["all", "upgradeable-proxy"];
