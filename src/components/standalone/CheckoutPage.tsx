export default function CheckoutPage() {
  return (
    <section className="standalone-state checkout-empty">
      <span className="standalone-state-icon" aria-hidden="true">▢</span>
      <h2>Ready to checkout?</h2>
      <p>Your cart items will appear here before you confirm delivery and payment.</p>
      <a className="standalone-outline-action" href="#/cart">Review cart</a>
    </section>
  )
}
