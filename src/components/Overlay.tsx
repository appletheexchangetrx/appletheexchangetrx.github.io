import { useEffect, useRef, type ReactNode } from 'react'

type OverlayProps = {
  children?: ReactNode
  open?: boolean
  label?: string
  onClose?: () => void
}

export default function Overlay({
  children, open = false, label = 'Application overlay', onClose,
}: OverlayProps) {
  const panelRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!open) return
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && onClose) {
        event.preventDefault()
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      previousFocus?.focus()
    }
  }, [open, onClose])

  if (!open || !children) return null

  return (
    <div className="overlay-root" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose?.()
    }}>
      <div className="overlay-backdrop" />
      <section ref={panelRef} className="overlay-panel" role="dialog" aria-modal="true"
        aria-label={label} tabIndex={-1}>
        {children}
      </section>
    </div>
  )
}
