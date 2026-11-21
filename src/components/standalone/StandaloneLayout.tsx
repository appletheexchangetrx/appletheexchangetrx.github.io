import type { ReactNode } from 'react'
import BottomAction from './BottomAction'
import StandaloneHeader from './StandaloneHeader'
import StandaloneMain from './StandaloneMain'

type StandaloneLayoutProps = {
  title: string
  children: ReactNode
  bottomAction?: ReactNode
}

export default function StandaloneLayout({ title, children, bottomAction }: StandaloneLayoutProps) {
  return (
    <div className="standalone-layout">
      <StandaloneHeader title={title} />
      <StandaloneMain>{children}</StandaloneMain>
      {bottomAction != null && <BottomAction>{bottomAction}</BottomAction>}
    </div>
  )
}
