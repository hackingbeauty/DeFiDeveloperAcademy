import React from 'react'
import { Snackbar } from '@material-ui/core'
import { LinearProgress } from '@material-ui/core'
import { styles } from './styles.scss'

export default function TransactionLoadingIndicator(props) {
  const { isLoading, transactionProcessingMsg } = props

  return (
    <div className={styles}>
      <Snackbar
        open={isLoading}
        autoHideDuration={12000}
        anchorOrigin={ {vertical: 'bottom', horizontal: 'center'} }
      >
        <div className="container">
          <div id="transaction-loading-indicator">
            <span id="transaction-processing-msg">
              {isLoading && "Transaction is processing..."}
              <br />
              {transactionProcessingMsg}
            </span>
            <br/>
            {isLoading && <LinearProgress />}
          </div>
        </div>
      </Snackbar>
    </div>
  )
}

