import { useMemo } from 'react'
import { getOrderById } from '../../services/orderStorage'
import { formatMoney } from '../../services/shipping'
import { useStandaloneBottomAction } from './StandaloneBottomActionContext'
import './checkout.css'

export default function OrderDetailPage({ orderId }: { orderId?: string }) {
  const order = useMemo(() => orderId ? getOrderById(orderId) : null, [orderId])
  const bottomAction = useMemo(() => <a className="standalone-bottom-action-link" href="#/orders">Back to My Orders</a>, [])
  useStandaloneBottomAction(bottomAction)

  if (!order) return (
    <section className="standalone-state">
      <h2>Order not found</h2>
      <p>This order is not available in the current browser storage.</p>
      <a className="standalone-outline-action" href="#/orders">View My Orders</a>
    </section>
  )

  const address = order.shipping_address
  return <section className="order-detail-page">
    <div className="order-detail-summary">
      <span className="storefront-kicker">ORDER REFERENCE</span>
      <h2>{order.order_number}</h2>
      <p>Placed {new Date(order.created_at).toLocaleString('en-MY')}</p>
      <span className="order-status">{order.order_status}</span>
    </div>
    <section className="order-detail-section">
      <h3>Contact Information</h3>
      <p>{order.customer_name}<br />{order.phone}{order.email ? <><br />{order.email}</> : null}</p>
    </section>
    <section className="order-detail-section">
      <h3>Shipping Address</h3>
      <p>{address.address}<br />{address.city}, {address.state} {address.postcode}<br />{address.country}</p>
      {address.notes && <p className="checkout-muted">Note: {address.notes}</p>}
    </section>
    <section className="order-detail-section">
      <h3>Items</h3>
      {order.items.map((item) => <div className="checkout-item" key={item.id}>
        <div className="checkout-item-image">{item.image_link ? <img src={item.image_link} alt="" /> : <span>◎</span>}</div>
        <div className="checkout-item-copy"><strong>{item.title}</strong><span>{[item.color, item.size].filter(Boolean).join(' · ') || 'Standard variant'} · Qty {item.quantity}</span><b>{formatMoney((item.sale_price ?? item.price) * item.quantity)}</b></div>
      </div>)}
    </section>
    <section className="order-detail-section">
      <h3>Payment & Delivery</h3>
      <div className="checkout-total-row"><span>Payment status</span><strong>{order.payment_status}</strong></div>
      <div className="checkout-total-row"><span>Shipping status</span><strong>{order.shipping_status}</strong></div>
      <p className="checkout-muted">No courier, tracking number, or payment provider is connected. The statuses shown here are local order records and do not represent live fulfilment updates.</p><ol className="order-timeline"><li className="is-current"><strong>Order saved</strong><span>{new Date(order.created_at).toLocaleString('en-MY')}</span></li><li><strong>Payment confirmation</strong><span>Pending manual arrangement</span></li><li><strong>Shipment</strong><span>Not yet arranged</span></li></ol>
    </section>
    <section className="order-detail-section checkout-summary">
      <div className="checkout-total-row"><span>Subtotal</span><strong>{formatMoney(order.subtotal)}</strong></div>
      <div className="checkout-total-row"><span>Shipping Fee</span><strong>{formatMoney(order.shipping_fee)}</strong></div>
      <div className="checkout-grand-total"><strong>Total</strong><strong>{formatMoney(order.total)}</strong></div>
    </section>
  </section>
}
