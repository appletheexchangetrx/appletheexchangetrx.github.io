import type { ReactNode } from 'react'

type BottomActionProps = {
  children: ReactNode
}

export default function BottomAction({ children }: BottomActionProps) {
  return <div className="standalone-bottom-action">{children}</div>
}
