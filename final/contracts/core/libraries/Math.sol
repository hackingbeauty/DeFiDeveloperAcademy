// SPDX-License-Identifier: MIT
pragma solidity=0.8.17;

// a library for performing various math operations
library Math {
    function min(uint x, uint y) internal pure returns (uint z) {
        z = x < y ? x : y;
    }

    // babylonian method (https://en.wikipedia.org/wiki/Methods_of_computing_square_roots#Babylonian_method)
    function sqrt(uint y) internal pure returns (uint z) {
        if (y > 3) {
            z = y;
            uint x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }

    function mul(uint256 a, uint256 b) internal pure returns(uint256 product) {
        assembly { product := mul(a,b) }
        if(product <= type(uint256).max && product >= 0) {
            return product;
        } else {
            revert('overflow/underflow');
        }
    }

    function div(uint256 a, uint256 b) internal pure returns(uint256 quotient) {
        assembly { quotient := div(a,b) }
        if(quotient <= type(uint256).max && quotient >= 0) {
            return quotient;
        } else {
            revert('overflow/underflow');
        }
    }
}
