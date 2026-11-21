import { createContext, useContext, useEffect, type ReactNode } from 'react'

type StandaloneBottomActionContextValue = {
  setBottomAction: (action: ReactNode) => void
}

export const StandaloneBottomActionContext = createContext<StandaloneBottomActionContextValue | null>(null)

export function useStandaloneBottomAction(action: ReactNode) {
  const context = useContext(StandaloneBottomActionContext)
  if (!context) throw new Error('useStandaloneBottomAction must be used inside StandaloneLayout')

  useEffect(() => {
    context.setBottomAction(action)
    return () => context.setBottomAction(null)
  }, [action, context])
}
