import { useMemo, useState } from 'react'
import { useProducts } from '../../context/ProductsContext'
import type { ProductVariant } from '../../types/product'

function formatPrice(value: number | null | undefined) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 'Price unavailable'
  return new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR', minimumFractionDigits: 2 }).format(value)
}

function variantLabel(variant: ProductVariant, index: number) {
  return [variant.color, variant.size].filter(Boolean).join(' / ') || `Option ${index + 1}`
}

export default function ProductDetailPage({ productId }: { productId?: string }) {
  const { products, isLoading, error, reload } = useProducts()
  const product = products.find((item) => item.id === productId)
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null)
  const selectedVariant = useMemo(() => {
    if (!product) return null
    return product.variants.find((variant) => variant.id === selectedVariantId) ?? product.defaultVariant
  }, [product, selectedVariantId])
  const image = selectedVariant?.image_link || product?.defaultVariant?.image_link
  const price = selectedVariant?.sale_price ?? selectedVariant?.price

  if (isLoading) return <div className="standalone-state"><p>Loading product...</p></div>
  if (error) return <div className="standalone-state"><h2>Unable to load product</h2><p>{error}</p><button className="standalone-text-action" onClick={reload}>Try again</button></div>
  if (!product) return <div className="standalone-state"><h2>Product not found</h2><p>This product may no longer be available.</p><a className="standalone-text-action" href="#/products">Browse products</a></div>

  return (
    <article className="product-detail-page">
      <div className="product-detail-image">
        {image ? <img src={image} alt={product.title} /> : <span aria-hidden="true">◎</span>}
      </div>
      <div className="product-detail-content">
        <span className="storefront-kicker">{product.category}</span>
        {product.brand && <p className="product-detail-brand">{product.brand}</p>}
        <h2>{product.title}</h2>
        <p className="product-detail-price">{formatPrice(price)}</p>
        {product.variants.length > 1 && (
          <div className="product-detail-options">
            <label htmlFor="product-variant">Choose variant</label>
            <select id="product-variant" value={selectedVariant?.id ?? ''} onChange={(event) => setSelectedVariantId(event.target.value)}>
              {product.variants.map((variant, index) => <option key={variant.id} value={variant.id}>{variantLabel(variant, index)}</option>)}
            </select>
          </div>
        )}
        {product.availability && <p className="product-detail-availability">Availability: {product.availability}</p>}
        {product.description && <section className="product-detail-description"><h3>Product description</h3><p>{product.description}</p></section>}
      </div>
    </article>
  )
}
