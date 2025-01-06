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

    describe("Burning Liquidity Tokens", () => {
        async function deploySecondaryTradingPairExchangeFixture() {
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

            /* First depositing of liquidity */
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
    
            return {
                aaveToken,
                daiToken,
                amountADesired,
                amountBDesired,
                deployer,
                liquidityProvider,
                factory,
                exchangeDev,
                tradingPairExchange
            }
        }

        it("should debit a Liquidity Provider's account", async() => {
            const {
                deployer,
                tradingPairExchange,
                liquidityProvider
            } = await loadFixture(deploySecondaryTradingPairExchangeFixture);

            /* Liquidity Provider approve Deployer to transfer Liquidity Tokens */
            await tradingPairExchange.connect(liquidityProvider).approve(
                deployer.address,
                ethers.utils.parseUnits('5', 18)
            );

            /* Transfer Liquidity Tokens to TradingPairExchange */
            await tradingPairExchange.transferFrom(
                liquidityProvider.address,
                tradingPairExchange.address,
                ethers.utils.parseUnits('4', 18)
            );

            /* Burn Liquidity Tokens */
            await tradingPairExchange.burn(liquidityProvider.address);

            /* Format Liquidity token balances */
            const liquidityProviderBalance = await tradingPairExchange.balanceOf(liquidityProvider.address);
            const formattedLiquidityProviderBalance = ethers.utils.formatUnits(liquidityProviderBalance);
            const liquidityTokenTotalSupply = await tradingPairExchange.totalSupply();
            const formattedLiquidityTokenTotalSupply = ethers.utils.formatUnits(liquidityTokenTotalSupply);

            /* Expect correct debitted amount of Liquidity Tokens */
            expect(formattedLiquidityProviderBalance).to.equal("3.483314773547881771");
            expect(formattedLiquidityTokenTotalSupply).to.equal("3.483314773547882771");
        });

        it("should send to Liquidity Provider ERC20 tokens proportional to amount of Liquidity Tokens burned", async() => {
            const {
                aaveToken,
                daiToken,
                deployer,
                tradingPairExchange,
                liquidityProvider
            } = await loadFixture(deploySecondaryTradingPairExchangeFixture);

            /* Liquidity Provider approve Deployer to transfer Liquidity Tokens */
            await tradingPairExchange.connect(liquidityProvider).approve(
                deployer.address,
                ethers.utils.parseUnits('7.483314773547881771', 18)
            );

            /* Transfer Liquidity Tokens to TradingPairExchange */
            await tradingPairExchange.transferFrom(
                liquidityProvider.address,
                tradingPairExchange.address,
                ethers.utils.parseUnits('7.483314773547881771', 18)
            );

            /* Burn Liquidity Tokens */
            await tradingPairExchange.burn(liquidityProvider.address);

            /* Formatted ERC20 Token balance */
            const amountAReturned = await aaveToken.balanceOf(liquidityProvider.address);
            const amountBReturned = await daiToken.balanceOf(liquidityProvider.address);
            const formattedAaveTokensCredited = ethers.utils.formatUnits(amountAReturned);
            const formattedDaiTokensCredited = ethers.utils.formatUnits(amountBReturned);

            /* Expect Liquidity Provider to now have additional AAVE and DAI tokens in their accounts */
            expect(formattedAaveTokensCredited).to.equal("129.999999999999999866");
            expect(formattedDaiTokensCredited).to.equal("129.999999999999992516");
        });

        it("should remit payment of the Protocol Fee to the Exchange Developer account", async() => {
            const {
                aaveToken,
                daiToken,
                deployer,
                exchangeDev,
                factory,
                tradingPairExchange,
                liquidityProvider
            } = await loadFixture(deploySecondaryTradingPairExchangeFixture);

            /* Set Protocol Fee recipient to DEX Developer account */
            await factory.setFeeTo(exchangeDev.address);

            /* Second deposit of liquidity into AAVE/DAI pool */
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

            /* Mint relevant amount of Liquidity Tokens */
            await tradingPairExchange.mint(liquidityProvider.address);

            /* Liquidity Provider approve Deployer to transfer Liquidity Tokens */
            await tradingPairExchange.connect(liquidityProvider).approve(
                deployer.address,
                ethers.utils.parseUnits('5', 18)
            );

            /* Transfer Liquidity Tokens to TradingPairExchange */
            await tradingPairExchange.transferFrom(
                liquidityProvider.address,
                tradingPairExchange.address,
                ethers.utils.parseUnits('4', 18)
            );

            /* Burn Liquidity Tokens */
            await tradingPairExchange.burn(liquidityProvider.address); 
            
            /* Expectation */
            const dexDeveloperAccountBalance = await tradingPairExchange.balanceOf(exchangeDev.address);
            const formattedDexDeveloperAccountBalance = ethers.utils.formatUnits(dexDeveloperAccountBalance);
            expect(formattedDexDeveloperAccountBalance).to.equal("0.322556671273615636");
        });

    });

});