import constants from 'core/types'

export function setProvider(networkId) {
  return {
    type: constants.INIT_PROVIDER,
    networkId
  }
}

export function setChainId(chainId) {
  return {
    type: constants.INIT_CHAIN_ID,
    chainId
  }
}

export function connectMetaMask() {
  return {
    type: constants.CONNECT_METAMASK
  }
}

export function metaMaskAccountChange(metaMaskAccount){
  return {
    type: constants.METAMASK_ACCOUNT_CHANGE,
    metaMaskAccount
  }
}


