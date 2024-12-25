// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

const path = require("path");
const hre = require("hardhat");

async function main() {
  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  const accountBalance = await deployer.provider.getBalance(deployer.address);
  
  console.log("------- Account balance: ", accountBalance);
  console.log("------- Deployer address is: ------- ", deployer.address);

  const nonStandardERC20Token = await hre.ethers.deployContract("NonStandardERC20Token", [
    "10000",
  ], {});
  await nonStandardERC20Token.waitForDeployment();

  console.log('--- Deployed Contract address: ', nonStandardERC20Token.target)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
