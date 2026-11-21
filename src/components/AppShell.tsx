import type { ReactNode } from 'react'
import BottomNav from './BottomNav'
import Header from './Header'
import Main from './Main'

type AppShellProps = {
  children: ReactNode
  activePage: 'home' | 'products' | 'profile'
}

export default function AppShell({ children, activePage }: AppShellProps) {
  return (
    <div className="app-shell">
      <Header />
      <Main>{children}</Main>
      <BottomNav activePage={activePage} />
    </div>
  )
}
