import { useEffect, useMemo, useState } from 'react'
import { useCart } from '../../context/CartContext'
import { useProducts } from '../../context/ProductsContext'
import { useStandaloneBottomAction } from './StandaloneBottomActionContext'

export default function CheckoutPage() {
  const { items, hasBlockingItems, syncCart } = useCart()
  const { refresh } = useProducts()
  const [validating, setValidating] = useState(true)
  const [validationError, setValidationError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    async function validateBeforeCheckout() {
      setValidating(true)
      setValidationError(null)
      try {
        const latestProducts = await refresh()
        if (active) syncCart(latestProducts)
      } catch {
        if (active) setValidationError('Product prices and stock could not be verified. Return to Cart and retry.')
      } finally {
        if (active) setValidating(false)
      }
    }
    void validateBeforeCheckout()
    return () => { active = false }
  }, [refresh, syncCart])

  const bottomAction = useMemo(() => <a className="standalone-bottom-action-link" href="#/cart">Return to Cart</a>, [])
  useStandaloneBottomAction(bottomAction)

  const blocked = validating || Boolean(validationError) || items.length === 0 || hasBlockingItems
  if (blocked) return <section className="standalone-state checkout-empty">
    <span className="standalone-state-icon">!</span><h2>{validating ? 'Verifying your cart…' : 'Checkout unavailable'}</h2>
    <p>{validationError || 'Checkout requires verified prices, available products, and sufficient stock for every cart item.'}</p>
  </section>
  return <section className="standalone-state checkout-empty">
    <h2>Ready to checkout?</h2>
    <p>Your cart has passed the latest product and stock validation. Delivery and payment details will be collected here.</p>
  </section>
}
