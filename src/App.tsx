import { useEffect, useState } from 'react'
import AppShell from './components/AppShell'
import SplashScreen from './components/SplashScreen'
import StandalonePages from './components/standalone/StandalonePages'
import HomePage from './components/pages/HomePage'
import ProductsPage from './components/pages/ProductsPage'
import ProfilePage from './components/pages/ProfilePage'
import WishlistPage from './components/pages/WishlistPage'
import { ProductsProvider } from './context/ProductsContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'

export type RouteState = { name: string; id?: string }

const appRoutes = new Set(['home', 'products', 'profile', 'wishlist'])
const standaloneRoutes = new Set([
  'cart', 'notification', 'livechat', 'product', 'checkout',
  'orders', 'order', 'order-confirmation',
])

export function parseRoute(hash: string): RouteState {
  const path = hash.replace(/^#\/?/, '').split('?')[0]
  if (!path) return { name: 'home' }

  const segments = path.split('/').filter(Boolean)
  if (segments.length > 2) return { name: 'not-found' }

  let name: string
  let id: string | undefined
  try {
    name = decodeURIComponent(segments[0] ?? 'home')
    id = segments[1] ? decodeURIComponent(segments[1]) : undefined
  } catch {
    return { name: 'not-found' }
  }

  if (appRoutes.has(name)) return id ? { name: 'not-found' } : { name }
  if (!standaloneRoutes.has(name)) return { name: 'not-found' }
  if (['product', 'order', 'order-confirmation'].includes(name) && !id) {
    return { name: 'not-found' }
  }
  if (!['product', 'order', 'order-confirmation'].includes(name) && id) {
    return { name: 'not-found' }
  }
  return { name, id }
}

function AppContent() {
  const [isSplashVisible, setIsSplashVisible] = useState(true)
  const [route, setRoute] = useState<RouteState>(() => parseRoute(window.location.hash))
  const [hasInternalHistory, setHasInternalHistory] = useState(false)

  useEffect(() => {
    const splashTimer = window.setTimeout(() => setIsSplashVisible(false), 500)
    const handleNavigation = () => {
      setRoute(parseRoute(window.location.hash))
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
    if (hasInternalHistory) window.history.back()
    else window.location.hash = '#/home'
  }

  const appPages = {
    home: <HomePage />,
    products: <ProductsPage />,
    profile: <ProfilePage />,
    wishlist: <WishlistPage />,
  }

  if (route.name in appPages) {
    const activePage = route.name as keyof typeof appPages
    return <AppShell activePage={activePage}>{appPages[activePage]}</AppShell>
  }

  return <StandalonePages route={route.name} routeId={route.id} onBack={handleBack} />
}

export default function App() {
  return (
    <ProductsProvider>
      <CartProvider>
        <WishlistProvider>
          <AppContent />
        </WishlistProvider>
      </CartProvider>
    </ProductsProvider>
  )
}
