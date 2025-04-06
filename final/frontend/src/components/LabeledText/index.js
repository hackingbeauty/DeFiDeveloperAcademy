import React from 'react'
import PropTypes from 'prop-types'
import { styles } from './styles.scss'

const LabeledText = (props) => {
  const {
    label, value, labelClass, valueClass, labelAbove
  } = props

  if (labelAbove) {
    return (
      <div className={styles}>
        <div className={`label ${labelClass}`}>{label}</div>
        <div className={`value ${valueClass}`}>{value}</div>
      </div>
    )
  }

  return (
    <div className={styles}>
      <div className={`value ${valueClass}`}>{value}</div>
      <div className={`label ${labelClass}`}>{label}</div>
    </div>
  )
}

LabeledText.propTypes = {
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]).isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]).isRequired,
  labelClass: PropTypes.string,
  valueClass: PropTypes.string,
  labelAbove: PropTypes.bool
}

LabeledText.defaultProps = {
  labelAbove: false,
  labelClass: '',
  valueClass: ''
}

export default LabeledText
