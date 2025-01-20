// SPDX-License-Identifier: MIT
pragma solidity=0.8.17;

interface ITradingPairExchange {
    function initialize(address, address) external;
    function getReserves() external view returns(uint112 _reserve0, uint112 _reserve1, uint32 _blockTimestampLast);
    function mint(address to) external returns (uint liquidity);
    function burn(address to) external returns (uint amount0, uint amount1);
    function approve(address spender, uint value) external returns (bool);
    function transferFrom(address from, address to, uint value) external returns (bool);
    function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data) external;  
}