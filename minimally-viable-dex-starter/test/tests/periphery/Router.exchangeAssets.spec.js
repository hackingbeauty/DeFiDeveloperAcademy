const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers, network } = require("hardhat");
const { 
    deployERC20Contracts,
    deployExchanges,
    deployExchange,
    getPath
} = require("../helpers/deployment-helpers.js");
const { tokenContracts, depositAmounts } = require("../configs/test-data.js");

describe("Router contract", ()=> {    
    describe("Exchange assets", () => {  
        async function deployRouterFixture() {
            await network.provider.send("hardhat_reset");

            const [deployer, liquidityProvider, trader] = await ethers.getSigners();
            
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

            /* Step 1 - Deploy ERC20 token contracts */
            const deployedContracts = await deployERC20Contracts({
                tokenContracts,
                deployer,
                liquidityProvider,
                router,
                trader
            });

            /* Step 2 - Calculate transaction deadline of 20 minutes */
            const currentTime = Math.floor(Date.now() / 1000); //divide by 1000 to get seconds
            const deadline = currentTime + (20 * 60); //deadline is current time + 20 minutes
            
            /* Step 3a - Deploy Trading Pair Exchanges */
            await deployExchanges({
                factory,
                deployedContracts,
                depositAmounts,
                router,
                liquidityProvider,
                deadline
            });

            /* Step 3 - Get array of token contracts to pass into Router */
            const path = getPath(deployedContracts); 
            const pathWithWETHFirst = [wethContract.address].concat(path); //path array with WETH as input
            const pathWithWETHLast = path.concat(wethContract.address); //path array with WETH as input

            // const pathWithWETHLast = path.push(wethContract.address); //path array with WETH as input

            const balToken = deployedContracts[0].contract;
            const aaveToken = deployedContracts[1].contract;
            const daiToken = deployedContracts[2].contract;
            const wethTokenAddress = wethContract.address;
            const balTokenAddress = balToken.address;
            const daiTokenAddress = daiToken.address;
            const wethBalTradingPair = "WETH:BAL";
            const daiWethTradingPair = "DAI:WETH";


            /* Mint tokens for Liquidity Provider's account */
            const tx1 = await wethContract.mint(
                liquidityProvider.address,
                ethers.utils.parseUnits('7000000000000', 18)
            );
            await tx1.wait();
            
            /* Mint tokens for Trader's account */
            const tx2 = await wethContract.mint(
                trader.address,
                ethers.utils.parseUnits('7000000000000', 18)
            );
            await tx2.wait();
        
            /* Liquidity Provider approves Router to transfer tokens */
            const tx3 = await wethContract.connect(liquidityProvider).approve(
                router.address,
                ethers.utils.parseUnits('7000000000000', 18)
            );
            await tx3.wait();

            /* Trader approves Router to transfer tokens */
            const tx4 = await wethContract.connect(trader).approve(
                router.address,
                ethers.utils.parseUnits('7000000000000', 18)
            );
            await tx4.wait();


            /* Step 3b - Deploy WETH:BAL Exchange */
            await deployExchange({
                tokenA: wethTokenAddress,
                tokenB: balTokenAddress,
                tradingPair: wethBalTradingPair,
                depositAmounts,
                factory,
                router,
                liquidityProvider,
                deadline
            });

            /* Step 3b - Deploy DAI:WETH Exchange */
            await deployExchange({
                tokenA: daiTokenAddress,
                tokenB: wethTokenAddress,
                tradingPair: daiWethTradingPair,
                depositAmounts,
                factory,
                router,
                liquidityProvider,
                deadline
            });

            return {
                path,
                pathWithWETHFirst,
                pathWithWETHLast,
                balToken,
                aaveToken,
                daiToken,
                liquidityProvider,
                trader,
                router,
                deadline,
                wethContract,
                deployer
            }
        }

        it("should swap an exact amount of input tokens in exchange for a minimum amount of output tokens", async() => {
            // Arrange
            const { 
                path,
                daiToken,
                trader,
                router,
                deadline
            } = await loadFixture(deployRouterFixture);

            const amountInBal = ethers.utils.parseUnits('145', 18);
            const amountOutMinDai = ethers.utils.parseUnits('1', 18);

            // Act - Trader is exchanging AAVE tokens for BAL tokens
            const swapTx = await router.swapExactTokensForTokens(
                amountInBal, // amountIn - BAL token $145 - exact amount of tokens a trader wants to trade
                amountOutMinDai,   // amountOutMin - DAO token $2 - the minimum amount of the output token they're willing to receive
                path,
                trader.address,
                deadline
            );
            await swapTx.wait();


            // Assert 
            const daiTokenBalanceAfterTrade = ethers.utils.formatUnits(await daiToken.balanceOf(trader.address));
            expect(daiTokenBalanceAfterTrade).to.equal("7000000000020.187179575038471804"); // Trader receives 1.006685768646612797 BAL tokens after exchange
        });

        it("should swap a maximum number of input tokens in exchange for an exact amount of output tokens", async() => {
            // Arrange
            const { 
                path,
                daiToken,
                trader,
                router,
                deadline
            } = await loadFixture(deployRouterFixture);

            const amountInMaxBal = ethers.utils.parseUnits('145', 18); // maximum amount of BAL tokens trader is willing to trade
            const amountOutDai = ethers.utils.parseUnits('2', 18); // exact amount of DAI tokens trader wants to receive

            // Act
            const swapTx = await router.swapTokensForExactTokens(
                amountOutDai,
                amountInMaxBal,
                path,
                trader.address,
                deadline
            );
            await swapTx.wait();

            // Assert 
            const daiTokenBalanceAfterTrade = ethers.utils.formatUnits(await daiToken.balanceOf(trader.address));
            expect(daiTokenBalanceAfterTrade).to.equal("7000000000002.0");
        });

        // it("should swap an exact amount of ETH in exchange for a minimum amount of a non-ETH output token", async() => {
        //     // swapExactETHForTokens
            
        //     // Arrange
        //     const { 
        //         pathWithWETHFirst,
        //         balToken,
        //         trader,
        //         router,
        //         deadline,
        //         deployer,
        //         wethContract
        //     } = await loadFixture(deployRouterFixture);

        //     /* WETH Contract has to have a deposit of ETH made first */
        //     const wethDepositTransaction = await deployer.sendTransaction({
        //         to: wethContract.address,
        //         value: ethers.utils.parseEther('2', 'ether')
        //     });
        //     await wethDepositTransaction.wait();

        //     const exactAmountOfETH = ethers.utils.parseEther("20.62");
        //     const amountOutMin= ethers.utils.parseUnits('1.96', 18);

        //     // Act
        //     const swapTx = await router.swapExactETHForTokens(
        //         amountOutMin, 
        //         pathWithWETHFirst,
        //         trader.address,
        //         deadline,
        //         { value: exactAmountOfETH } // Put 1.1 ETH in transaction's msg.value and pass to contract
        //     );
        //     await swapTx.wait();

        //     // Assert 
        //     const balTokenBalanceAfterTrade = ethers.utils.formatUnits(await balToken.balanceOf(trader.address));
        //     expect(balTokenBalanceAfterTrade).to.equal("888888888.999999999999");
        // });

        it("should swap a maximum amount of some non-ETH token in exchange for an exact amount of ETH", async() => {
            // swapTokensForExactETH
            // Arrange
            const { 
                pathWithWETHLast,
                trader,
                router,
                deadline,
                deployer,
                wethContract
            } = await loadFixture(deployRouterFixture);

            const ethBalanceBeforeTrade = await ethers.provider.getBalance(trader.address);
            const formattedEthBalanceBeforeTrade = ethers.utils.formatEther(ethBalanceBeforeTrade);

            /* WETH Contract has to have a deposit of ETH made first */
            const wethDepositTransaction = await deployer.sendTransaction({
                to: wethContract.address,
                value: ethers.utils.parseEther('2', 'ether')
            });
            await wethDepositTransaction.wait();

            const amountOfExactEth = ethers.utils.parseUnits('1', 18);
            const amountInMax= ethers.utils.parseUnits('145', 18);

            // Act
            const swapTx = await router.swapTokensForExactETH(
                amountOfExactEth, 
                amountInMax, 
                pathWithWETHLast,
                trader.address, 
                deadline
            );
            await swapTx.wait();

            // Assert
            const ethBalanceAfterTrade = await ethers.provider.getBalance(trader.address);
            const formattedEthBalanceAfterTrade = ethers.utils.formatEther(ethBalanceAfterTrade);
            const difference = formattedEthBalanceAfterTrade - formattedEthBalanceBeforeTrade;
            
            expect(formattedEthBalanceBeforeTrade).to.equal("9999.999793700682944172");
            expect(formattedEthBalanceAfterTrade).to.equal("10000.999793700682944172");
            expect(difference).to.equal(1);
        });
    });
});