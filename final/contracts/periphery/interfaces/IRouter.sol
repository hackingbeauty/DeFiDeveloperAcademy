// SPDX-License-Identifier: MIT
pragma solidity=0.8.17;

interface IRouter {
    function factoryAddr() external view returns (address);
    function WETH() external view returns (address);
    function depositLiquidity(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB, uint liquidity);
     function withdrawLiquidity(
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountASent, uint amountBSent);
}