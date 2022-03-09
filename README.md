# JAM3 LABS SMART CONTRACT NFT

## Installation

```shell
npm install
```

## Setting environment variables

In this project, copy the .env.example file to a file named .env, and then edit it to fill in the details.

## Deployment

```shell
npx hardhat deploy --network <network>
```

## Etherscan verification

To try out Etherscan verification, you first need to deploy a contract to an Ethereum network that's supported by Etherscan, such as Rinkeby.

```shell
npx hardhat verify-etherscan --network <network>
```

## Uploading NFTs metadata to IPFS

1. Put the NFTs image files inside `./files` folder

2. Update the file `./metadata/tokens-metadata.json` setting `id`, `file`, `name` and `description`

3. Run:
   ```shell
   npx hardhat pin-tokens-metadata
   ```

A new file will be generated (`./metadata/metadata-manifest.json`) which can be used to mint new tokens

## Minting

```shell
npx hardhat run scripts/mint.ts --network <network>
```

## Tests

```shell
npx hardhat test --deploy-fixture
```
