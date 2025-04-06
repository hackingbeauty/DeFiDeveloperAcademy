import React, { Component } from 'react'
import PropTypes from 'prop-types'

const RouteContainer = (props) => {
  const { children } = props

  return (
    <div>{children}</div>
  )
}

RouteContainer.propTypes = {
  children: PropTypes.node.isRequired,
}

export default RouteContainer
