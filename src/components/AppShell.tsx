import type { ReactNode } from 'react'
import BottomNav from './BottomNav'
import Header from './Header'
import Main from './Main'

type AppShellProps = {
  children: ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell">
      <Header />
      <Main>{children}</Main>
      <BottomNav />
    </div>
  )
}
