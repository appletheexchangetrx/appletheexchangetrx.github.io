import type { ReactNode } from 'react'
import BottomNav from './BottomNav'
import Header from './Header'
import Main from './Main'
import Footer from './layout/Footer'

type AppShellProps = {
  children: ReactNode
  activePage: 'home' | 'products' | 'profile' | 'wishlist'
}

export default function AppShell({ children, activePage }: AppShellProps) {
  return (
    <div className="app-shell">
      <Header />
      <Main>{children}</Main>
      <Footer />
      <BottomNav activePage={activePage} />
    </div>
  )
}
