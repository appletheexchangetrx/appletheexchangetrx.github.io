import type { ReactNode } from 'react'

type StandaloneMainProps = {
  children: ReactNode
}

export default function StandaloneMain({ children }: StandaloneMainProps) {
  return <main className="standalone-main">{children}</main>
}
