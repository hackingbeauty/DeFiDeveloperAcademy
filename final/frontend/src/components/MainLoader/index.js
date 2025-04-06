import React from 'react'
import ProgressIndicator from 'components/ProgressIndicator'
import { styles } from './styles.scss'

const MainLoader = (props) => {
  const theProps = props

  return (
    <div className={styles}>
      <ProgressIndicator
        {...theProps}
      />
    </div>
  )
}

export default MainLoader
