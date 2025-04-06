import constants from 'core/types'

const initialState = {
  web3Provider: null,
  signer: null,
  metaMaskAccount: null,
  chainId: null,
  tokenName: null,
  tokenSymbol: null,
  totalSupply: null,
  tokenContractOwner: null
}

export function providerReducer(state = initialState, action) {
  switch (action.type) {
    case constants.SET_PROVIDER:
      return Object.assign({}, state, {
        web3Provider: action.payload.web3Provider,
        signer: action.payload.signer,
        metaMaskAccount: action.payload.metaMaskAccount,
        tokenName: action.payload.tokenName,
        tokenSymbol: action.payload.tokenSymbol,
        totalSupply: action.payload.totalSupply,
        tokenContractOwner: action.payload.tokenContractOwner,
        cappedTokenSupply: action.payload.cappedTokenSupply
      })
    
    case constants.SET_METAMASK_CONNECTION:
      return Object.assign({}, state, {
        metaMaskAccount: action.payload.metaMaskAccount
      })

    case constants.METAMASK_ACCOUNT_CHANGE:
      return Object.assign({}, state, {
        metaMaskAccount: action.metaMaskAccount
      })

    case constants.SET_CHAIN_ID:
      return Object.assign({}, state, {
        chainId: action.payload.chainId
      })

    case constants.UPDATE_TOKEN_INFO:
      return Object.assign({}, state, {
        totalSupply: action.payload.totalSupply
      })

    case constants.UPDATE_OWNER_INFO:
      return Object.assign({}, state, {
        tokenContractOwner: action.payload.tokenContractOwner
      })
    
    default:
      return state
  }
}

export default providerReducer