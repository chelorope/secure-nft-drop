import { RunTaskFunction } from "hardhat/types";
import networkConfig, { developmentChains } from "./networks";

export const isDevelopementChain = (chainId: string): boolean => {
  return developmentChains.indexOf(networkConfig[chainId].name) !== -1;
};

export const getNetworkIdFromName = (networkIdName: string): string | null => {
  for (const id in networkConfig) {
    if (networkConfig[id].name === networkIdName) {
      return id;
    }
  }
  return null;
};

export const sleep = async (time: number /* in seconds */): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, time * 1000);
  });
};

export const verifyContract = async (
  {
    address,
    constructorArguments,
    chainId,
  }: {
    address: string;
    constructorArguments: any[];
    chainId: string;
  },
  run: RunTaskFunction
): Promise<void> => {
  if (!isDevelopementChain(chainId)) {
    const network = networkConfig[chainId].name;
    console.log(
      `https://${
        network !== "mainnet" ? network : ""
      }.etherscan.io/address/${address}`
    );
    console.log("Verifying contract....");
    await sleep(10); // Wait for etherscan to list the contract
    try {
      await run("verify:verify", {
        address,
        constructorArguments,
        network,
      });
    } catch (error: any) {
      console.log(error.message);
      console.log("The contract couldn't be verified yet");
      console.log("You can try later, running:");
      console.log(`npx hardhat verify-etherscan --network ${network}`);
    }
  }
};
