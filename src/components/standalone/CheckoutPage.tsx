import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useCart } from '../../context/CartContext'
import { useProducts } from '../../context/ProductsContext'
import { saveOrder } from '../../services/orderStorage'
import { formatMoney, SHIPPING_FEE } from '../../services/shipping'
import type { Order, OrderItem } from '../../types/order'
import { useStandaloneBottomAction } from './StandaloneBottomActionContext'
import './checkout.css'

type CheckoutForm = {
  customerName: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  postcode: string
  country: string
  notes: string
}

const INITIAL_FORM: CheckoutForm = {
  customerName: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  state: '',
  postcode: '',
  country: 'Malaysia',
  notes: '',
}

function createOrderId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `order-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export default function CheckoutPage() {
  const { items, hasBlockingItems, syncCart, clearCart } = useCart()
  const { refresh } = useProducts()
  const [form, setForm] = useState<CheckoutForm>(INITIAL_FORM)
  const [validating, setValidating] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    async function validateBeforeCheckout() {
      setValidating(true)
      setValidationError(null)
      try {
        const latestProducts = await refresh()
        if (active) {
          syncCart(latestProducts)
          const invalidItem = items.find((item) => {
            const product = latestProducts.find((candidate) => candidate.item_group_id === item.item_group_id)
            const variant = product?.variants.find((candidate) => candidate.id === item.variant_id)
            const price = variant?.sale_price ?? variant?.price
            const stock = product?.quantity_to_sell_on_facebook
            return !product || !variant || !Number.isFinite(price) || (price as number) < 0 ||
              stock == null || stock <= 0 || item.quantity > stock
          })
          if (invalidItem) setValidationError('One or more cart items are unavailable, have an invalid price, or exceed current stock. Return to Cart to review them.')
        }
      } catch {
        if (active) setValidationError('Product prices and stock could not be verified. Return to Cart and retry.')
      } finally {
        if (active) setValidating(false)
      }
    }
    void validateBeforeCheckout()
    return () => { active = false }
  }, [refresh, syncCart])

  const subtotal = items.reduce((sum, item) => sum + (item.sale_price ?? item.price ?? 0) * item.quantity, 0)
  const total = subtotal + SHIPPING_FEE
  const blocked = validating || Boolean(validationError) || items.length === 0 || hasBlockingItems

  function updateField(field: keyof CheckoutForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (blocked || submitting) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const requiredValues = [form.customerName, form.phone, form.address, form.city, form.state, form.postcode, form.country]
      if (requiredValues.some((value) => !value.trim())) throw new Error('Complete all required contact and shipping fields.')
      const latestProducts = await refresh()
      const orderItems: OrderItem[] = items.map((item) => {
        const product = latestProducts.find((candidate) => candidate.item_group_id === item.item_group_id)
        const variant = product?.variants.find((candidate) => candidate.id === item.variant_id)
        const stock = product?.quantity_to_sell_on_facebook
        const unitPrice = variant?.sale_price ?? variant?.price
        if (!product || !variant || stock == null || stock <= 0 || item.quantity > stock ||
          !Number.isFinite(unitPrice) || (unitPrice as number) < 0 ||
          (variant.price != null && (!Number.isFinite(variant.price) || variant.price < 0)) ||
          (variant.sale_price != null && (!Number.isFinite(variant.sale_price) || variant.sale_price < 0))) {
          throw new Error('A product price or stock changed. Return to Cart and review your items.')
        }
        return {
          id: `${item.item_group_id}:${item.variant_id}`,
          item_group_id: item.item_group_id,
          variant_id: item.variant_id,
          title: product.title,
          brand: product.brand,
          color: variant.color,
          size: variant.size,
          image_link: variant.image_link,
          price: variant.price ?? (unitPrice as number),
          sale_price: variant.sale_price,
          quantity: item.quantity,
        }
      })
      const orderSubtotal = orderItems.reduce((sum, item) => sum + (item.sale_price ?? item.price) * item.quantity, 0)
      const now = new Date()
      const id = createOrderId()
      const suffix = id.replace(/[^a-zA-Z0-9]/g, '').slice(-8).toUpperCase()
      const order: Order = {
        id,
        order_number: `AET-${now.toISOString().slice(0, 10).replace(/-/g, '')}-${suffix}`,
        customer_name: form.customerName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || null,
        shipping_address: {
          address: form.address.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          postcode: form.postcode.trim(),
          country: form.country.trim(),
          notes: form.notes.trim() || null,
        },
        items: orderItems,
        subtotal: orderSubtotal,
        shipping_fee: SHIPPING_FEE,
        total: orderSubtotal + SHIPPING_FEE,
        payment_method: null,
        payment_status: 'pending',
        order_status: 'pending',
        shipping_status: 'pending',
        created_at: now.toISOString(),
      }
      saveOrder(order)
      clearCart()
      window.location.hash = `#/order-confirmation/${encodeURIComponent(order.id)}`
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Order could not be saved. Your cart has been kept.')
      setSubmitting(false)
    }
  }

  const bottomAction = useMemo(() => items.length === 0
    ? <a className="standalone-bottom-action-link" href="#/products">Explore Products</a>
    : <div className="checkout-bottom-content">
        <div><span>Total</span><strong>{formatMoney(total)}</strong></div>
        <button type="submit" form="checkout-form" disabled={blocked || submitting}>
          {submitting ? 'Placing order…' : 'Place Order'}
        </button>
      </div>, [items.length, total, blocked, submitting])
  useStandaloneBottomAction(bottomAction)

  if (validating) return <section className="standalone-state"><h2>Verifying your cart…</h2><p>Checking current product prices and stock.</p></section>
  if (items.length === 0) return <section className="standalone-state"><span className="standalone-state-icon">▢</span><h2>Your cart is empty</h2><p>Add products to your cart before checkout.</p><a className="standalone-outline-action" href="#/products">Explore Products</a></section>
  if (validationError || hasBlockingItems) return <section className="standalone-state checkout-empty"><span className="standalone-state-icon">!</span><h2>Checkout unavailable</h2><p>{validationError || 'Checkout requires verified prices, available products, and sufficient stock for every cart item.'}</p><a className="standalone-outline-action" href="#/cart">Return to Cart</a></section>

  return <section className="checkout-page">
    <form id="checkout-form" onSubmit={handleSubmit}>
      <section className="checkout-section">
        <h2>Contact Information</h2>
        <label>Full Name<input required autoComplete="name" value={form.customerName} onChange={(event) => updateField('customerName', event.target.value)} /></label>
        <label>Phone Number<input required type="tel" autoComplete="tel" value={form.phone} onChange={(event) => updateField('phone', event.target.value)} /></label>
        <label>Email <span>(Optional)</span><input type="email" autoComplete="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} /></label>
      </section>

      <section className="checkout-section">
        <h2>Shipping Address</h2>
        <label>Address<input required autoComplete="street-address" value={form.address} onChange={(event) => updateField('address', event.target.value)} /></label>
        <div className="checkout-field-grid">
          <label>City<input required autoComplete="address-level2" value={form.city} onChange={(event) => updateField('city', event.target.value)} /></label>
          <label>State<input required autoComplete="address-level1" value={form.state} onChange={(event) => updateField('state', event.target.value)} /></label>
          <label>Postcode<input required autoComplete="postal-code" value={form.postcode} onChange={(event) => updateField('postcode', event.target.value)} /></label>
          <label>Country<input required autoComplete="country-name" value={form.country} onChange={(event) => updateField('country', event.target.value)} /></label>
        </div>
        <label>Delivery Notes <span>(Optional)</span><textarea rows={3} value={form.notes} onChange={(event) => updateField('notes', event.target.value)} /></label>
      </section>

      <section className="checkout-section">
        <h2>Shipping</h2>
        <div className="checkout-shipping-row"><div><strong>Standard delivery</strong><span>Shipping arranged manually</span></div><strong>{formatMoney(SHIPPING_FEE)}</strong></div>
      </section>

      <section className="checkout-section">
        <h2>Payment</h2>
        <p className="checkout-muted">Payment method has not been configured yet. Payment status will remain pending.</p>
      </section>

      <section className="checkout-section checkout-summary">
        <h2>Order Summary</h2>
        {items.map((item) => <div className="checkout-item" key={item.item_group_id + ':' + item.variant_id}>
          <div className="checkout-item-image">{item.image_link ? <img src={item.image_link} alt="" /> : <span>◎</span>}</div>
          <div className="checkout-item-copy"><strong>{item.title}</strong><span>{[item.color, item.size].filter(Boolean).join(' · ') || 'Standard variant'} · Qty {item.quantity}</span><b>{formatMoney((item.sale_price ?? item.price ?? 0) * item.quantity)}</b></div>
        </div>)}
        <div className="checkout-total-row"><span>Subtotal</span><strong>{formatMoney(subtotal)}</strong></div>
        <div className="checkout-total-row"><span>Shipping Fee</span><strong>{formatMoney(SHIPPING_FEE)}</strong></div>
        <div className="checkout-grand-total"><strong>Total</strong><strong>{formatMoney(total)}</strong></div>
      </section>
      {submitError && <p className="checkout-error" role="alert">{submitError}</p>}
      <p className="checkout-local-note">Your order is saved in this browser on this device.</p>
    </form>
  </section>
}
