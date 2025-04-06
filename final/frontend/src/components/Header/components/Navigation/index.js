import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { Tabs, SvgIcon } from '@material-ui/core'
import NavLink from '../NavLink'
import { styles } from './styles.scss'

class Navigation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentTab: 0
    }
  }

  static getDerivedStateFromProps(nextProps) {
    const { location, navLinks } = nextProps
    const route = location.pathname.split('/')[1]

    const currentTab = navLinks.findIndex((item) => {
      const itemLink = item.link ? item.link.substring(1) : ''
      if (route === '') { return null }
      return (itemLink === route)
    })

    if (currentTab === -1) {
      return 0
    }

    return { currentTab }
  }

  onChange = (currentTab) => {
    this.setState({ currentTab })
  }

  displayNavLinks = () => {
    const { navLinks } = this.props

    return navLinks.map((linkItem, index) => {
      const {
        externalLink,
        label,
        link,
        icon
      } = linkItem
      const key = `key-${index}`

      return (
        <NavLink
          key={key}
          label={label}
          link={link}
          externalLink={externalLink}
          icon={<SvgIcon className="icon" component={icon} />}
          onTabSelect={this.onChange}
        />
      )
    })
  }

  render() {
    const { toggleMobileNav, rightBtn } = this.props
    const { currentTab } = this.state

    return (
      <div className={styles}>
        <div id="logo">Minimally Viable Dex</div>
        <nav id="main-nav">
          <Tabs
            aria-label="navigation tabs"
            value={currentTab}
            classes={{
              indicator: 'tab-indicator',
              flexContainer: 'navigation'
            }}
          >
            {this.displayNavLinks()}
          </Tabs>
          <div id="right-button">{rightBtn}</div>
        </nav>
      </div>
    )
  }
}

Navigation.propTypes = {
  navLinks: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  rightBtn: PropTypes.node.isRequired,
}

export default withRouter(Navigation)
