import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Input as MuiInput } from '@material-ui/core'
import NumberFormatter from 'components/NumberFormatter'
import { styles } from './styles.scss'

class NumberInput extends Component {
  displayErrorOrWarning() {
    const { errorMsg, warningMsg } = this.props
    if (errorMsg) {
      return <div className="msg error">{errorMsg}</div>
    } else if (warningMsg) {
      return <div className="msg warning">{warningMsg}</div>
    }

    return <div className="msg" />
  }

  render() {
    const {
      errorMsg,
      placeholder,
      warningMsg, 
      ...other
    } = this.props

    return (
      <div className={styles}>
        <MuiInput
          className="input-field"
          disableUnderline
          error={!!errorMsg}
          placeholder={placeholder}
          classes={{
            focused: 'input-focused',
            error: 'input-error'
          }}
          name="input-box"
          inputComponent={NumberFormatter}
          {...other}
        />
        {this.displayErrorOrWarning()}
      </div>
    )
  }
}

NumberInput.propTypes = {
  errorMsg: PropTypes.string,
  warningMsg: PropTypes.string,
  placeholder: PropTypes.string
}

NumberInput.defaultProps = {
  errorMsg: '',
  warningMsg: '',
  placeholder: 'Enter here'
}

export default NumberInput
