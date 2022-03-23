import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import fs from "fs";
import { verifyContract } from "../util";

const deployCollectible: DeployFunction = async ({
  getNamedAccounts,
  deployments,
  getChainId,
  upgrades,
  ethers,
  run,
}: HardhatRuntimeEnvironment) => {
  const { log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

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
  // instance.deployTransaction.wait(5);
  // log("Contract deployed on address:", instance.address);

  // await verifyContract(
  //   {
  //     address: instance.address,
  //     constructorArguments: args,
  //     chainId,
  //   },
  //   run
  // );
  // log("----------------------------------------------------");
};

export default deployCollectible;
deployCollectible.tags = ["all", "erc721-security-upgradeable"];
