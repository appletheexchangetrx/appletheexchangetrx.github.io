import { useEffect, useMemo, useState } from 'react'
import { useCart } from '../../context/CartContext'
import { useProducts } from '../../context/ProductsContext'
import type { CartItem } from '../../types/cart'
import { useStandaloneBottomAction } from './StandaloneBottomActionContext'
import { formatMoney, SHIPPING_FEE } from '../../services/shipping'

function money(value: number | null) {
  if (value == null || !Number.isFinite(value)) return 'Price unavailable'
  return new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(value)
}
function itemKey(item: CartItem) { return item.item_group_id + ':' + item.variant_id }

export default function CartPage() {
  const { items, updateQuantity, removeItem, getSubtotal, hasBlockingItems, syncCart } = useCart()
  const { isLoading, error, refresh } = useProducts()
  const [verifying, setVerifying] = useState(false)
  const [verifiedThisVisit, setVerifiedThisVisit] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [removeTarget, setRemoveTarget] = useState<CartItem | null>(null)

  const verify = async () => {
    setVerifying(true)
    setNotice(null)
    try {
      const latest = await refresh()
      syncCart(latest)
      setVerifiedThisVisit(true)
    } catch {
      setVerifiedThisVisit(false)
      setNotice('Prices and stock could not be verified. Your saved cart is shown below.')
    } finally {
      setVerifying(false)
    }
  }
  useEffect(() => { if (!isLoading) void verify() }, [isLoading])

  const blocked = !verifiedThisVisit || verifying || hasBlockingItems
  const subtotal = getSubtotal()
  const total = subtotal + SHIPPING_FEE
  const bottomAction = useMemo(() => items.length === 0
    ? <a className="standalone-bottom-action-link" href="#/products">Continue shopping</a>
    : <div className="cart-bottom-content">
        <div><span>Total</span><strong>{money(total)}</strong></div>
        <button type="button" disabled={blocked} onClick={() => { window.location.hash = '#/checkout' }}>Checkout</button>
      </div>, [items.length, subtotal, blocked])
  useStandaloneBottomAction(bottomAction)

  if (items.length === 0) return <section className="cart-page cart-empty">
    <div className="standalone-state"><span className="standalone-state-icon">▢</span><h2>Your cart is empty</h2>
      <p>Discover products and add your favorites to your cart.</p></div>
  </section>

  return <section className="cart-page">
    {(notice || error || (!verifiedThisVisit && !verifying)) && <div className="cart-warning" role="alert">
      <strong>Unable to verify current prices and stock</strong>
      <p>{notice || 'Your saved cart is displayed. Checkout is unavailable until product data can be verified.'}</p>
    </div>}
    {verifying && <p className="cart-verifying" role="status">Verifying prices and stock…</p>}
    <div className="cart-content"><div className="cart-items">{items.map((item) => {
      const price = item.sale_price ?? item.price
      const unavailable = item.status === 'unavailable'
      return <article className="cart-item" key={itemKey(item)}>
        <div className="cart-item-image">{item.image_link ? <img src={item.image_link} alt={item.title}/> : <span>◎</span>}</div>
        <div className="cart-item-details">
          <h2>{item.title}</h2>
          <p className="cart-item-variant">{[item.color, item.size].filter(Boolean).join(' · ')}</p>
          <strong className="cart-item-price">{money(price)}</strong>
          {item.price_changed && <div className="cart-price-notice"><strong>Price updated</strong><span>Previous: {money(item.previous_price)} · Now: {money(price)}</span></div>}
          {unavailable && <p className="cart-item-status is-error">Product or variant unavailable. Remove this item to continue.</p>}
          {item.status === 'stock_unverified' && <p className="cart-item-status">Stock unverified. Checkout is blocked until stock is available for verification.</p>}
          {item.status === 'out_of_stock' && <p className="cart-item-status is-error">Out of stock.</p>}
          {item.status === 'stock_exceeded' && <p className="cart-item-status is-error">Only {item.quantity_to_sell_on_facebook} unit(s) available. Adjust quantity to continue.</p>}
          <div className="cart-item-controls">
            <div className="cart-quantity">
              <button type="button" aria-label="Decrease quantity" onClick={() => item.quantity === 1 ? setRemoveTarget(item) : updateQuantity(item.item_group_id, item.variant_id, item.quantity - 1)}>−</button>
              <span>{item.quantity}</span>
              <button type="button" aria-label="Increase quantity" disabled={item.quantity_to_sell_on_facebook == null || item.quantity >= item.quantity_to_sell_on_facebook} onClick={() => updateQuantity(item.item_group_id, item.variant_id, item.quantity + 1)}>+</button>
            </div>
            <button type="button" className="cart-remove" onClick={() => setRemoveTarget(item)}>Remove</button>
          </div>
        </div>
      </article>
    })}</div></div>
    <section className="cart-summary"><h2>Order Summary</h2><div><span>Subtotal</span><strong>{money(subtotal)}</strong></div><div><span>Shipping</span><strong>{money(SHIPPING_FEE)}</strong></div><div className="cart-total"><strong>Total</strong><strong>{money(total)}</strong></div></section>
    {blocked && <p className="cart-checkout-hint">Checkout is disabled until every item has verified availability and stock.</p>}
    {removeTarget && <div className="cart-dialog-backdrop" role="presentation"><div className="cart-dialog" role="dialog" aria-modal="true" aria-labelledby="cart-remove-title">
      <h2 id="cart-remove-title">Remove item?</h2><p>Remove {removeTarget.title} from your cart?</p>
      <div><button type="button" onClick={() => setRemoveTarget(null)}>Cancel</button><button type="button" onClick={() => { removeItem(removeTarget.item_group_id, removeTarget.variant_id); setRemoveTarget(null) }}>Remove</button></div>
    </div></div>}
  </section>
}
