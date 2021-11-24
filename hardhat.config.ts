import "@typechain/hardhat";
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-etherscan';
import '@openzeppelin/hardhat-upgrades';
import 'hardhat-gas-reporter';
import "solidity-coverage";

import { task } from 'hardhat/config';
import { config as dotenvConfig } from 'dotenv';
import { resolve } from 'path';
import { HardhatUserConfig, NetworkUserConfig } from 'hardhat/types';
import "./type-extensions";

dotenvConfig({ path: resolve(__dirname, './.env') });

const chainIds = {
  mainnet: 1,
  ropsten: 3,
  rinkeby: 4,  
  goerli: 5,
  kovan: 42,
  ganache: 1337,
  hardhat: 31337,
};

const VERBOSE = false;

const PRIVATE_MNEMONIC = process.env.PRIVATE_MNEMONIC || '';
const INFURA_API_KEY = process.env.INFURA_API_KEY || '';
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || '';

export const createConfig = (
  network: keyof typeof chainIds,
): NetworkUserConfig => {
  const url: string = 'https://' + network + '.infura.io/v3/' + INFURA_API_KEY;
  console.log(`config generation for ${chainIds[network]}, ${url}`);
  false && console.log(`Using ${url} with key:${PRIVATE_MNEMONIC}`);
  return {
      accounts: {
        count: 10,
        initialIndex: 0,
      mnemonic: PRIVATE_MNEMONIC,
        path: "m/44'/60'/0'/0",
      },
      chainId: chainIds[network],
      url,
    };    
};

/* You need to export an object to set up your config
  Go to https://hardhat.org/config/ to learn more */
const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  gasReporter: {
    currency: 'USD',
    gasPrice: 100,
    enabled: process.env.REPORT_GAS ? true : false,
    excludeContracts: [],
    src: "./contracts",
  },
  networks: {
    hardhat: {
      accounts: {
        mnemonic: PRIVATE_MNEMONIC,
      },
      chainId: chainIds.hardhat,
    },    
    ropsten: createConfig('ropsten'),
    rinkeby: createConfig('rinkeby'),
    kovan: createConfig('kovan'),
    mainnet: createConfig('mainnet'),
  },
  solidity: {
    compilers: [
      {
        version: '0.7.0',
        settings: {
          metadata: {
            // Not including the metadata hash
            // https://github.com/paulrberg/solidity-template/issues/31
            bytecodeHash: "none",
          },
          // You should disable the optimizer when debugging
          // https://hardhat.org/hardhat-network/#solidity-optimizer-support
          optimizer: {
            enabled: true,
            runs: 800,
          },
        },
      }    
    ],
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },    
  paths: {
    sources: "./contracts",
    artifacts: "./artifacts",
    cache: "./cache",
    tests: "./test",
  }  
};

export default config;
