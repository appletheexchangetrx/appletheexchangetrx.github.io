import type { ReactNode } from 'react'

type OverlayProps = {
  children?: ReactNode
  open?: boolean
  label?: string
}

export default function Overlay({ children, open = false, label = 'Application overlay' }: OverlayProps) {
  if (!open || !children) return null

  return (
    <div className="overlay-root" role="presentation">
      <div className="overlay-backdrop" />
      <section className="overlay-panel" role="dialog" aria-modal="true" aria-label={label}>
        {children}
      </section>
    </div>
  )
}
