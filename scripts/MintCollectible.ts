import { sleep } from "../util";
import { ethers, deployments, getNamedAccounts } from "hardhat";

const main = async () => {
  const { deployer } = await getNamedAccounts();
  const Collectible = await deployments.get("Collectible");
  const collectible = await ethers.getContractAt(
    "Collectible",
    Collectible.address
  );

  console.log("Creating Collectible on contract: ", Collectible.address);

  try {
    const creationTx = await collectible.create({
      from: deployer,
    });
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

main()
  .then(() => {
    console.log("Collectible created");
  })
  .catch((error) => console.error(error));
