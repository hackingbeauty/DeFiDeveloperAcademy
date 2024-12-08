const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NonStandardERC20Token.sol", () => {
    let contractFactory;
    let contract;
    let owner;
    let alice;
    let bob;
    let initialSupply;
    let ownerAddress;
    let aliceAddress;
    let bobAddress;

    beforeEach(async () => {
        [owner, alice, bob] = await ethers.getSigners();
        initialSupply = ethers.parseEther("100000");
        contractFactory = await ethers.getContractFactory("NonStandardERC20Token");
        contract = await contractFactory.deploy(initialSupply);
        ownerAddress = await owner.getAddress();
        aliceAddress = await alice.getAddress();
        bobAddress = await bob.getAddress();
    });

    describe("Correct setup", () => {
        it("should be named 'NonStandardERC20Token'", async () => {
            const name = await contract.name();
            expect(name).to.equal("NonStandardERC20Token");
        });
        it("should have correct supply", async () => {
            const supply = await contract.getTotalSupply();
            expect(ethers.formatEther(supply)).to.equal(ethers.formatEther(initialSupply));
        });
        it("owner should have all the supply", async () => {
            const ownerBalance = await contract.balanceOf(ownerAddress);
            expect(ethers.formatEther(ownerBalance)).to.equal(ethers.formatEther(initialSupply));
        });
    });

    describe("Core", () => {
        it("owner should transfer to Alice and update balances", async () => {
            const transferAmount = ethers.parseEther("1000");
            let aliceBalance = await contract.balanceOf(aliceAddress);
            expect(ethers.formatEther(aliceBalance)).to.equal("0.0");
            await contract.transfer(transferAmount, aliceAddress);
            aliceBalance = await contract.balanceOf(aliceAddress);
            expect(ethers.formatEther(aliceBalance)).to.equal(ethers.formatEther(transferAmount));
        });
        it("owner should transfer to Alice and Alice to Bob", async () => {
            const transferAmount = ethers.parseEther("1000");
            await contract.transfer(transferAmount, aliceAddress); // contract is connected to the owner.
            let bobBalance = await contract.balanceOf(bobAddress);
            expect(ethers.formatEther(bobBalance)).to.equal("0.0");
            await contract.connect(alice).transfer(transferAmount, bobAddress);
            bobBalance = await contract.balanceOf(bobAddress);
            expect(ethers.formatEther(bobBalance)).to.equal(ethers.formatEther(transferAmount));
        });
    });
});
