import { DeployFunction, DeploymentSubmission } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import fs from "fs";
import { verifyContract, isDevelopementChain } from "../util";

const deployCollectible: DeployFunction = async ({
  getNamedAccounts,
  deployments,
  getChainId,
  upgrades,
  ethers,
  run,
}: HardhatRuntimeEnvironment) => {
  const { log, save } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();
  console.log(deployments);

  log("Deploying contract from: ", deployer);

  const baseURI = await fs.promises.readFile(
    "./metadata/open-art/baseURI.txt",
    "utf8"
  );

  const args = [baseURI];

  const ERC721SecurityUpgradeable = await ethers.getContractFactory(
    "CollectibleERC721SecurityUpgradeable"
  );

  const instance = await upgrades.deployProxy(ERC721SecurityUpgradeable, args, {
    initializer: "init",
    kind: "uups",
  });
  await instance.deployed();
  await instance.deployTransaction.wait(isDevelopementChain(chainId) ? 1 : 5);
  console.log("FACTORY: ", ERC721SecurityUpgradeable);
  console.log("CONTRACT: ", instance);

  save("CollectibleERC721SecurityUpgradeable", {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    ...instance,
    abi: JSON.parse(instance.interface.format("json") as string),
  } as DeploymentSubmission);
  console.log("Contract deployed on address:", instance.address);

  await verifyContract(
    {
      address: instance.address,
      constructorArguments: args,
      chainId,
    },
    run
  );
  log("----------------------------------------------------");
};

export default deployCollectible;
deployCollectible.tags = ["all", "erc721-security-upgradeable"];
