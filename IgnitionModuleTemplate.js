const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("IgnitionModule", (m) => {

  const apollo = m.contract("ContractName", [
    "constructor arg 1",
    "constructor arg 2"
  ]);

  return { apollo };
});
