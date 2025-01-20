const { ethers } = require("hardhat");

async function deployERC20Contracts(config) {
    const {
        tokenContracts,
        deployer,
        liquidityProvider,
        router,
        trader
    } = config;
    const baseContract = await ethers.getContractFactory("ERC20Basic");

    const deployedERC20Contracts = tokenContracts.map(async(contract, index) => {
        const tokenContract = await baseContract.deploy(
            contract.name,
            contract.symbol,
            18,
            deployer.address
        );
        await tokenContract.deployed();
    
        /* Mint tokens for Liquidity Provider's account */
        const tx1 = await tokenContract.mint(
            liquidityProvider.address,
            ethers.utils.parseUnits('7000000000000', 18)
        );
        await tx1.wait();
        
        /* Mint tokens for Trader's account */
        const tx2 = await tokenContract.mint(
            trader.address,
            ethers.utils.parseUnits('7000000000000', 18)
        );
        await tx2.wait();
    
        /* Liquidity Provider approves Router to transfer tokens */
        const tx3 = await tokenContract.connect(liquidityProvider).approve(
            router.address,
            ethers.utils.parseUnits('7000000000000', 18)
        );
        await tx3.wait();

        /* Trader approves Router to transfer tokens */
        const tx4 = await tokenContract.connect(trader).approve(
            router.address,
            ethers.utils.parseUnits('7000000000000', 18)
        );
        await tx4.wait();

        return {
            "name": contract.name,
            "symbol": contract.symbol,
            "address": tokenContract.address,
            "contract": tokenContract
        }   
    });

    return sortTokenContracts(await Promise.all(deployedERC20Contracts));
}

async function deployExchanges(config) {
    const { 
        factory,
        deployedContracts,
        depositAmounts,
        router,
        liquidityProvider,
        deadline
    } = config;

    const deployedExchanges = deployedContracts.map(async (contract, index) => {
        const tokenA = deployedContracts[index].address;
        const tokenASymbol = deployedContracts[index].symbol;   
        let tokenB, tokenBSymbol, tradingPair;

        if(index < deployedContracts.length-1) {
            tokenB = deployedContracts[index+1].address;
            tokenBSymbol = deployedContracts[index+1].symbol;
            tradingPair = `${tokenASymbol}:${tokenBSymbol}`;

            return deployExchange({
                tokenA,
                tokenB,
                tradingPair,
                depositAmounts,
                factory,
                router,
                liquidityProvider,
                deadline
            });
        }
    });
    
    return await Promise.all(deployedExchanges);
}

async function deployExchange(config) {
    const { 
        tokenA,
        tokenB,
        tradingPair,
        depositAmounts,
        factory,
        router,
        liquidityProvider,
        deadline
    } = config;

    const address = await factory.callStatic.createTradingPair(tokenA, tokenB); 

    const depositAmount = depositAmounts.find((pair) => { 
        return pair.tradingPair === tradingPair; 
    });

    const {
        amountADesired,
        amountBDesired,
        amountAMin,
        amountBMin
    } = depositAmount;

    const tx = await router.depositLiquidity(
        tokenA,
        tokenB,
        ethers.utils.parseUnits(`${amountADesired}`, 18),
        ethers.utils.parseUnits(`${amountBDesired}`, 18),
        ethers.utils.parseUnits(`${amountAMin}`,     18),
        ethers.utils.parseUnits(`${amountBMin}`,     18),
        liquidityProvider.address,
        deadline    
    );
    await tx.wait();

    return {
        address,
        tradingPair,
        tokenA,
        tokenB,
        amountADesired,
        amountBDesired,
        amountAMin,
        amountBMin
    }
}

function getPath(deployedContracts) {
    return deployedContracts.map((contract) => {
        return contract.address;
    });
}

function sortTokenContracts(contracts) {
    const sortedContracts = contracts.sort((a, b) => {
        return a.address - b.address;
    })
    return sortedContracts;
}

module.exports = { 
    deployERC20Contracts,
    deployExchanges,
    deployExchange,
    getPath
}