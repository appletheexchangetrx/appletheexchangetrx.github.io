import { useMemo, useState, type ReactNode } from 'react'
import BottomAction from './BottomAction'
import { StandaloneBottomActionContext } from './StandaloneBottomActionContext'
import StandaloneHeader from './StandaloneHeader'
import StandaloneMain from './StandaloneMain'

type StandaloneLayoutProps = {
  title: string
  children: ReactNode
  onBack: () => void
}

export default function StandaloneLayout({ title, children, onBack }: StandaloneLayoutProps) {
  const [bottomAction, setBottomAction] = useState<ReactNode>(null)
  const actionContext = useMemo(() => ({ setBottomAction }), [setBottomAction])

  return (
    <StandaloneBottomActionContext.Provider value={actionContext}>
      <div className="standalone-layout">
        <StandaloneHeader title={title} onBack={onBack} />
        <StandaloneMain>{children}</StandaloneMain>
        {bottomAction != null && <BottomAction>{bottomAction}</BottomAction>}
      </div>
    </StandaloneBottomActionContext.Provider>
  )
}
