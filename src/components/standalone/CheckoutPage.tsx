import { useCart } from '../../context/CartContext'
import { useProducts } from '../../context/ProductsContext'

export default function CheckoutPage() {
  const { items, hasBlockingItems } = useCart()
  const { isLoading, error } = useProducts()
  const blocked = isLoading || Boolean(error) || items.length === 0 || hasBlockingItems
  if (blocked) return <section className="standalone-state checkout-empty">
    <span className="standalone-state-icon">!</span><h2>Checkout unavailable</h2>
    <p>Verify product availability, current prices, and stock in your cart before continuing.</p>
    <a className="standalone-outline-action" href="#/cart">Return to cart</a>
  </section>
  return <section className="standalone-state checkout-empty"><h2>Ready to checkout?</h2>
    <p>Your verified cart is ready. Delivery and payment details will be collected here.</p>
    <a className="standalone-outline-action" href="#/cart">Review cart</a>
  </section>
}
