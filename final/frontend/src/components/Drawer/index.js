import React from 'react'
import PropTypes from 'prop-types'
import { Drawer as MuiDrawer } from '@material-ui/core'
import { styles } from './styles.scss'

const Drawer = (props) => {
  const { children, classes, ...other } = props
  // Fix to ensure drawer is visible on mount
  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  console.log('---- classes: ----', classes);

  return (
    <MuiDrawer
      sx={{
        '& .MuiDrawer-root': {
            position: 'absolute',
            background: 'red'
        },
        '& .MuiPaper-root': {
            position: 'absolute',
            background: 'red'

        },
      }}
      // classes={{
      //   paper: 'drawer-paper'
      // }}
      {...styles}
      {...other}
    >
      <div className={styles}>
        <div className="drawer-container">
          {children}
        </div>
      </div>
    </MuiDrawer>
  )
}

Drawer.propTypes = {
  classes: PropTypes.shape({}),
  children: PropTypes.node.isRequired
}

Drawer.defaultProps = {
  classes: {}
}

export default Drawer