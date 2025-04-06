import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { configureStore } from 'core/store/configureStore'
import App from 'containers/App'

async function appInit() {
  const store = configureStore()

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  )
}

appInit()
