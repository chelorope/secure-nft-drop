import { ethers, deployments, getNamedAccounts } from "hardhat";
import fs from "fs";

const main = async () => {
  const { deployer } = await getNamedAccounts();
  const Collectible = await deployments.get("Collectible");
  const collectible = await ethers.getContractAt(
    "Collectible",
    Collectible.address
  );
  try {
    // Assigns Minter role to deployer address
    const roleTx = await collectible.grantRole(
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE")),
      deployer
    );
    await roleTx.wait(1);

    const metadata = JSON.parse(
      await fs.promises.readFile("./metadata/metadata-manifest.json", "utf8")
    );
    const creationTx = await collectible.mint(metadata);
    await creationTx.wait(1);
    console.log("Total Supply:", await collectible.totalSupply());
  } catch (error: any) {
    console.log(error.message);
  }
};

main()
  .then(() => {
    console.log("Collectible created");
  })
  .catch((error) => console.error(error));
