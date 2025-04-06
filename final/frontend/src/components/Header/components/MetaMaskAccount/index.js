import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import loadComponentWhenReady from 'core/hocs/hoc-loading-component'
import { styles } from './styles.scss'

class MetaMaskAccount extends Component {
    render() {
      const { provider } = this.props
      const { metaMaskAccount } = provider

      return (
        <div className={styles}>
          <span id="metamask-account">
            Connected Wallet Account: &nbsp;
            <strong>{metaMaskAccount}</strong>
          </span>
        </div>
      )
    }
}

function mapStateToProps(state) {
    return {
      provider: state.provider
    }
  }

export default compose(
    connect(mapStateToProps),
    loadComponentWhenReady('provider')
  )(MetaMaskAccount)
