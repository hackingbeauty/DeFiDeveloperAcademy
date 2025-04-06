import { 
  LOCALHOST_CONTRACT_ADDRESS,
  SEPOLIA_CONTRACT_ADDRESS,
  MAINNET_CONTRACT_ADDRESS
} from 'configs/config-main'

export function getNetworkNameFromId(id) {
  switch (id) {
    case 1:
      return 'Mainnet'
    case 11155111:
      return 'Sepolia'
    case 31337:
      return 'Localhost'
    default:
      return 'Localhost'
  }
}

export function getContractAddressFromChainId(id){
  const network = getNetworkNameFromId(id)
  
  console.log('---- the selected network is: ----', network)

  switch (network) {
    case 'Mainnet':
      return MAINNET_CONTRACT_ADDRESS
    case 'Sepolia':
      return SEPOLIA_CONTRACT_ADDRESS
    case 'Localhost':
      return LOCALHOST_CONTRACT_ADDRESS
    default:
      return LOCALHOST_CONTRACT_ADDRESS
  }
}