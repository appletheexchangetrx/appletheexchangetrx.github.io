export default function OrderDetailPage({ orderId }: { orderId?: string }) {
  if (!orderId) {
    return (
      <section className="standalone-state">
        <h2>Order not found</h2>
        <p>Choose an order from your order history to view its details.</p>
        <a className="standalone-outline-action" href="#/orders">View my orders</a>
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
      <a className="standalone-text-action" href="#/orders">Back to my orders</a>
    </section>
  )
}
