import { useEffect, useState } from 'react'
import AppShell from './components/AppShell'
import Overlay from './components/Overlay'
import SplashScreen from './components/SplashScreen'
import StandalonePages from './components/standalone/StandalonePages'
import HomePage from './components/pages/HomePage'
import ProductsPage from './components/pages/ProductsPage'
import ProfilePage from './components/pages/ProfilePage'
import { ProductsProvider } from './context/ProductsContext'

type AppRoute = 'home' | 'products' | 'profile' | 'cart' | 'notification' | 'livechat'

function getCurrentRoute(): AppRoute {
  const route = window.location.hash.replace(/^#\/?/, '').split('?')[0]
  const validRoutes: AppRoute[] = ['home', 'products', 'profile', 'cart', 'notification', 'livechat']
  return validRoutes.includes(route as AppRoute) ? (route as AppRoute) : 'home'
}

function App() {
  const [isSplashVisible, setIsSplashVisible] = useState(true)
  const [route, setRoute] = useState<AppRoute>(getCurrentRoute)
  const [hasInternalHistory, setHasInternalHistory] = useState(false)

  useEffect(() => {
    const splashTimer = window.setTimeout(() => setIsSplashVisible(false), 500)
    const handleNavigation = () => {
      setRoute(getCurrentRoute())
      setHasInternalHistory(true)
    }

    window.addEventListener('hashchange', handleNavigation)
    return () => {
      window.clearTimeout(splashTimer)
      window.removeEventListener('hashchange', handleNavigation)
    }
  }, [])

  if (isSplashVisible) return <SplashScreen />

  const handleBack = () => {
    if (hasInternalHistory) {
      window.history.back()
    } else {
      window.location.hash = '#/home'
    }
  }

  const page = {
    home: <HomePage />,
    products: <ProductsPage />,
    profile: <ProfilePage />,
  }[route]

  return (
    <ProductsProvider>
      {route === 'cart' || route === 'notification' || route === 'livechat' ? (
        <StandalonePages route={route} onBack={handleBack} />
      ) : (
        <>
          <AppShell activePage={route}>{page}</AppShell>
          <Overlay />
        </>
      )}
    </ProductsProvider>
  )
}

export default App
