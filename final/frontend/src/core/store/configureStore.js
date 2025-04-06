import { applyMiddleware, createStore } from 'redux'
import createSagaMiddleware             from 'redux-saga'
import { createLogger }                 from 'redux-logger'
import rootSaga                         from '../sagas/sagas-root'
import rootReducer                      from '../reducers'

const sagaMiddleware = createSagaMiddleware()
let store

export function configureStore(initialState) {
  const logger = createLogger({
    collapsed: true,
    predicate: () =>
      process.env.NODE_ENV === 'development'
  })

  const middleware = applyMiddleware(sagaMiddleware, logger)
  store = middleware(createStore)(rootReducer, initialState)

  sagaMiddleware.run(rootSaga)

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default // eslint-disable-line global-require
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}

export function getStore() {
  return store
}
