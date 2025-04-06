import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { Snackbar } from '@material-ui/core'
import Drawer from 'components/Drawer'
import { ThemeProvider } from 'styled-components'
import {
  BrowserRouter,
  Redirect,
  Switch
} from 'react-router-dom'
import muiTheme from 'configs/theme/config-theme'
import * as providerActionCreators  from 'core/actions/actions-provider'
import * as uiActionCreators  from 'core/actions/actions-ui'
import WalletSelector from 'components/WalletSelector'
import StandardModal from 'components/Modals/StandardModal'
import InstallMetaMaskPrompt from 'components/InstallMetaMaskPrompt'
import WithdrawView from 'containers/WithdrawView'
import DepositView from 'containers/DepositView'
import RouteContainer from './components/RouteContainer'
import AppLayoutRoute from './layouts/AppLayoutRoute'
import './styles.scss' // global styles

class App extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount = async () => {
    const { actions } = this.props
    actions.provider.setProvider()
    actions.provider.setChainId()

    if(window && window.ethereum) {
      
      /* If user locks MetaMask, update header to sign user out */
      window.ethereum.on("accountsChanged", (accounts) => {
        const metaMaskAccount = accounts[0]
        actions.provider.metaMaskAccountChange(metaMaskAccount)
        actions.provider.setProvider()
      })

      window.ethereum.on("chainChanged", (chainId) => {
        actions.provider.setChainId(chainId)
        actions.provider.setProvider()
      })
    }
  }

  connectMetaMask = async () => {
    const { actions } = this.props
    actions.provider.connectMetaMask()
  }

  closeModal = async() => {
    const { actions } = this.props
    actions.ui.closeModal()
    actions.ui.closeRightDrawer()
  }

  render() {
    const { actions, ui, provider, transaction } = this.props
    const { modalState, } = ui
    const { chainId } = provider
    const { closeSnackBar } = actions.ui
    const { snackBarOpen, showLoader } = ui
    const { transactionStatus, transactionProcessingMsg } = transaction

    return (
      <MuiThemeProvider theme={muiTheme}>
        <ThemeProvider theme={muiTheme}>
          <BrowserRouter>
            <RouteContainer>
              <Switch>
                <AppLayoutRoute
                  path="/deposit"
                  component={DepositView}
                  isLoading={showLoader}
                  transactionProcessingMsg={transactionProcessingMsg}
                  chainId={chainId}
                />
                <AppLayoutRoute
                  path="/withdraw"
                  component={WithdrawView}
                  isLoading={showLoader}
                  transactionProcessingMsg={transactionProcessingMsg}
                  chainId={chainId}
                />
                <Redirect from="/" to="/deposit" />
              </Switch>
            </RouteContainer>
            <Drawer
              anchor="right"
              classes="yada"
              open={ui.rightDrawerIsOpen}
              onClose={actions.ui.closeRightDrawer}
            >
              <WalletSelector onClick={this.connectMetaMask}/>
            </Drawer>
            <StandardModal
              modalKey={modalState.modalKey}
              modalState={modalState}
              onClose={this.closeModal}
            >
              <InstallMetaMaskPrompt />
            </StandardModal>
            <Snackbar
              open={snackBarOpen}
              autoHideDuration={16000}
              onClose={closeSnackBar}
              message={transactionStatus}
              anchorOrigin={ 
                {vertical: 'bottom', horizontal: 'left'}
              }
            />
          </BrowserRouter>
        </ThemeProvider>
      </MuiThemeProvider>
    )
  }
}

function mapStateToProps(state) {
  return {
    provider: state.provider,
    transaction: state.transaction,
    ui: state.ui
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      provider: bindActionCreators(providerActionCreators, dispatch),
      ui: bindActionCreators(uiActionCreators, dispatch)
    }
  }
}

App.propTypes = {
  actions: PropTypes.shape({
    provider: PropTypes.shape({
      setProvider: PropTypes.func
    })
  }).isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(App)