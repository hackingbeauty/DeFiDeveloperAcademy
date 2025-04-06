import React from 'react'
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom'
import Header from 'components/Header'
import ChainId from 'components/ChainId'
import TransactionLoadingIndicator from 'components/TransactionLoadingIndicator'
import { AccountBalanceWallet,  MonetizationOn } from '@material-ui/icons'
import { styles } from './styles.scss'

/* eslint-disable react/jsx-no-bind */
const AppLayoutRoute = ({ 
    component: Component,
    path,
    routeKey,
    isLoading,
    transactionProcessingMsg,
    chainId
  }) => {
  const navLinks = [
    {
      label: "Deposit",
      link: '/deposit',
      icon: AccountBalanceWallet
    },
    {
      label: "Withdraw",
      link: '/withdraw',
      icon: MonetizationOn
    }
  ]

  return (
    <Route
      path={path}
      key={routeKey}
      render={matchProps => (
        <div className={styles}>
          <div className="app-shell">
            <Header
              layout="app"
              navLinks={navLinks}
            />
            <Component {...matchProps} />
            <TransactionLoadingIndicator
              isLoading={isLoading}
              transactionProcessingMsg={transactionProcessingMsg}
            />
          </div>
        </div>
      )}
    />
  )
}

AppLayoutRoute.propTypes = {
  component: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
  routeKey: PropTypes.string
}

AppLayoutRoute.defaultProps = {
  routeKey: ''
}

export default AppLayoutRoute
