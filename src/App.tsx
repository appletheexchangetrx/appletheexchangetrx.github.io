import { useEffect, useState } from 'react'
import AppShell from './components/AppShell'
import Overlay from './components/Overlay'
import SplashScreen from './components/SplashScreen'
import StandalonePages from './components/StandalonePages'

function App() {
  const [isSplashVisible, setIsSplashVisible] = useState(true)
  const pathname = window.location.pathname
  const isStandalonePage = pathname !== '/' && pathname !== '/index.html'

  useEffect(() => {
    const splashTimer = window.setTimeout(() => {
      setIsSplashVisible(false)
    }, 500)

    return () => window.clearTimeout(splashTimer)
  }, [])

  if (isSplashVisible) return <SplashScreen />

  if (isStandalonePage) {
    return <StandalonePages pathname={pathname} />
  }

  return (
    <>
      <AppShell>
        <section className="welcome-content">
          <h1>Apple The Exchange TRX</h1>
          <p className="description">
            Welcome. Your React, Vite, and TypeScript website is ready.
          </p>
          <span className="status">GitHub Pages starter is running</span>
        </section>
      </AppShell>
      <Overlay />
    </>
  )
}

export default App
