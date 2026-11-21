import { useMemo } from 'react'
import { useStandaloneBottomAction } from './StandaloneBottomActionContext'

export default function OrdersPage() {
  const bottomAction = useMemo(() => <a className="standalone-bottom-action-link" href="#/products">Explore Products</a>, [])
  useStandaloneBottomAction(bottomAction)

  return (
    <section className="standalone-state">
      <span className="standalone-state-icon" aria-hidden="true">▤</span>
      <h2>No orders yet</h2>
      <p>Your purchases and their latest statuses will be listed here.</p>
    </section>
  )
}
