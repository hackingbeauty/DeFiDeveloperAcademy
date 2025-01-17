const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers, network } = require("hardhat");

describe("Router contract", ()=> {
    
    describe("Deposit liquidity", () => {
        async function deployRouterFixture() {
            
        }
        describe("should only allow a deposit of two ERC20 tokens of equal value", () => {
            
            it("should deposit amountADesired and amountBDesired for a new liquidity pool", async() => {});

            it("should deposit the optimal ratio of tokens for an existing pool", async() => {});

        });
        describe("should mint the correct number of Liquidity Tokens", () => {

            it("for a new liquidity pool", async() => {});

            it("for an existing liquidity pool", async() => {});

        });
        
    });
    
});