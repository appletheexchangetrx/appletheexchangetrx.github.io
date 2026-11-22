import { useEffect } from 'react'

type Props = { message: string | null; onDismiss: () => void }

export default function Toast({ message, onDismiss }: Props) {
  useEffect(() => {
    if (!message) return
    const id = window.setTimeout(onDismiss, 3200)
    return () => window.clearTimeout(id)
  }, [message, onDismiss])

  return message ? (
    <div className="ui-toast" role="status" aria-live="polite" aria-atomic="true">
      <span>{message}</span>
      <button type="button" onClick={onDismiss} aria-label="Dismiss notification">×</button>
    </div>
  ) : null
}
