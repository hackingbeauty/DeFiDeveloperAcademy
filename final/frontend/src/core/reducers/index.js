import { combineReducers } from 'redux'
import providerReducer from 'core/reducers/reducer-provider'
import transactionReducer from 'core/reducers/reducer-transaction'
import uiReducer from 'core/reducers/reducer-ui'

const rootReducer = combineReducers({
  provider: providerReducer,
  transaction: transactionReducer,
  ui: uiReducer
})

export default rootReducer
