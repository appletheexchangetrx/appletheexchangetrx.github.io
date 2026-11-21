import { createContext, useContext, useState, type ReactNode } from 'react'
import BottomNav from './BottomNav'
import Header from './Header'
import Main from './Main'

type StorefrontCartContextValue = {
  addToBag: () => void
}

const StorefrontCartContext = createContext<StorefrontCartContextValue | null>(null)

export function useStorefrontCart() {
  const context = useContext(StorefrontCartContext)
  if (!context) throw new Error('useStorefrontCart must be used inside AppShell')
  return context
}

type AppShellProps = {
  children: ReactNode
  activePage: 'home' | 'products' | 'profile'
}

export default function AppShell({ children, activePage }: AppShellProps) {
  const [bagCount, setBagCount] = useState(0)
  const addToBag = () => setBagCount((count) => count + 1)

  return (
    <StorefrontCartContext.Provider value={{ addToBag }}>
      <div className="app-shell">
        <Header bagCount={bagCount} />
        <Main>{children}</Main>
        <BottomNav activePage={activePage} />
      </div>
    </StorefrontCartContext.Provider>
  )
}
