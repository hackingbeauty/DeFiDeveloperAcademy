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
  console.log("Deploying the contracts with the account:", await deployer.getAddress());

  const accountBalance = await deployer.provider.getBalance(deployer.address);
  
  console.log("------- Account balance: ", accountBalance);
  console.log("------- Deployer address is: ------- ", deployer.address);

  const contract = await ethers.getContractFactory("ContractName");
  const deploymentTx = await contract.deploy(deployer.address);

  console.log('--- Deployed Contract address: ', deploymentTx.address);
  saveFrontendFiles(contract);
}

function saveFrontendFiles(contract) {
  const fs = require("fs");
  const contractsDir = path.join(__dirname, "..", "frontend", "src", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify({ Contract: contract.address }, undefined, 2)
  );

  const ContractArtifact = artifacts.readArtifactSync("ContractName");

  fs.writeFileSync(
    path.join(contractsDir, "ContractName.json"),
    JSON.stringify(ContractArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
