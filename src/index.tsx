import * as React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

const div = window.document.createElement('main')
const search = new URLSearchParams(window.location.search)
window.document.body.appendChild(div)
window.document.documentElement.style.setProperty('--size-scale-factor', search.get('scaleFactor'))

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  div
)
