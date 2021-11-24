/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import hre from "hardhat";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

const VERBOSE = false;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const keys = async (obj: any) => {
    Object.keys(obj).toString().split(`,`).forEach(p => { process.stdout.write(`${p}` + `\n`); })
};

export const printPartyTxReceipt = async (receipt: any) => {
    process.stdout.write(
        `${receipt.from} => ${receipt.to} (gasUsed:${receipt.gasUsed})(${receipt.status})` + `\n` +
        `\ttx:${receipt.transactionHash} (block.no:${receipt.blockNumber})` + `\n`
    );
};

export const getRandomInt = (max: number): number => {
    return Math.floor(Math.random() * max);
};

const advanceTimeAndBlock = async function (time: number) {
    process.stdout.write(`advancing:`);
    const currentBlockNum = await hre.ethers.provider.getBlockNumber();
    const currentBlock = await hre.ethers.provider.getBlock(currentBlockNum);
    const { hash, parentHash, number, timestamp, nonce, difficulty, gasLimit, gasUsed, miner, extraData, transactions } = currentBlock;
    const currentBlockTime = currentBlock.timestamp;
    const newBlockTime = currentBlockTime + time;
    await hre.ethers.provider.send('evm_mine', [newBlockTime]);
    process.stdout.write(`(${currentBlockNum}):` + `\n` +
        `\t` + `${parentHash}` + `\t` + `\n` +
        `\t` + `${hash}` + `\t` + `\n` +
        `\t` + `${timestamp}:${number}, ${nonce}, ${difficulty}` + `\t` + `\n` +
        `\t` + `${gasLimit}, ${gasUsed}` + `\t` + `\n` +
        `\t` + `tx:${transactions}` + `\t` + `\n` +
        `\t` + `current block time:${currentBlockTime} => adv block time:${newBlockTime}` + `\n`);
};

export function shouldBehaveLikeMeowsDAO(): void {
    it("should return MeowsDAO contract constructor initial state", async function () {
        const MeowsDAOAddress = await this.MeowsDAO.address;
        const MeowsDAOBalance: BigNumber = await hre.ethers.provider.getBalance(MeowsDAOAddress);

        /*

        1. set base URI, QmUzavXLiBywmL3SPApJqHYM3vCA1bJbo2iaigwLwsAgPr
        2. set contract URI, https://bafkreihmymbhqpfrxdckrx475ndwcz3ssudrovdo6otckmiolee2jlb35y.ipfs.dweb.link/
        3. set sale active
        4. 
        */

        process.stdout.write(`deployed contract to => ` +
            `${await this.MeowsDAO.address}:${MeowsDAOBalance} (wei)` + `\n`);        
        expect(await this.MeowsDAO.address);
        expect(MeowsDAOBalance).to.equal(0);       
    });

    it("should display other unnamed addresses and balances", async function () {        
        const ad: SignerWithAddress = this.signers.admin;
        process.stdout.write(`(+)` + `\t` + `${await ad.address}:${await ad.getBalance()}` + `\n`);
        for (let i = 0; i < this.unnamedAccounts.length; i++) {
            const a: SignerWithAddress = this.unnamedAccounts[i];
            process.stdout.write(`(${i})` + `\t` + `${await a.address}:${await a.getBalance()}` + `\n`);
        }
        process.stdout.write(`🎉🎉🎉 Let's start minting` + `\n`);
    });

    it("should display contract keys", async function () {        
        expect(await keys(this.MeowsDAO));
    });

    it("should display contract properties", async function () {
        const name: string = await this.MeowsDAO.name();        
        const symbol: string = await this.MeowsDAO.symbol();
        const max_supply = await this.MeowsDAO.MAX_KITTENS();
        const sales_start = await this.MeowsDAO.REVEAL_TIMESTAMP();
        process.stdout.write(`token name:${name}, token symbol:${symbol}, max supply:${max_supply}` + `\n`);
        expect(1).to.not.equal(0);
    });

    it("should demonstrate ...", async function () { });

    it("should display unnamed addresses and balances again", async function () {
        const ad: SignerWithAddress = this.signers.admin;
        process.stdout.write(`\n` + `(+)` + `\t` + `${await ad.address}:${await ad.getBalance()}` + `\n`);
        for (let i = 0; i < this.unnamedAccounts.length; i++) {
            const a: SignerWithAddress = this.unnamedAccounts[i];
            if (i == 2) {
                process.stdout.write(`(${i})` + `\t` + `${await a.address}:${await a.getBalance()}` + `\n`);
            } else {
                process.stdout.write(`(${i})` + `\t` + `${await a.address}:${await a.getBalance()}` + `\n`);
            }
        }        
    });
};