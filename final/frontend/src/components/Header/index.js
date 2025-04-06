import React, { Component } from 'react'
import AppBar from 'components/AppBar'
import { Toolbar } from '@material-ui/core'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as uiActionCreators from 'core/actions/actions-ui'
import Button from 'components/Button'
import Navigation from './components/Navigation'
import MetaMaskAccount from './components/MetaMaskAccount'
import { styles } from './styles.scss'

class Header extends Component {
  connectWallet = () =>{
    const { actions } = this.props
    actions.ui.openRightDrawer()
  }

  displayMetaMaskAccount = () => {
    return (<MetaMaskAccount />)
  }

  displayRightHeaderBtn = () => {
    return (
      <Button
        variant="outlined"
        color="primary"
        onClick={this.connectWallet}
      >
        Connect Wallet
      </Button>
    )
  }

  render() {
    const { navLinks, provider } = this.props
    const { metaMaskAccount, chainId } = provider
    let rightBtn
    
    if(provider && metaMaskAccount && metaMaskAccount.length){
      rightBtn = this.displayMetaMaskAccount()
    } else {
      rightBtn = this.displayRightHeaderBtn()
    }


    return (
      <div className={styles}>
        <AppBar
          elevation={0}
          position="static"
          chainId={chainId}
        >
          <Toolbar>
            <Navigation
              navLinks={navLinks}
              rightBtn={rightBtn}
            />
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    provider: state.provider,
    ui: state.ui
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      ui: bindActionCreators(uiActionCreators, dispatch)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
