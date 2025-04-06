import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import MainLoader from 'components/MainLoader'

const propTypes = {
  loading: PropTypes.bool
}

const defaultProps = {
  loading: true
}

export function enhanceComponent(WrappedComponent, parentKey, key, loaderType) {
  class LoadingComponent extends React.Component {
    render() {
      const isLoading = this.props[parentKey][key] === null

      if (isLoading) {
        return (
          <MainLoader
            className="main-loader"
            size={60}
            type={loaderType}
            color="secondary"
          />
        )
      }

      return (
        <div>
          <WrappedComponent {...this.props} />
        </div>
      )
    }
  }

  LoadingComponent.propTypes = propTypes
  LoadingComponent.defaultProps = defaultProps

  return LoadingComponent
}

export const mapStateToProps = (parentKey, key, state) => {
  return {
    [parentKey]: state[parentKey]
  }
}

export default function loadComponentWhenReady(parentKey, key, loaderType) {
  return function enhance(WrappedComponent) {
    return connect(
      mapStateToProps.bind(this, parentKey, key)
    )(enhanceComponent(WrappedComponent, parentKey, key, loaderType))
  }
}
