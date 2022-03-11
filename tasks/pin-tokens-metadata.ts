import fs from "fs";
import { task } from "hardhat/config";
import { NFTStorage, File } from "nft.storage";
import mime from "mime";
import path from "path";

const FILES_PATH = "./files";
const METADATA_PATH = "./metadata";

async function fileFromPath(filePath: string) {
  const content = await fs.promises.readFile(filePath);
  const type = mime.getType(filePath) || undefined;
  return new File([content], path.basename(filePath), { type });
}

async function storeNFT(imagePath: string, name: string, description: string) {
  const image = await fileFromPath(imagePath);
  const nftstorage = new NFTStorage({
    token: process.env.NFT_STORAGE_API_KEY || "",
  });
  return nftstorage.store({
    image,
    name,
    description,
  });
}

task("pin-tokens-metadata", "Generates NFTs metadata manifest")
  .addParam("collection", "Collection's folder name")
  .setAction(async (taskArgs) => {
    const { collection } = taskArgs;
    const metadata = JSON.parse(
      await fs.promises.readFile(
        `${METADATA_PATH}/${collection}/tokens-metadata.json`,
        "utf8"
      )
    );
    const metadataManifest = await Promise.all(
      metadata.map(
        async ({
          id,
          file,
          name,
          description,
        }: {
          id: number;
          file: string;
          name: string;
          description: string;
        }) => {
          return {
            metadataUrl: (
              await storeNFT(
                `${FILES_PATH}/${collection}/${file}`,
                name,
                description
              )
            ).url,
            id,
          };
        }
      )
    );
    await fs.promises.writeFile(
      `${METADATA_PATH}/${collection}/metadata-manifest.json`,
      JSON.stringify(metadataManifest)
    );
  });
