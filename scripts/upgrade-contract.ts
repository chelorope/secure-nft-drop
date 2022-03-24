import { ethers, getNamedAccounts, deployments, upgrades } from "hardhat";

const FROM_UPGRADE = "CollectibleERC721SecurityUpgradeable";
const TO_UPGRADE = "CollectibleERC721SecurityUpgradeableV2Test";

const main = async () => {
  const { deployer } = await getNamedAccounts();

  console.log("Upgrading contract from: ", deployer);

  const Collectible = await deployments.get(FROM_UPGRADE);

  const CollectibleERC721SecurityUpgradeableV2Test =
    await ethers.getContractFactory(TO_UPGRADE);

  const instance = await upgrades.upgradeProxy(
    Collectible.address,
    CollectibleERC721SecurityUpgradeableV2Test,
    {
      kind: "uups",
    }
  );
  await instance.deployed();
  return instance.address;
};

main()
  .then((address) => {
    console.log(`Contract upgraded on address ${address}`);
  })
  .catch((error) => console.error(error));
