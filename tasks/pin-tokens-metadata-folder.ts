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

async function genMetadataFile(
  tokenId: number,
  imageCID: string,
  name: string,
  description: string
) {
  const metadata = {
    image: `ipfs://${imageCID}`,
    name,
    description,
  };
  return new File([JSON.stringify(metadata)], tokenId.toString());
}

task("pin-tokens-metadata-folder", "Generates NFTs metadata manifest")
  .addParam("collection", "Collection's folder name")
  .setAction(async (taskArgs) => {
    const { collection } = taskArgs;
    const nftstorage = new NFTStorage({
      token: process.env.NFT_STORAGE_API_KEY || "",
    });

    const metadata = JSON.parse(
      await fs.promises.readFile(
        `${METADATA_PATH}/${collection}/tokens-metadata.json`,
        "utf8"
      )
    );

    const metadataFiles = await Promise.all(
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
          const image = await fileFromPath(
            `${FILES_PATH}/${collection}/${file}`
          );
          const imageCID = await nftstorage.storeBlob(image);
          return genMetadataFile(id, imageCID, name, description);
        }
      )
    );

    console.log(`storing ${metadataFiles.length} file(s) from ${FILES_PATH}`);
    const cid = await nftstorage.storeDirectory(
      metadataFiles as unknown as File[]
    );
    console.log({ cid });
    await fs.promises.writeFile(
      `${METADATA_PATH}/${collection}/baseURI.txt`,
      `ipfs://${cid}/`
    );
    console.log(
      `Metadata successfully uploaded to ipfs.\n You'll find the baseURI to use on the contract in ${METADATA_PATH}/baseURI.txt`
    );
  });
