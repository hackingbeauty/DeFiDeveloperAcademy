// SPDX-License-Identifer: MIT
pragma solidity=0.8.28;

interface IWETH {
    function deposit() external payable;
    function transfer(address to, uint value) external returns (bool);
    function withdraw(uint) external;
}
