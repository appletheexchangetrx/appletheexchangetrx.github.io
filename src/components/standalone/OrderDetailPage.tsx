import { useMemo } from 'react'
import { useStandaloneBottomAction } from './StandaloneBottomActionContext'

export default function OrderDetailPage({ orderId }: { orderId?: string }) {
  const bottomAction = useMemo(() => <a className="standalone-bottom-action-link" href="#/orders">Back to My Orders</a>, [])
  useStandaloneBottomAction(bottomAction)

  if (!orderId) {
    return (
      <section className="standalone-state">
        <h2>Order not found</h2>
        <p>Choose an order from your order history to view its details.</p>
      </section>
    )
  }

  return (
    <section className="order-detail-page">
      <div className="order-detail-summary">
        <span className="storefront-kicker">ORDER REFERENCE</span>
        <h2>{orderId}</h2>
        <p>Order information will appear here when order data is connected.</p>
      </div>
    </section>
  )
}
