//reference: https://github.com/ethers-io/ethers.js/issues/1182
const { ethers } = require("hardhat");

const ONE = ethers.BigNumber.from(1);
const TWO = ethers.BigNumber.from(2);

function bigNumberSqrt(value) {
    x = ethers.BigNumber.from(value);
    let z = x.add(ONE).div(TWO);
    let y = x;
    while (z.sub(y).isNegative()) {
        y = z;
        z = x.div(z).add(z).div(TWO);
    }
    return y;
}

module.exports = { bigNumberSqrt }