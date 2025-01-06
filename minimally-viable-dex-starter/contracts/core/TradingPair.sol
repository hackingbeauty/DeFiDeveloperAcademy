// SPDX-License-Identifier: MIT
pragma solidity=0.8.28;

import './interfaces/ITradingPair.sol';
import './interfaces/IERC20.sol';
import './libraries/Math.sol';
import './LiquidityTokenERC20.sol';
import './interfaces/IFactory.sol';
import './interfaces/IFlashSwapCallee.sol';
import '../libraries/SafeMath.sol';

contract TradingPair is ITradingPair, LiquidityTokenERC20 {
    using SafeMath for uint;

    uint public constant MINIMUM_LIQUIDITY = 10**3;
    bytes4 private constant SELECTOR = bytes4(keccak256(bytes('transfer(address,uint256)')));

    address public factory;
    address public token0;
    address public token1;

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
        factory = msg.sender;
    }

    function initialize(address _token0, address _token1) external {
        require(msg.sender == factory, 'DEX: FORBIDDEN');
        token0 = _token0;
        token1 = _token1;
    }

    function getReserves() public view returns (uint112 _reserve0, uint112 _reserve1) {
        _reserve0 = reserve0;
        _reserve1 = reserve1;
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
       address feeTo = IFactory(factory).feeTo();
        feeOn = feeTo != address(0);
        uint _kLast = kLast; // gas savings
        if (feeOn) {
            if (_kLast != 0) {
                uint rootK = Math.sqrt(uint(_reserve0).mul(_reserve1));
                uint rootKLast = Math.sqrt(_kLast);
                if (rootK > rootKLast) {
                    uint numerator = totalSupply.mul(rootK.sub(rootKLast));
                    uint denominator = rootK.mul(5).add(rootKLast);
                    uint liquidity = numerator / denominator;
                    if (liquidity > 0) _mint(feeTo, liquidity);
                }
            }
        }
    }

    function mint(address to) external lock returns (uint liquidity) {
        // Add code for minting Liquidy Tokens here...
    }

    function burn(address to) external lock returns (uint amountASent, uint amountBSent) {
        // Add code for burning Liquidity Tokens here...
    }

    // this low-level function should be called from a contract which performs important safety checks
    function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data) external lock {
        // Add code for swapping/exchange here...
    }

    function approve(
        address spender,
        uint value
    ) public override(ITradingPair, LiquidityTokenERC20) returns (bool) { 
        (bool approvalSuccess ) = super.approve(spender, value);
        return approvalSuccess;
    }

    function transferFrom(
        address from,
        address to,
        uint value
    ) public override(ITradingPair, LiquidityTokenERC20) returns (bool){
        (bool transferSuccess) = super.transferFrom(from, to, value);
        return transferSuccess;
    }

}