import React    from 'react'
import { Link } from 'react-router-dom'

import Button from 'components/Button'

import MetaMaskWalletIcon from 'assets/icons/wallet-metamask.svg'
import { styles } from './styles.scss'

const InstallMetaMaskPrompt = (props) => {
  return (
    <div className={styles}>
      <div className="wallet-selector">
        <div className="container">
          <strong>You need the MetaMask Extension</strong>
          <Button
            color="primary"
            size="large"
            variant="outlined"
            href="https://metamask.io/download/"
            target="_blank"
          > 
            <img src={MetaMaskWalletIcon} />
            Install MetaMask
          </Button>
        </div>
      </div>
    </div>
  )
}

export default InstallMetaMaskPrompt
