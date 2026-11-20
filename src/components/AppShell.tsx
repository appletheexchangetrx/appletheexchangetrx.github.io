import type { ReactNode } from 'react'

type AppShellProps = {
  children: ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <span className="app-eyebrow">THE EXCHANGE TRX · KUALA LUMPUR</span>
      </header>
      <main className="app-main">{children}</main>
    </div>
  )
}
