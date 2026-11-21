import { useMemo, useState } from 'react'
import { useProducts } from '../context/ProductsContext'

function formatPrice(value: number | null | undefined) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null

  return new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: 'MYR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

interface ProductCatalogProps {
  title?: string
  kicker?: string
}

export default function ProductCatalog({
  title = 'Shop products',
  kicker = 'CURATED FOR YOU',
}: ProductCatalogProps) {
  const { products, isLoading, error, reload } = useProducts()
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(products.map((product) => product.category).filter(Boolean)))],
    [products],
  )

  const visibleProducts = useMemo(() => products.filter((product) => {
    const matchesCategory = category === 'All' || product.category === category
    const searchText = `${product.title} ${product.brand} ${product.category} ${product.description}`
    const matchesSearch = searchText.toLowerCase().includes(search.trim().toLowerCase())
    return matchesCategory && matchesSearch
  }), [category, products, search])

  return (
    <>
      <div className="storefront-section-heading">
        <div>
          {kicker && <span className="storefront-kicker">{kicker}</span>}
          <h2>{title}</h2>
        </div>
        {!isLoading && !error && <span className="storefront-count">{visibleProducts.length} items</span>}
      </div>

      <div className="storefront-search">
        <input className="storefront-search-input" type="search" value={search} placeholder="Search products"
          aria-label="Search products" onChange={(event) => setSearch(event.target.value)} />
      </div>

      {!isLoading && !error && categories.length > 1 && (
        <div className="storefront-categories" role="group" aria-label="Product categories">
          {categories.map((item) => (
            <button key={item} type="button"
              className={`storefront-category-chip${category === item ? ' is-active' : ''}`}
              aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>
          ))}
        </div>
      )}

      <div className="storefront-products" id="store-products" aria-live="polite">
        {isLoading && <div className="storefront-empty"><p>Loading products...</p></div>}
        {!isLoading && error && (
          <div className="storefront-empty">
            <h3>Unable to load products</h3><p>{error}</p>
            <button className="storefront-clear-filters" type="button" onClick={reload}>Try again</button>
          </div>
        )}
        {!isLoading && !error && visibleProducts.map((product) => {
          const variant = product.defaultVariant
          const price = formatPrice(variant?.sale_price ?? variant?.price)
          return (
            <a key={product.id} className="storefront-product-link" href={`#/product/${encodeURIComponent(product.id)}`}>
              <article className="storefront-product-card">
                <div className="storefront-product-image-wrap">
                  {variant?.image_link ? <img src={variant.image_link} alt={product.title} loading="lazy" className="storefront-product-image" />
                    : <span className="storefront-product-image-fallback" aria-hidden="true">◎</span>}
                </div>
                <div className="storefront-product-info">
                  <span className="storefront-product-category">{product.category}</span>
                  <h3>{product.title}</h3>
                  <div className="storefront-product-footer"><strong>{price ?? 'Price unavailable'}</strong></div>
                </div>
              </article>
            </a>
          )
        })}
        {!isLoading && !error && visibleProducts.length === 0 && (
          <div className="storefront-empty">
            <span aria-hidden="true">⌕</span>
            <h3>{products.length === 0 ? 'No products available' : 'No products found'}</h3>
            <p>{products.length === 0 ? 'Products will appear here when available.' : 'Try another search or category.'}</p>
            {products.length > 0 && <button className="storefront-clear-filters" type="button" onClick={() => { setSearch(''); setCategory('All') }}>Clear filters</button>}
          </div>
        )}
      </div>
    </>
  )
}
