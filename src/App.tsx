import { useEffect, useState } from 'react'
import AppShell from './components/AppShell'
import Overlay from './components/Overlay'
import SplashScreen from './components/SplashScreen'
import StandalonePages from './components/standalone/StandalonePages'
import HomePage from './components/pages/HomePage'
import ProductsPage from './components/pages/ProductsPage'
import ProfilePage from './components/pages/ProfilePage'
import { ProductsProvider } from './context/ProductsContext'
import { CartProvider } from './context/CartContext'

type RouteState = { name: string; id?: string }
function getCurrentRoute(): RouteState {
  const segments = window.location.hash.replace(/^#\/?/, '').split('?')[0].split('/').filter(Boolean)
  const [name = 'home', id] = segments
  const supported = ['home', 'products', 'profile', 'cart', 'notification', 'livechat', 'product', 'checkout', 'orders', 'order']
  return supported.includes(name) ? { name, id: id ? decodeURIComponent(id) : undefined } : { name: 'home' }
}
function AppContent() {
  const [isSplashVisible, setIsSplashVisible] = useState(true)
  const [route, setRoute] = useState<RouteState>(getCurrentRoute)
  const [hasInternalHistory, setHasInternalHistory] = useState(false)
  useEffect(() => {
    const splashTimer = window.setTimeout(() => setIsSplashVisible(false), 500)
    const handleNavigation = () => { setRoute(getCurrentRoute()); setHasInternalHistory(true) }
    window.addEventListener('hashchange', handleNavigation)
    return () => { window.clearTimeout(splashTimer); window.removeEventListener('hashchange', handleNavigation) }
  }, [])
  if (isSplashVisible) return <SplashScreen />
  const handleBack = () => { if (hasInternalHistory) window.history.back(); else window.location.hash = '#/home' }
  const appPages = { home: <HomePage />, products: <ProductsPage />, profile: <ProfilePage /> }
  const isAppPage = route.name === 'home' || route.name === 'products' || route.name === 'profile'
  if (isAppPage) return <><AppShell activePage={route.name as 'home' | 'products' | 'profile'}>{appPages[route.name as keyof typeof appPages]}</AppShell><Overlay /></>
  return <StandalonePages route={route.name} routeId={route.id} onBack={handleBack} />
}
export default function App() {
  return <ProductsProvider><CartProvider><AppContent /></CartProvider></ProductsProvider>
}
