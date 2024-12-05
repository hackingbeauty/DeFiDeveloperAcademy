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
        initialSupply = ethers.utils.parseEther("100000");
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
            expect(ethers.utils.formatEther(supply)).to.equal(ethers.utils.formatEther(initialSupply));
        });
        it("owner should have all the supply", async () => {
            const ownerBalance = await contract.balanceOf(ownerAddress);
            expect(ethers.utils.formatEther(ownerBalance)).to.equal(ethers.utils.formatEther(initialSupply));
        });
    });

    describe("Core", () => {
        it("owner should transfer to Alice and update balances", async () => {
            const transferAmount = ethers.utils.parseEther("1000");
            let aliceBalance = await contract.balanceOf(aliceAddress);
            expect(ethers.utils.formatEther(aliceBalance)).to.equal("0.0");
            await contract.transfer(transferAmount, aliceAddress);
            aliceBalance = await contract.balanceOf(aliceAddress);
            expect(ethers.utils.formatEther(aliceBalance)).to.equal(ethers.utils.formatEther(transferAmount));
        });
        it("owner should transfer to Alice and Alice to Bob", async () => {
            const transferAmount = ethers.utils.parseEther("1000");
            await contract.transfer(transferAmount, aliceAddress); // contract is connected to the owner.
            let bobBalance = await contract.balanceOf(bobAddress);
            expect(ethers.utils.formatEther(bobBalance)).to.equal("0.0");
            await contract.connect(alice).transfer(transferAmount, bobAddress);
            bobBalance = await contract.balanceOf(bobAddress);
            expect(ethers.utils.formatEther(bobBalance)).to.equal(ethers.utils.formatEther(transferAmount));
        });
    });
});
