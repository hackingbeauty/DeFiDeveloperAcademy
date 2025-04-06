import { all } from 'redux-saga/effects'
import { watchProviderActions } from './sagas-provider'
import { watchTransactionActions } from './sagas-transaction'

export default function* rootSaga() {
  yield all([ 
    watchProviderActions(),
    watchTransactionActions()
  ])
}
