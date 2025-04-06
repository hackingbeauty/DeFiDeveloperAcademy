import React from 'react'
import { getNetworkNameFromId } from 'core/libs/lib-rpc-helpers'
import { styles } from './styles.scss'

const ChainId = (props) => {
  const { id } = props

  return (
    <div className={styles}>
      <div className="container">
        <h2>Current chain: {getNetworkNameFromId(id)}</h2>
      </div>
    </div>
  )
}

export default ChainId
