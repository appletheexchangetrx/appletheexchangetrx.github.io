import { useProducts } from '../../context/ProductsContext'
import { useWishlist } from '../../context/WishlistContext'
import EmptyState from '../common/EmptyState'
import ErrorState from '../common/ErrorState'

function money(value: number | null | undefined) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 'Price unavailable'
  return new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(value)
}

export default function WishlistPage() {
  const { products, isLoading, error, reload } = useProducts()
  const { ids, toggle } = useWishlist()
  const savedProducts = products.filter((product) => ids.includes(product.id))

  return (
    <section className="wishlist-page" aria-labelledby="wishlist-title">
      <header className="wishlist-heading">
        <span className="storefront-kicker">YOUR SAVED ITEMS</span>
        <h1 id="wishlist-title">Wishlist</h1>
        <p>{ids.length} saved {ids.length === 1 ? 'item' : 'items'}</p>
      </header>

      {isLoading && <p className="wishlist-status" role="status">Loading your saved products…</p>}
      {!isLoading && error && <ErrorState message={error} onRetry={reload} />}
      {!isLoading && !error && ids.length === 0 && (
        <EmptyState title="Your wishlist is empty" description="Save products you love and they’ll appear here."
          action={<a className="not-found-home" href="#/products">Explore products</a>} />
      )}
      {!isLoading && !error && ids.length > 0 && savedProducts.length === 0 && (
        <EmptyState title="Saved products are unavailable"
          description="The products saved on this device are not present in the current catalog." />
      )}

      {savedProducts.length > 0 && (
        <div className="wishlist-grid">
          {savedProducts.map((product) => {
            const variant = product.defaultVariant
            return (
              <article className="wishlist-card" key={product.id}>
                <a className="wishlist-product-link" href={`#/product/${encodeURIComponent(product.id)}`}>
                  <div className="wishlist-image">
                    {variant?.image_link
                      ? <img src={variant.image_link} alt={product.title} loading="lazy" />
                      : <span aria-hidden="true">◎</span>}
                  </div>
                  <div className="wishlist-product-info">
                    <span>{product.category}</span>
                    <h2>{product.title}</h2>
                    <strong>{money(variant?.sale_price ?? variant?.price)}</strong>
                  </div>
                </a>
                <button type="button" className="wishlist-remove" onClick={() => toggle(product.id)}>
                  Remove from wishlist
                </button>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
