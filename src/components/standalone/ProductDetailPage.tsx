import { useMemo, useState } from 'react'
import { useProducts } from '../../context/ProductsContext'
import { useCart } from '../../context/CartContext'
import type { ProductVariant } from '../../types/product'

function formatPrice(value: number | null | undefined) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 'Price unavailable'
  return new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR', minimumFractionDigits: 2 }).format(value)
}
export default function ProductDetailPage({ productId }: { productId?: string }) {
  const { products, isLoading, error, reload } = useProducts()
  const { addToCart } = useCart()
  const product = products.find((item) => item.id === productId)
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null)
  const [activeImage, setActiveImage] = useState(0)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const selectedVariant = useMemo(() => product?.variants.find((variant) => variant.id === selectedVariantId) ?? product?.defaultVariant ?? null, [product, selectedVariantId])
  const images = useMemo(() => selectedVariant ? [selectedVariant.image_link, ...(selectedVariant.additional_image_link ?? [])].filter((value): value is string => Boolean(value)) : [], [selectedVariant])
  const price = selectedVariant?.sale_price ?? selectedVariant?.price
  const colors = Array.from(new Set(product?.variants.map((variant) => variant.color).filter((value): value is string => Boolean(value)) ?? []))
  const sizes = Array.from(new Set(product?.variants.filter((variant) => !selectedVariant?.color || variant.color === selectedVariant.color).map((variant) => variant.size).filter((value): value is string => Boolean(value)) ?? []))

  const chooseColor = (color: string) => {
    const next = product?.variants.find((variant) => variant.color === color && (!selectedVariant?.size || variant.size === selectedVariant.size))
      ?? product?.variants.find((variant) => variant.color === color)
    if (next) { setSelectedVariantId(next.id); setActiveImage(0) }
  }
  const chooseSize = (size: string) => {
    const next = product?.variants.find((variant) => variant.size === size && (!selectedVariant?.color || variant.color === selectedVariant.color))
      ?? product?.variants.find((variant) => variant.size === size)
    if (next) { setSelectedVariantId(next.id); setActiveImage(0) }
  }
  const confirmAdd = () => {
    if (!product || !selectedVariant) return
    addToCart(product, selectedVariant, quantity)
    setSheetOpen(false)
    window.location.hash = '#/cart'
  }

  if (isLoading) return <div className="standalone-state"><p>Loading product...</p></div>
  if (error) return <div className="standalone-state"><h2>Unable to load product</h2><p>{error}</p><button className="standalone-text-action" onClick={reload}>Try again</button></div>
  if (!product) return <div className="standalone-state"><h2>Product not found</h2><p>This product may no longer be available.</p><a className="standalone-text-action" href="#/products">Browse products</a></div>

  return <article className="product-detail-page">
    <div className="product-gallery">
      <div className="product-detail-image" onTouchStart={(event) => { (event.currentTarget as HTMLDivElement).dataset.touchX = String(event.touches[0].clientX) }}
        onTouchEnd={(event) => { const start = Number((event.currentTarget as HTMLDivElement).dataset.touchX); const delta = event.changedTouches[0].clientX - start; if (Math.abs(delta) > 40) setActiveImage((index) => Math.max(0, Math.min(images.length - 1, index + (delta < 0 ? 1 : -1)))) }}>
        {images[activeImage] ? <img src={images[activeImage]} alt={product.title} /> : <span aria-hidden="true">◎</span>}
      </div>
      {images.length > 1 && <div className="product-gallery-dots">{images.map((image, index) => <button key={image + index} type="button" aria-label={`Show image ${index + 1}`} className={index === activeImage ? 'is-active' : ''} onClick={() => setActiveImage(index)} />)}</div>}
    </div>
    <div className="product-detail-content">
      <span className="storefront-kicker">{product.category}</span>
      {product.brand && <p className="product-detail-brand">{product.brand}</p>}
      <h2>{product.title}</h2>
      <p className="product-detail-price">{formatPrice(price)}</p>
      {colors.length > 0 && <div className="product-variant-group"><strong>Color</strong><div className="product-color-options">{colors.map((color) => <button type="button" key={color} className={selectedVariant?.color === color ? 'is-selected' : ''} onClick={() => chooseColor(color)}>{color}</button>)}</div></div>}
      {sizes.length > 0 && <div className="product-variant-group"><strong>Size</strong><div className="product-size-options">{sizes.map((size) => <button type="button" key={size} className={selectedVariant?.size === size ? 'is-selected' : ''} onClick={() => chooseSize(size)}>{size}</button>)}</div></div>}
      {product.availability && <p className="product-detail-availability">Availability: {product.availability}</p>}
      {product.description && <section className="product-detail-description"><h3>Product description</h3><p>{product.description}</p></section>}
      <button type="button" className="product-add-button" onClick={() => setSheetOpen(true)} disabled={!selectedVariant}>Add to Cart</button>
    </div>
    {sheetOpen && selectedVariant && <div className="cart-dialog-backdrop" role="presentation" onClick={() => setSheetOpen(false)}>
      <section className="variant-bottom-sheet" role="dialog" aria-modal="true" aria-labelledby="variant-sheet-title" onClick={(event) => event.stopPropagation()}>
        <div className="variant-sheet-handle" /><h2 id="variant-sheet-title">Choose your variant</h2>
        <div className="variant-sheet-summary"><strong>{product.title}</strong><span>{formatPrice(price)}</span><small>{[selectedVariant.color, selectedVariant.size].filter(Boolean).join(' · ')}</small></div>
        {colors.length > 0 && <div className="product-variant-group"><strong>Color</strong><div className="product-color-options">{colors.map((color) => <button type="button" key={color} className={selectedVariant.color === color ? 'is-selected' : ''} onClick={() => { chooseColor(color); setActiveImage(0) }}>{color}</button>)}</div></div>}
        {Array.from(new Set(product.variants.filter((variant) => !selectedVariant.color || variant.color === selectedVariant.color).map((variant) => variant.size).filter((value): value is string => Boolean(value)))).length > 0 && <div className="product-variant-group"><strong>Size</strong><div className="product-size-options">{Array.from(new Set(product.variants.filter((variant) => !selectedVariant.color || variant.color === selectedVariant.color).map((variant) => variant.size).filter((value): value is string => Boolean(value)))).map((size) => <button type="button" key={size} className={selectedVariant.size === size ? 'is-selected' : ''} onClick={() => chooseSize(size)}>{size}</button>)}</div></div>}
        <div className="variant-sheet-quantity"><span>Quantity</span><div className="cart-quantity"><button type="button" disabled={quantity <= 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))}>−</button><span>{quantity}</span><button type="button" onClick={() => setQuantity((value) => value + 1)}>+</button></div></div>
        <button type="button" className="product-add-button" onClick={confirmAdd}>Confirm Add to Cart</button>
        <button type="button" className="variant-sheet-cancel" onClick={() => setSheetOpen(false)}>Cancel</button>
      </section>
    </div>}
  </article>
}
