import React, { Component } from 'react'
import PropTypes            from 'prop-types'
import CircularProgress     from '@material-ui/core/CircularProgress'
import LinearProgress       from '@material-ui/core/LinearProgress'
import { styles }           from './styles.scss'

class ProgressIndicator extends Component {
  display = () => {
    const { type } = this.props
    let indicator

    if (type === 'linear') {
      indicator = (
        <div className="progress-indicator-linear">
          <LinearProgress
            {...this.props}
            classes={{
              colorPrimary: 'color-primary',
              colorSecondary: 'color-secondary',
              barColorPrimary: 'bar-color-primary',
              barColorSecondary: 'bar-color-secondary'
            }}
            className="progress-indicator-linear"
          />
        </div>
      )
    } else {
      indicator = (
        <div className="progress-indicator-circular">
          <CircularProgress
            {...this.props}
            classes={{
              colorPrimary: 'color-circular-primary',
              colorSecondary: 'color-circular-secondary'
            }}
          />
        </div>
      )
    }

    return (
      <div className="progress-indicator">
        {indicator}
      </div>
    )
  }

  render() {
    return (
      <div className={styles}>
        {this.display()}
      </div>
    )
  }
}

ProgressIndicator.propTypes = {
  type: PropTypes.string
}

ProgressIndicator.defaultProps = {
  type: 'circular'
}

export default ProgressIndicator
