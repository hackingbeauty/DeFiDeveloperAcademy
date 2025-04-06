import React                   from 'react'
import PropTypes               from 'prop-types'
import { AppBar as MuiAppBar } from '@material-ui/core'
import { styles }              from './styles.scss'

const AppBar = (props) => {
  const { children, chainId, ...other } = props
  const displayMainnetColors = chainId === 1 ? 'is-mainnet' : ''

  return (
    <div className={styles}>
      <MuiAppBar
        {...other}
        className={`app-bar ${displayMainnetColors}`}
      >
        {children}
      </MuiAppBar>
    </div>
  )
}

AppBar.propTypes = {
  children: PropTypes.node
}

AppBar.defaultProps = {
  children: null
}

export default AppBar
