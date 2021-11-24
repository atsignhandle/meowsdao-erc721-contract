/* We require the Hardhat Runtime Environment explicitly here. This is optional
but useful for running the script in a standalone fashion through `node <script>`.
When running the script with `hardhat run <script>` you'll find the Hardhat
Runtime Environment's members available in the global scope. */

import { ethers } from 'hardhat';
import { Contract, ContractFactory } from 'ethers';
import { config as dotenvConfig } from 'dotenv';
import { resolve } from 'path';
import { tokenName, tokenSymbol, maxKittens, startSale } from '../config';
import { chainIds } from '../utils/chainId';

dotenvConfig({ path: resolve(__dirname, '../.env') });

async function main(): Promise<void> {
    /* Hardhat always runs the compile task when running scripts through it.
    If this runs in a standalone fashion you may want to call compile manually
    to make sure everything is compiled
    await run("compile"); We get the contract to deploy */
    const Factory: ContractFactory = await ethers.getContractFactory('MeowsDAO');        

    console.log(`token name:${tokenName}`);
    console.log(`token symbol:${tokenSymbol}`);
    console.log(`maxKittens:${maxKittens}`);
    console.log(`startSale:${startSale}`);    
    
    const MeowsDAO: Contract = await Factory.deploy(
        tokenName,
        tokenSymbol,
        maxKittens,
        startSale,
    );

    const deployed = await MeowsDAO.deployed();
    console.log(`Contract deployed to:`, MeowsDAO.address); 
    console.log(deployed);        
    console.log(`Verify using:` + `\n` + 
        `npx hardhat verify --network rinkeby ` + `${MeowsDAO.address} ` + 
        `"${tokenName}" "${tokenSymbol}" "${maxKittens}" "${startSale}"`        
        );    

    const { deployTransaction } = deployed;
    const { hash, from, to, gasPrice, gasLimit, data, chainId, confirmations } = deployTransaction;
    console.log(`transaction id:${hash} on chain ${chainId}`);
    console.log(`from:${from}, to:${to} - (${confirmations} confirmations)`);
    console.log(gasPrice, gasLimit);        
};


/* We recommend this pattern to be able to use async/await everywhere
  and properly handle errors. */
main()
    .then(() => process.exit(0))
    .catch((error: Error) => {
        console.error(error);
        process.exit(1);
    });
