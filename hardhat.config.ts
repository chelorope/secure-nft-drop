import * as dotenv from "dotenv";

import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat";
import "hardhat-deploy";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@nomiclabs/hardhat-truffle5";

import "./tasks/accounts";
import "./tasks/contracts";
import "./tasks/balance";
import "./tasks/verify-etherscan";

dotenv.config();

const {
  PRIVATE_KEY = "",
  RINKEBY_RPC_URL,
  MUMBAI_RPC_URL,
  POLYGON_MAINNET_RPC_URL,
  GANACHE_MNEMONIC,
  ETHERSCAN_API_KEY,
} = process.env;

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  solidity: {
    compilers: [{ version: "0.8.0" }],
  },
  networks: {
    rinkeby: {
      url: RINKEBY_RPC_URL,
      accounts: [PRIVATE_KEY],
      saveDeployments: true,
    },
    ganache: {
      url: "http://localhost:7545",
      accounts: {
        mnemonic: GANACHE_MNEMONIC,
      },
    },
    mumbai: {
      url: MUMBAI_RPC_URL,
      accounts: [PRIVATE_KEY],
      saveDeployments: true,
    },
    polygon: {
      url: POLYGON_MAINNET_RPC_URL,
      accounts: [PRIVATE_KEY],
      saveDeployments: true,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
    feeCollector: {
      default: 1,
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  mocha: {
    timeout: 300000,
  },
};

export default config;