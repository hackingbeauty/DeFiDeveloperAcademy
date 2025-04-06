import constants from 'core/types'

const initialState = {
  currency0: "eth",
  currency1: "dai",
  transactionStatus: null,
  transactionProcessingMsg: '',
  showLoader: false
}

export function transactionReducer(state = initialState, action) {
  switch (action.type) {

    case constants.ADD_LIQUIDITY_TX:
      return Object.assign({}, state, {
        transactionStatus: action.payload.transactionStatus,
        transactionProcessingMsg: action.payload.transactionProcessingMsg,
        showLoader: action.payload.showLoader
      })

    case constants.SET_CURRENCY:
      return Object.assign({}, state, {
        currency0: action.payload.currency0,
        currency1: action.payload.currency1
      })

    default:
      return state
  }
}

export default transactionReducer

