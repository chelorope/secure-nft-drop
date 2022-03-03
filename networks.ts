const networkConfig: Record<string, any> = {
  default: {
    name: "hardhat",
    /* .... Add some other variables for this network .... */
  },
  "31337": {
    name: "localhost",
  },
  "1337": {
    name: "ganache",
  },
  "42": {
    name: "kovan",
  },
  "4": {
    name: "rinkeby",
  },
  "1": {
    name: "mainnet",
  },
  "5": {
    name: "goerli",
  },
  "80001": {
    name: "mumbai",
  },
  "137": {
    name: "polygon",
  },
};

export default networkConfig;

export const developmentChains = ["hardhat", "localhost", "ganache"];
