import React from 'react'
import PropTypes from 'prop-types'
import { NumericFormat } from 'react-number-format'

export default function NumberFormatter(props) {
  const {
    inputRef, onChange, name, ...other
  } = props

  return (
    <NumericFormat
      {...other}
      type="text"
      getInputRef={inputRef}
      /* eslint-disable react/jsx-no-bind */
      onValueChange={(values) => {
        onChange({
          target: {
            name,
            value: values.value
          }
        })
      }}
      thousandSeparator
      allowNegative={false}
    />
  )
}

NumberFormatter.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}