import hre from "hardhat";
import { Artifact } from "hardhat/types";
import { Signers } from "../../types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { tokenName, tokenSymbol, maxKittens, startSale } from '../../config';
import { MeowsDAO } from "../../typechain/MeowsDAO"
import { shouldBehaveLikeMeowsDAO } from "./MeowsDAO.behavior";

const { deployContract } = hre.waffle;

describe("Setup Admin and Unnamed Accounts", function () {
    before(async function () {
        this.signers = {} as Signers;
        const signers: SignerWithAddress[] = await hre.ethers.getSigners();
        this.signers.admin = signers[0];
        this.unnamedAccounts = [] as Signers[];
        for (let i = 1; i <= (signers.length - 1); i++) {
            const unnamedAccount: SignerWithAddress = signers[i];
            this.unnamedAccounts.push(unnamedAccount);
        }
    });

    describe("Creating Contract", function () {
        before(async function () {                                    
            const MeowsDAOArtifact: Artifact = await hre.artifacts.readArtifact("MeowsDAO");
            this.MeowsDAO = <MeowsDAOArtifact>await deployContract(
                this.signers.admin, 
                MeowsDAOArtifact, 
                [tokenName, tokenSymbol, maxKittens, startSale]
                ); 
            console.log(`Deployed Tokens to the following address => ${this.MeowsDAO.address}`);
            console.log(`token name:${tokenName} (${tokenSymbol})`);
            console.log(`maxKittens:${maxKittens}, startSale:${startSale}`);
        });
        shouldBehaveLikeMeowsDAO();
    });
});
