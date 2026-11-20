import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './style.css'

// Disable page zoom gestures and browser zoom shortcuts while this app is active.
const preventPageZoom = (event: Event) => event.preventDefault()

document.addEventListener('gesturestart', preventPageZoom, { passive: false })
document.addEventListener('gesturechange', preventPageZoom, { passive: false })
document.addEventListener('gestureend', preventPageZoom, { passive: false })

document.addEventListener(
  'wheel',
  (event) => {
    if (event.ctrlKey || event.metaKey) event.preventDefault()
  },
  { passive: false },
)

document.addEventListener('keydown', (event) => {
  if (!(event.ctrlKey || event.metaKey)) return

  const key = event.key
  if (
    key === '+' ||
    key === '-' ||
    key === '=' ||
    key === '0' ||
    key === '_' ||
    event.code === 'NumpadAdd' ||
    event.code === 'NumpadSubtract'
  ) {
    event.preventDefault()
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <KonstaApp theme="ios">
      <App />
    </KonstaApp>
  </React.StrictMode>,
)
