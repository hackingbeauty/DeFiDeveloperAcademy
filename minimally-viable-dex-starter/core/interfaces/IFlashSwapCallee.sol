// SPDX-License-Identifier: MIT
pragma solidity=0.8.28;

interface IFlashSwapCallee {
    function flashSwapCall(address sender, uint amount0, uint amount1, bytes calldata data) external;
}

