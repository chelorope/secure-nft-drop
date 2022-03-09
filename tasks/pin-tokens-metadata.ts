import fs from "fs";
import { task } from "hardhat/config";
import { NFTStorage, File } from "nft.storage";
import mime from "mime";
import path from "path";

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

task("pin-tokens-metadata", "Generates NFTs metadata manifest").setAction(
  async () => {
    const metadata = JSON.parse(
      await fs.promises.readFile("./metadata/tokens-metadata.json", "utf8")
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
            metadataUrl: (await storeNFT(`./files/${file}`, name, description))
              .url,
            id,
          };
        }
      )
    );

    await fs.promises.writeFile(
      "./metadata/metadata-manifest.json",
      JSON.stringify(metadataManifest)
    );
  }
);
