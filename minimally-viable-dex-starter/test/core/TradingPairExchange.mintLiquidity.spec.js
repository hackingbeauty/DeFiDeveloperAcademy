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
    
    describe("Minting Liquidity Tokens", () =>{
        it("should remit payment of the protocol fee to the exchange developer account", async() =>{
            const { 
                aaveToken,
                daiToken,
                amountADesired,
                amountBDesired,
                liquidityProvider,
                exchangeDev,
                factory,
                tradingPairExchange
            } = await loadFixture(deployTradingPairExchangeFixture);

            await factory.setFeeTo(exchangeDev.address);

            await aaveToken.transferFrom(
                liquidityProvider.address,
                tradingPairExchange.address,
                amountADesired
            );
            await daiToken.transferFrom(
                liquidityProvider.address,
                tradingPairExchange.address,
                amountBDesired
            );
            await tradingPairExchange.mint(liquidityProvider.address);

            await aaveToken.transferFrom(
                liquidityProvider.address,
                tradingPairExchange.address,
                ethers.utils.parseUnits('.25', 18)
            );
            await daiToken.transferFrom(
                liquidityProvider.address,
                tradingPairExchange.address,
                ethers.utils.parseUnits('14', 18)
            );
            await tradingPairExchange.mint(liquidityProvider.address);

            await aaveToken.transferFrom(
                liquidityProvider.address,
                tradingPairExchange.address,
                ethers.utils.parseUnits('.25', 18)
            );
            await daiToken.transferFrom(
                liquidityProvider.address,
                tradingPairExchange.address,
                ethers.utils.parseUnits('14', 18)
            );
            await tradingPairExchange.mint(liquidityProvider.address);

            const exchangeDevAccountBalance = await tradingPairExchange.balanceOf(exchangeDev.address);
            const formattedExchangeDevAccountBalance = ethers.utils.formatUnits(exchangeDevAccountBalance);
            expect(formattedExchangeDevAccountBalance).to.equal("0.322556671273615636");
        });

        it("should update a Liquidity Provider's account after a deposit into a new pool", async() =>{
            const { 
                aaveToken,
                daiToken,
                amountADesired,
                amountBDesired,
                liquidityProvider,
                tradingPairExchange
            } = await loadFixture(deployTradingPairExchangeFixture);

            await aaveToken.transferFrom(
                liquidityProvider.address,
                tradingPairExchange.address,
                amountADesired
            );
            await daiToken.transferFrom(
                liquidityProvider.address,
                tradingPairExchange.address,
                amountBDesired
            );
            await tradingPairExchange.mint(liquidityProvider.address);

            const liquidityProviderAccountBalance = await tradingPairExchange.balanceOf(liquidityProvider.address);
            const formattedLiquidityProviderAccountBalance = ethers.utils.formatUnits(liquidityProviderAccountBalance);
            expect(formattedLiquidityProviderAccountBalance).to.equal("7.483314773547881771");
        });

        it("should update a Liquidity Provider's account after a deposit into an existing pool", async() =>{
            const { 
                aaveToken,
                daiToken,
                amountADesired,
                amountBDesired,
                liquidityProvider,
                tradingPairExchange
            } = await loadFixture(deployTradingPairExchangeFixture);

            await aaveToken.transferFrom(
                liquidityProvider.address,
                tradingPairExchange.address,
                amountADesired
            );
            await daiToken.transferFrom(
                liquidityProvider.address,
                tradingPairExchange.address,
                amountBDesired
            );
            await tradingPairExchange.mint(liquidityProvider.address);

            /* Transfer tokens from Liquidity Provider account to AAVE/DAI pool */
            await aaveToken.transferFrom(
                liquidityProvider.address,
                tradingPairExchange.address,
                ethers.utils.parseUnits('.25', 18)
            );
            await daiToken.transferFrom(
                liquidityProvider.address,
                tradingPairExchange.address,
                ethers.utils.parseUnits('14', 18)
            );

            /* Mint Liquidity Tokens for the Liquidity Provider */
            await tradingPairExchange.mint(liquidityProvider.address);

            const liquidityProviderAccountBalance = await tradingPairExchange.balanceOf(liquidityProvider.address);
            const formattedLiquidityProviderAccountBalance = ethers.utils.formatUnits(liquidityProviderAccountBalance);
            expect(formattedLiquidityProviderAccountBalance).to.equal("9.354143466934852463");
        });
        
    });
    
});