// SPDX-License-Identifier: MIT
pragma solidity=0.8.17;

import './interfaces/ITradingPairExchange.sol';
import './interfaces/IERC20.sol';
import './libraries/Math.sol';
import './LiquidityTokenERC20.sol';
import './interfaces/IFactory.sol';
import './interfaces/IUniswapV2Callee.sol';
import './libraries/SafeMath.sol';

import 'hardhat/console.sol';

contract TradingPairExchange is ITradingPairExchange, LiquidityTokenERC20 {
    using SafeMath for uint;

    uint public constant MINIMUM_LIQUIDITY = 10**3;
    bytes4 private constant SELECTOR = bytes4(keccak256(bytes('transfer(address,uint256)')));

    address public factoryAddr;
    address public tokenA;
    address public tokenB;

    uint112 private reserve0;
    uint112 private reserve1;
    uint32 private blockTimestampLast;
    uint public kLast; // reserve0 * reserve1, as of immediately after the most recently liquidty event
    uint private unlocked = 1;

    event Mint(address indexed sender, uint amount0, uint amount1);
    event Burn(address indexed sender, uint amount0, uint amount1, address indexed to);
    event Swap(
        address indexed sender,
        uint amount0In,
        uint amount1In,
        uint amount0Out,
        uint amount1Out,
        address indexed to
    );

    modifier lock(){
        require(unlocked == 1, 'DEX: LOCKED');
        unlocked = 0;
        _;
        unlocked = 1;
    }

    constructor() {
        factoryAddr = msg.sender;
    }

    function initialize(address _tokenA, address _tokenB) external {
        require(msg.sender == factoryAddr, 'DEX: FORBIDDEN');
        tokenA = _tokenA;
        tokenB = _tokenB;
    }

    function getReserves() public view returns (uint112 _reserve0, uint112 _reserve1, uint32 _blockTimestampLast) {
        _reserve0 = reserve0;
        _reserve1 = reserve1;
        _blockTimestampLast = blockTimestampLast;
    }

    function _safeTransfer(address token, address to, uint value) private {
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(SELECTOR, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), 'DEX: TRANSFER_FAILED');
    }

    function _update(uint balance0, uint balance1) internal {
        require(balance0 <= type(uint112).max && balance1 <= type(uint112).max, 'DEX: Overflow');
        reserve0 = uint112(balance0);
        reserve1 = uint112(balance1);

        uint32 blockTimestamp = uint32(block.timestamp % 2**32);
        blockTimestampLast = blockTimestamp;
    }

    function _mintFee(uint112 _reserve0, uint112 _reserve1) private returns (bool feeOn) {
        address feeTo = IFactory(factoryAddr).feeTo();
        feeOn = feeTo != address(0);

        uint _kLast = kLast; // gas savings

        if(feeOn) {
            if(_kLast != 0) {
                uint rootK = Math.sqrt(Math.mul(_reserve0, _reserve1));
                uint rootKLast = Math.sqrt(_kLast);

                if(rootK > rootKLast) {
                    uint numerator = totalSupply * (rootK - rootKLast);
                    uint denominator = (rootK * 5) + rootKLast;
                    uint liquidity = numerator / denominator;
                    if(liquidity > 0) _mint(feeTo, liquidity);
                }
            }
        } else if (_kLast != 0){
            kLast = 0;
        }
    }

    function mint(address to) external lock returns (uint liquidity) {
        (uint112 _reserve0, uint112 _reserve1,) = getReserves();
        uint balance0 = IERC20(tokenA).balanceOf(address(this));
        uint balance1 = IERC20(tokenB).balanceOf(address(this));
        uint amount0 = balance0 - _reserve0;
        uint amount1 = balance1 - _reserve1;

        bool feeOn = _mintFee(_reserve0, _reserve1);

        uint _totalSupply = totalSupply; //gas savings
        if(_totalSupply == 0) {
            unchecked {
                liquidity = Math.sqrt(amount0 * amount1) - (MINIMUM_LIQUIDITY);
            }
            console.log('---total supply ----', _totalSupply);
            _mint(address(0), MINIMUM_LIQUIDITY);
        } else {
            liquidity = Math.min((amount0 * _totalSupply) / reserve0, (amount1 * _totalSupply) / reserve1);
        }
        require(liquidity > 0, 'DEX: INSUFFICIENT_LIQUIDITY_MINTED');

        _mint(to, liquidity);
        _update(balance0, balance1);

        if(feeOn) { kLast = Math.mul(_reserve0,_reserve1); } // _reserve0 and _reserve1 are up-to-date

        emit Mint(msg.sender, amount0, amount1);
    }

    function burn(address to) external lock returns (uint amountASent, uint amountBSent) {
        (uint112 _reserve0, uint112 _reserve1, ) = getReserves();
        address _token0 = tokenA;
        address _token1 = tokenB;
        uint balance0 = IERC20(_token0).balanceOf(address(this));
        uint balance1 = IERC20(_token1).balanceOf(address(this));
        uint liquidity = balanceOf[address(this)];

        bool feeOn = _mintFee(_reserve0, _reserve1);
        uint _totalSupply = totalSupply;
        amountASent = (liquidity * balance0) / _totalSupply;
        amountBSent = (liquidity * balance1) / _totalSupply;
        require(amountASent > 0 && amountBSent > 0, 'DEX: INSUFFICENT_LIQUIDITY_BURNED');

        _burn(address(this), liquidity);
        _safeTransfer(_token0, to, amountASent);
        _safeTransfer(_token1, to, amountBSent);

        balance0 = IERC20(_token0).balanceOf(address(this));
        balance1 = IERC20(_token1).balanceOf(address(this));
        _update(balance0, balance1);

        if(feeOn) { kLast = Math.mul(_reserve0, _reserve1); } // _reserve0 and _reserve1 are up-to-date
        emit Burn(msg.sender, amountASent, amountBSent, to);
    }

    // this low-level function should be called from a contract which performs important safety checks
    function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data) external lock {
        require(amount0Out > 0 || amount1Out > 0, 'DEX: INSUFFICIENT_OUTPUT_AMOUNT');
        (uint112 _reserve0, uint112 _reserve1,) = getReserves(); // gas savings
        require(amount0Out < _reserve0 && amount1Out < _reserve1, 'DEX: INSUFFICIENT_LIQUIDITY');

        uint balance0;
        uint balance1;
        { // scope for _token{0,1}, avoids stack too deep errors
        address _token0 = tokenA;
        address _token1 = tokenB;
        require(to != _token0 && to != _token1, 'DEX: INVALID_TO');
        if (amount0Out > 0) _safeTransfer(_token0, to, amount0Out); // optimistically transfer tokens
        if (amount1Out > 0) _safeTransfer(_token1, to, amount1Out); // optimistically transfer tokens
        if (data.length > 0) IUniswapV2Callee(to).uniswapV2Call(msg.sender, amount0Out, amount1Out, data);
        balance0 = IERC20(_token0).balanceOf(address(this));
        balance1 = IERC20(_token1).balanceOf(address(this));
        }
        uint amount0In = balance0 > _reserve0 - amount0Out ? balance0 - (_reserve0 - amount0Out) : 0;
        uint amount1In = balance1 > _reserve1 - amount1Out ? balance1 - (_reserve1 - amount1Out) : 0;

        require(amount0In > 0 || amount1In > 0, 'DEX: INSUFFICIENT_INPUT_AMOUNT');
        { // scope for reserve{0,1}Adjusted, avoids stack too deep errors
        uint balance0Adjusted = balance0.mul(1000).sub(amount0In.mul(3));
        uint balance1Adjusted = balance1.mul(1000).sub(amount1In.mul(3));
        require(balance0Adjusted.mul(balance1Adjusted) >= uint(_reserve0).mul(_reserve1).mul(1000**2), 'DEX: K');
        }

        _update(balance0, balance1);
        emit Swap(msg.sender, amount0In, amount1In, amount0Out, amount1Out, to);
    }

    function approve(
        address spender,
        uint value
    ) public override(ITradingPairExchange, LiquidityTokenERC20) returns (bool) { 
        (bool approvalSuccess ) = super.approve(spender, value);
        return approvalSuccess;
    }

    function transferFrom(
        address from,
        address to,
        uint value
    ) public override(ITradingPairExchange, LiquidityTokenERC20) returns (bool){
        (bool transferSuccess) = super.transferFrom(from, to, value);
        return transferSuccess;
    }

}