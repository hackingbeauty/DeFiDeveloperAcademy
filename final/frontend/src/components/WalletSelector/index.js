import React from 'react'
import Button from 'components/Button'
import MetaMaskWalletIcon from 'assets/icons/wallet-metamask.svg'
import { styles } from './styles.scss'

const WalletSelector = (props) => {
  return (
    <div className={styles}>
      <div className="wallet-selector">
        <div className="container">
          <strong>Select Your Wallet</strong>
          <br />
          <br />
          <Button
            color="primary"
            size="large"
            variant="outlined"
            onClick={props.onClick}
          > 
            <img src={MetaMaskWalletIcon} />
            Connect MetaMask
          </Button>
        </div>
      </div>
    </div>
  )
}

export default WalletSelector
