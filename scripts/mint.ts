import { ethers, deployments, getNamedAccounts } from "hardhat";
import fs from "fs";

const main = async () => {
  const { deployer } = await getNamedAccounts();
  const Collectible = await deployments.get("CollectibleERC721A");
  const collectible = await ethers.getContractAt(
    "CollectibleERC721A",
    Collectible.address
  );
  try {
    // Assigns Minter role to deployer address
    const roleTx = await collectible.grantRole(
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE")),
      deployer
    );
    await roleTx.wait(1);

    // const metadata = JSON.parse(
    //   await fs.promises.readFile(
    //     "./metadata/open-art/metadata-manifest.json",
    //     "utf8"
    //   )
    // );
    const creationTx = await collectible.mint(1);
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
