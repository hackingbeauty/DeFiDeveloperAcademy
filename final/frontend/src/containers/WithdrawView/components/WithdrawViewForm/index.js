import React, { useState } from 'react'
import Button from 'components/Button'
import { styles } from './styles.scss'

function WithdrawViewForm(props) {
    return(
      <div className={styles}>
        <form>
          <div className="section">
            <div id="pools-form-container" className="box">
              <h3>Withdraw Liquidity</h3>
              <form id="pools-form">
                <div className="section">
                  <Button
                    color="primary"
                    onClick={props.onClick}
                    variant="text"
                  >
                    Withdraw
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </form>
      </div>
    )
}
export default WithdrawViewForm
