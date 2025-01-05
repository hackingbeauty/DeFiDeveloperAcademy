// SPDX-License-Identifier: MIT
pragma solidity=0.8.28;

import '../../libraries/SafeMath.sol';
import '../../core/interfaces/ITradingPair.sol';
import '../../core/TradingPair.sol';

library DEXLibrary {
    using SafeMath for uint;
    
    // returns sorted token addresses, used to handle return values from pairs sorted in this order
    function sortTokens(address tokenA, address tokenB) internal pure returns (address token0, address token1) {
        require(tokenA != tokenB, 'DEX_LIBRARY: IDENTICAL_ADDRESS');
        (token0, token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(token0 != address(0), 'DEX_LIBRARY: ZERO_ADDRESS');
    }

    // calculates the CREATE2 address for a pair
    function pairFor(address factory, address tokenA, address tokenB) internal pure returns (address pair) {
        (address token0, address token1) = sortTokens(tokenA, tokenB);
        
        bytes32 salt = keccak256(abi.encode(token0, token1));
        bytes memory bytecode = type(TradingPair).creationCode;

        pair = address(uint160(uint(keccak256(abi.encodePacked(
            bytes1(0xff),
            factory,
            salt,
            keccak256(bytecode)
        )))));
    }

    // fetches and sorts the reserves for a pair
    function getReserves(address factory, address tokenA, address tokenB) internal view returns (uint reserveA, uint reserveB) {
        (address token0,) = sortTokens(tokenA, tokenB);
        (uint reserve0, uint reserve1) = ITradingPair(pairFor(factory, tokenA, tokenB)).getReserves();
        (reserveA, reserveB) = tokenA == token0 ? (reserve0, reserve1) : (reserve1, reserve0);
    }    

    // given some amount of an asset and pair reserves, returns an equivalent amount of the other asset
    function quote(uint amountA, uint reserveA, uint reserveB) internal pure returns (uint amountB) {
        require(amountA > 0, 'DEX_LIBRARY: INSUFFICIENT_AMOUNT');
        require(reserveA > 0 && reserveB > 0, 'DEX_LIBRARY: INSUFFICIENT_LIQUIDITY');
        amountB = amountA.mul(reserveB) / reserveA;
    }

    // given an input amount of an asset and pair reserves, returns the maximum output amount of the other asset
    function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) internal pure returns (uint amountOut) {

    }

    // given an output amount of an asset and pair reserves, returns a required input amount of the other asset
    function getAmountIn(uint amountOut, uint reserveIn, uint reserveOut) internal pure returns (uint amountIn) {

    }

    // performs chained getAmountOut calculations on any number of pairs
    function getAmountsOut(address factory, uint amountIn, address[] memory path) internal view returns (uint[] memory amounts) {

    }

    // performs chained getAmountIn calculations on any number of pairs
    function getAmountsIn(address factory, uint amountOut, address[] memory path) internal view returns (uint[] memory amounts) {

    }
}