// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import '../../contracts/core/interfaces/ITradingPair.sol';
import '../../contracts/core/interfaces/IERC20.sol';

contract ReentrancyAttacker {
    address public callingContractAddr;

    constructor(address _callingContractAddr) {
        callingContractAddr = _callingContractAddr;
    }

    function approve (address erc20TokenAddr, address delegate, uint256 numTokens) external {
        IERC20(erc20TokenAddr).approve(delegate, numTokens);
    }

    receive() external payable {
                
        ITradingPair(callingContractAddr).mint(address(this));                
    }
}