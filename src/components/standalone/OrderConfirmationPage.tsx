import { useMemo } from 'react'
import { getOrderById } from '../../services/orderStorage'
import { formatMoney } from '../../services/shipping'
import { useStandaloneBottomAction } from './StandaloneBottomActionContext'
import './checkout.css'

export default function OrderConfirmationPage({ orderId }: { orderId?: string }) {
  const order = useMemo(() => orderId ? getOrderById(orderId) : null, [orderId])
  const bottomAction = useMemo(() => <a className="standalone-bottom-action-link" href={order ? `#/order/${encodeURIComponent(order.id)}` : '#/orders'}>View Order Details</a>, [order])
  useStandaloneBottomAction(bottomAction)

  if (!order) return <section className="standalone-state"><h2>Order not found</h2><p>The order could not be found in this browser.</p><a className="standalone-outline-action" href="#/orders">My Orders</a></section>

  return <section className="order-confirmation-page">
    <span className="order-confirmation-check" aria-hidden="true">✓</span>
    <span className="storefront-kicker">ORDER PLACED</span>
    <h2>Thank you for your order</h2>
    <p>Your order has been saved successfully in this browser.</p>
    <div className="order-confirmation-reference"><span>Order Number</span><strong>{order.order_number}</strong><span>Total</span><strong>{formatMoney(order.total)}</strong></div>
    <p className="checkout-muted">Payment status: pending. Payment arrangements have not been configured yet.</p>
  </section>
}
