import constants from 'core/types'

export function addLiquidity(
  currency0isETH,
  tickLower,
  tickUpper,
  liquidity,
  amount0Max,
  amount1Max,
  ethToSend,
  hookData,
  showLoader
) {
  return {
    type: constants.ADD_LIQUIDITY,
    currency0isETH,
    tickLower,
    tickUpper,
    liquidity,
    amount0Max,
    amount1Max,
    ethToSend,
    hookData,
    showLoader
  }
}

export function selectCurrency(selectedCurrency) {
  const { currency0, currency1 } = selectedCurrency

  return {
    type: constants.SET_CURRENCY,
    payload: {
      currency0,
      currency1
    }
  }
}

export function changeContractOwner(newOwner, showLoader) {
  return {
    type: constants.CHANGE_CONTRACT_OWNER,
    newOwner,
    showLoader
  }
}