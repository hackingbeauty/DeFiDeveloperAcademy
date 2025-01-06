const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers, network } = require("hardhat");

describe("TradingPairExchange contract", ()=> {
    async function deployTradingPairExchangeFixture() {
        await network.provider.send("hardhat_reset");

        /* AAVE/DAI, 1 AAVE = $56 USD, 1 DAI = $1 USD */
        const amountADesired = ethers.utils.parseUnits('1', 18); //AAVE
        const amountBDesired = ethers.utils.parseUnits('56', 18); //DAI

        const [deployer, liquidityProvider, exchangeDev] = await ethers.getSigners();

        const FactoryContract = await ethers.getContractFactory("Factory");
        const factory = await FactoryContract.deploy(deployer.address);
        await factory.deployed();

        const AaveTokenContract = await ethers.getContractFactory("ERC20Basic");
        const aaveToken = await AaveTokenContract.deploy(
            "Aave Stablecoin",
            "AAVE",
            18,
            deployer.address
        );
        await aaveToken.deployed();

        const DaiTokenContract = await ethers.getContractFactory("ERC20Basic");
        const daiToken = await DaiTokenContract.deploy(
            "Dai Stablecoin",
            "DAI",
            18,
            deployer.address
        );
        await daiToken.deployed();

        /* Mint tokens for Liquidity Provider's account */
        await aaveToken.mint(
            liquidityProvider.address,
            ethers.utils.parseUnits('130', 18)
        );

        await daiToken.mint(
            liquidityProvider.address,
            ethers.utils.parseUnits('130', 18)
        );

        /* Liquidity Provider approves Router to transfer tokens */
        await aaveToken.connect(liquidityProvider).approve(
            deployer.address,
            ethers.utils.parseUnits('130', 18)
        );

        await daiToken.connect(liquidityProvider).approve(
            deployer.address,
            ethers.utils.parseUnits('130', 18)
        );

        const tradingPairExchangeContract = await factory.createTradingPair(
            aaveToken.address,
            daiToken.address
        );
        const receipt = await tradingPairExchangeContract.wait();
        const tradingPairExchangeAddress = receipt.events[0].args[2];

        const tradingPairExchange = await ethers.getContractAt(
            "TradingPairExchange",
            tradingPairExchangeAddress,
            deployer
        );

        return {
            aaveToken,
            daiToken,
            amountADesired,
            amountBDesired,
            liquidityProvider,
            factory,
            exchangeDev,
            tradingPairExchange
        }
    }

    describe("Exchanging Assets", () => {

        it("should prevent against reentrancy", async() => {

        });

        it("should allow a flash swap/loan", async() => {

        });
        

    });

});