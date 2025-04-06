import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as transactionActionCreators from 'core/actions/actions-transaction'
import * as uiActionCreators  from 'core/actions/actions-ui'
import Button from 'components/Button'
import TokenMenu from 'components/TokenMenu'
import ethToken from 'assets/icons/tokens/eth.png'
import daiToken from 'assets/icons/tokens/dai.png'
import { styles } from './styles.scss'

class DepositView extends Component {
  constructor(props) {
    super(props)
    const defaultFirstTokenHTML = (
      <div>
        <img width="20" src={ethToken} />
        <span>ETH</span>
      </div>
    );
    const defaultSecondTokenHTML = (
      // <div>
      //   <span>Select Currency</span>
      // </div>
      <div>
        <img width="20" src={daiToken} />
        <span>DAI</span>
    </div>
    );
    this.state = { 
      selectedFirstTokenHTML: defaultFirstTokenHTML,
      selectedSecondTokenHTML: defaultSecondTokenHTML,
      currency0: null,
      currency1: null
    }
  }
  
  onFirstTokenChange= (selectedCurrency, selectedTokenElem) => {
    const { actions } = this.props
    const selectedTokenHTML = selectedTokenElem.innerHTML
    const html = (
      <div dangerouslySetInnerHTML={{ __html: selectedTokenHTML }}>
      </div>
    )
    this.setState({ 
      selectedFirstTokenHTML: html,
      currency0: selectedCurrency
    })
    actions.transaction.selectCurrency({ 
      currency0: selectedCurrency, 
      currency1: this.state.currency1
    })
  }

  onSecondTokenChange= (selectedCurrency, selectedTokenElem) => {
    const { actions } = this.props
    const selectedTokenHTML = selectedTokenElem.innerHTML
    const html = (
      <div dangerouslySetInnerHTML={{ __html: selectedTokenHTML }}>
      </div>
    )
    this.setState({ 
      selectedSecondTokenHTML: html,
      currency1: selectedCurrency 
    })
    actions.transaction.selectCurrency({ 
      currency0: this.state.currency0,
      currency1: selectedCurrency
    })
  }

  submitForm= (event) => {
    const { actions } = this.props
    const { transaction } = actions

    transaction.addLiquidity(
      true,    // currency0isETH
      "-60",    // tickLower
      "60",     // tickUpper
      "10000",  // liquidity
      "30",     // amount0Max
      "40",     // amount1Max
      "0",      // ethToSend
      "",       // hookData
      true      // showLoader
    )

    event.preventDefault()
  }

  render() {
    const { 
      selectedFirstTokenHTML,
      selectedSecondTokenHTML
    } = this.state;

    return (
      <div className={styles}>
        <div className="container">
          <form onSubmit={this.submitForm}>
            <div className="section">
              <div id="deposit-liquidity-form-container" className="box">
                <h3>Deposit Liquidity</h3>
                <form id="deposit-liquidity-form">
                  <div className="section">
                    <TokenMenu onClose={this.onFirstTokenChange}>
                      <div className="menu-item">
                        {selectedFirstTokenHTML}
                      </div>
                    </TokenMenu>
                  </div>
                  <div className="section">
                    <TokenMenu onClose={this.onSecondTokenChange}>
                      <div className="menu-item">
                        {selectedSecondTokenHTML}
                      </div>
                    </TokenMenu>
                  </div>
                  <div className="section">
                    <Button
                      color="primary"
                      variant="text"
                      type="submit"
                    >
                      Deposit
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    provider: state.provider,
    transaction: state.transaction
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      transaction: bindActionCreators(transactionActionCreators, dispatch),
      ui: bindActionCreators(uiActionCreators, dispatch)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DepositView)