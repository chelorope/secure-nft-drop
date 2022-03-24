import { ethers, getNamedAccounts, getChainId, upgrades, run } from "hardhat";
import { verifyContract, isDevelopementChain } from "../util";
import fs from "fs";

const main = async () => {
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  console.log("Deploying contract from: ", deployer);

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
  console.log("Contract deployed on address:", instance.address);

  await verifyContract(
    {
      address: instance.address,
      constructorArguments: args,
      chainId,
    },
    run
  );
};

main()
  .then(() => {
    console.log("Collectible created");
  })
  .catch((error) => console.error(error));
