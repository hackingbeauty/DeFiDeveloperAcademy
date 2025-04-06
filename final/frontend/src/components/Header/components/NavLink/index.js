import React, { Component } from 'react'
import PropTypes            from 'prop-types'
import { withRouter }       from 'react-router-dom'
import { Tab }              from '@material-ui/core'
import { styles }           from './styles.scss'

class NavLink extends Component {
    onClick = (evt) => {
      const {
        externalLink,
        history,
        link,
        onTabSelect,
        value
      } = this.props

      if (externalLink) {
        window.location.replace(externalLink)
      } else if (link) {
        history.push(link)
      }

      onTabSelect(value)
      evt.preventDefault()
    }

    render() {
      const {
        icon,
        label,
        selected
      } = this.props

      return (
        <div className={styles}>
          <Tab
            className="tab"
            icon={icon}
            label={<span className="label">{label}</span>}
            onClick={this.onClick}
            selected={selected}
            classes={{
              selected: 'tab-selected',
              wrapper: 'tab-wrapper'
            }}
          />
        </div>
      )
    }
}

NavLink.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired,
  externalLink: PropTypes.string,
  label: PropTypes.string.isRequired,
  link: PropTypes.string,
  onTabSelect: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
  icon: PropTypes.node.isRequired,
  selected: PropTypes.bool.isRequired
}

NavLink.defaultProps = {
  externalLink: '',
  link: '/'
}

export default withRouter(NavLink)
