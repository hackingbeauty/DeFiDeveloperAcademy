//SPDX-License-Identifier: MIT
pragma solidity=0.8.28;

import './interfaces/IFactory.sol';
import './interfaces/ITradingPair.sol';
import './TradingPair.sol';

contract Factory is IFactory {
    address public feeTo;
    address public feeToSetter;

    mapping(address => mapping(address => address)) public getTradingPair;
    address[] public allTradingPairs;

    event PairCreated(address indexed token0, address indexed token1, address pair, uint);

    constructor(address _feeToSetter) {
        feeToSetter = _feeToSetter;
    }

    function createTradingPair(address tokenA, address tokenB) external returns (address pair) {
        // Code for deploying Trading Pair goes here
    }

    function setFeeTo(address _feeTo) external {
        require(msg.sender == feeToSetter, 'UniswapV2: FORBIDDEN');
        feeTo = _feeTo;
    }

    function setFeeToSetter(address _feeToSetter) external {
        require(msg.sender == feeToSetter, 'UniswapV2: FORBIDDEN');
        feeToSetter = _feeToSetter;
    }
}