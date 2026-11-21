import { useMemo } from 'react'
import { readOrders } from '../../services/orderStorage'
import { formatMoney } from '../../services/shipping'
import { useStandaloneBottomAction } from './StandaloneBottomActionContext'
import './checkout.css'

export default function OrdersPage() {
  const orders = useMemo(() => readOrders(), [])
  const bottomAction = useMemo(() => <a className="standalone-bottom-action-link" href="#/products">Explore Products</a>, [])
  useStandaloneBottomAction(bottomAction)

  if (orders.length === 0) return (
    <section className="standalone-state">
      <span className="standalone-state-icon" aria-hidden="true">▤</span>
      <h2>No orders yet</h2>
      <p>Your purchases and their latest statuses will be listed here.</p>
      <a className="standalone-outline-action" href="#/products">Explore Products</a>
    </section>
  )

  return <section className="orders-page">
    <div className="orders-heading"><h2>Order History</h2><span>{orders.length} order(s)</span></div>
    {orders.map((order) => <a className="order-list-card" href={`#/order/${encodeURIComponent(order.id)}`} key={order.id}>
      <div className="order-list-top"><span>{order.order_number}</span><span className="order-status">{order.order_status}</span></div>
      <strong>{order.items.length} item(s)</strong>
      <span className="order-list-date">{new Date(order.created_at).toLocaleString('en-MY')}</span>
      <div className="order-list-bottom"><span>Payment pending</span><strong>{formatMoney(order.total)}</strong></div>
    </a>)}
  </section>
}
