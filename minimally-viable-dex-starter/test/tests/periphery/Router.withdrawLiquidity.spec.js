const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers, network } = require("hardhat");
const { bigNumberSqrt } = require("../helpers/math-helpers.js");
const BigNumber = require('bignumber.js');
describe("Router contract", ()=> {
    describe("Withdraw liquidity", () => {  
        async function deployRouterFixture() {
            await network.provider.send("hardhat_reset");
    
            /* AAVE/DAI, 1 AAVE = $56 USD, 1 DAI = $1 USD */
            const amountADesired = ethers.utils.parseUnits('1', 18); //AAVE
            const amountBDesired = ethers.utils.parseUnits('56', 18); //DAI
            const amountAMin = ethers.utils.parseUnits('.99', 18); //AAVE
            const amountBMin = ethers.utils.parseUnits('55.44', 18); //DAI
    
            const [deployer, liquidityProvider] = await ethers.getSigners();
    
            const FactoryContract = await ethers.getContractFactory("Factory");
            const factory = await FactoryContract.deploy(deployer.address);
            await factory.deployed();

            const WrappedETHContract = await ethers.getContractFactory("WETH");
            const wethContract = await WrappedETHContract.deploy(deployer.address);
            await wethContract.deployed();

            const RouterContract = await ethers.getContractFactory("Router");
            const deployedRouter = await RouterContract.deploy(factory.address, wethContract.address);
            await deployedRouter.deployed();
    
            /* Connect router to signer */
            const router = await deployedRouter.connect(liquidityProvider);
    
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
                router.address,
                ethers.utils.parseUnits('130', 18)
            );
    
            await daiToken.connect(liquidityProvider).approve(
                router.address,
                ethers.utils.parseUnits('130', 18)
            );

             /* Pre-deploy an AAVE/DAI TradingPairExchange Contract */
             const tradingPairExchangeContract = await factory.createTradingPair(
                aaveToken.address,
                daiToken.address
            );
            const receipt = await tradingPairExchangeContract.wait();

            /* Get a handle on an instance of TradingPairExchange contract */
            const tradingPairExchangeAddr = receipt.events[0].args[2];
            const tradingPairExchange = await ethers.getContractAt(
                "TradingPairExchange",
                tradingPairExchangeAddr,
                deployer
            );

            /* Liquidity Provider approve Router to transfer Liquidity Tokens */
            await tradingPairExchange.connect(liquidityProvider).approve(
                router.address,
                ethers.utils.parseUnits('5', 18)
            );

            /* Transaction deadline of 20 minutes */
            const currentTime = Math.floor(Date.now() / 1000); //divide by 1000 to get seconds
            const deadline = currentTime + (20 * 60); //deadline is current time + 20 minutes
            
            /* Initialize a new liquidity pool */
            const depositTx = await router.depositLiquidity(
                aaveToken.address,
                daiToken.address,
                amountADesired,
                amountBDesired,
                amountAMin,
                amountBMin,
                liquidityProvider.address,
                deadline
            );
            await depositTx.wait();
                
            return {
                aaveToken,
                daiToken,
                amountADesired,
                amountBDesired,
                amountAMin,
                amountBMin,
                router,
                liquidityProvider,
                deadline,
                factory,
                deployer,
                tradingPairExchange
            }
        }

        it("should withdraw the correct number of ERC20 tokens", async() => {
            const { 
                router,
                aaveToken,
                daiToken,
                liquidityProvider,
                deadline,
                tradingPairExchange
            } = await loadFixture(deployRouterFixture);

            const liquidityTokensToBurn = ethers.utils.parseUnits('4', 18);
            const minAmountAToReturn = ethers.utils.parseUnits('0.5', 18);
            const minAmountBToReturn = ethers.utils.parseUnits('29', 18);

            /* Withdraw Liquidity Tokens */
            const { amountA, amountB } = await router.callStatic.withdrawLiquidity(
                aaveToken.address,
                daiToken.address,
                liquidityTokensToBurn,
                minAmountAToReturn,
                minAmountBToReturn,
                liquidityProvider.address,
                deadline
            );

            /* Format ERC20 Token balances */
            const formattedAaveTokensCredited = ethers.utils.formatUnits(amountA);
            const formattedDaiTokensCredited = ethers.utils.formatUnits(amountB);

            /* expect Liquidity Provider to now have additional AAVE and DAI tokens in their accounts */
            expect(formattedAaveTokensCredited).to.equal("0.534522483824848769");
            expect(formattedDaiTokensCredited).to.equal("29.933259094191531085");
        });

        it("should debit correct number of Liquidity Tokens from Liquidity Provider's account", async() => {
            const { 
                router,
                aaveToken,
                daiToken,
                liquidityProvider,
                deadline,
                tradingPairExchange
            } = await loadFixture(deployRouterFixture);

            const liquidityTokensToBurn = ethers.utils.parseUnits('4', 18);
            const minAmountAToReturn = ethers.utils.parseUnits('0.5', 18);
            const minAmountBToReturn = ethers.utils.parseUnits('29', 18);

            /* Withdraw Liquidity Tokens */
            const tx = await router.withdrawLiquidity(
                aaveToken.address,
                daiToken.address,
                liquidityTokensToBurn,
                minAmountAToReturn,
                minAmountBToReturn,
                liquidityProvider.address,
                deadline
            );
            await tx.wait();
            
            /* Get updated Liquidity Provider balance after withdrawal, and format */
            const updatedLiquidityBalance = await tradingPairExchange.balanceOf(liquidityProvider.address)
            const formattedUpdatedLiquidityBalance = ethers.utils.formatUnits(updatedLiquidityBalance);
            expect(formattedUpdatedLiquidityBalance).to.equal("3.483314773547881771");
        });

    }); 

});