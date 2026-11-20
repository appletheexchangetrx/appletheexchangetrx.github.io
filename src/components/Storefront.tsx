import { useMemo, useState } from 'react'
import { Button, Card, Chip, Searchbar } from 'konsta/react'
import { useStorefrontCart } from './AppShell'

const categories = ['All', 'iPhone', 'iPad', 'Mac', 'Watch', 'Audio']

const products = [
  { id: 'iphone-17-pro', name: 'iPhone 17 Pro', category: 'iPhone', detail: 'A19 Pro chip · Pro camera system', price: 'From RM 5,499', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=900&q=85', tag: 'New' },
  { id: 'macbook-air', name: 'MacBook Air', category: 'Mac', detail: 'M4 chip · Built for Apple Intelligence', price: 'From RM 4,499', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=85', tag: 'Popular' },
  { id: 'ipad-air', name: 'iPad Air', category: 'iPad', detail: 'M3 chip · 11-inch and 13-inch', price: 'From RM 2,799', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=900&q=85' },
  { id: 'apple-watch', name: 'Apple Watch Series 11', category: 'Watch', detail: 'Health insights · Always-on display', price: 'From RM 1,799', image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=900&q=85' },
  { id: 'airpods-pro', name: 'AirPods Pro', category: 'Audio', detail: 'Active Noise Cancellation · USB-C', price: 'From RM 999', image: 'https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?auto=format&fit=crop&w=900&q=85' },
  { id: 'iphone-17', name: 'iPhone 17', category: 'iPhone', detail: 'All-new design · Brilliant display', price: 'From RM 3,999', image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=900&q=85' },
]

export default function Storefront() {
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const { addToBag } = useStorefrontCart()

  const visibleProducts = useMemo(() => products.filter((product) => {
    const matchesCategory = category === 'All' || product.category === category
    const matchesSearch = `${product.name} ${product.detail}`.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  }), [category, search])

  return (
    <div className="storefront">
      <div className="storefront-topline">
        <div>
          <span className="storefront-kicker">APPLE THE EXCHANGE TRX</span>
          <p className="storefront-location">Kuala Lumpur, Malaysia</p>
        </div>
      </div>

      <section className="storefront-hero">
        <div className="storefront-hero-copy">
          <span>THE LATEST FROM APPLE</span>
          <h1>Make room<br />for wonder.</h1>
          <p>Discover the latest Apple products, all in one place.</p>
          <a href="#store-products">Explore now <span aria-hidden="true">↗</span></a>
        </div>
        <div className="storefront-hero-orb" aria-hidden="true">
          <div className="storefront-hero-device" />
        </div>
      </section>

      <div className="storefront-section-heading">
        <div>
          <span className="storefront-kicker">CURATED FOR YOU</span>
          <h2>Shop products</h2>
        </div>
        <span className="storefront-count">{visibleProducts.length} items</span>
      </div>

      <div className="storefront-search">
        <Searchbar
          value={search}
          placeholder="Search products"
          onInput={(event) => setSearch(event.target.value)}
          onClear={() => setSearch('')}
        />
      </div>

      <div className="storefront-categories" role="group" aria-label="Product categories">
        {categories.map((item) => (
          <Chip
            key={item}
            outline={category !== item}
            className={category === item ? 'storefront-chip-active' : 'storefront-chip'}
            onClick={() => setCategory(item)}
          >
            {item}
          </Chip>
        ))}
      </div>

      <div className="storefront-products" id="store-products">
        {visibleProducts.map((product) => (
          <Card key={product.id} className="storefront-product-card">
            <div className="storefront-product-image-wrap">
              {product.tag && <span className="storefront-product-tag">{product.tag}</span>}
              <img src={product.image} alt={product.name} loading="lazy" className="storefront-product-image" />
            </div>
            <div className="storefront-product-info">
              <span className="storefront-product-category">{product.category}</span>
              <h3>{product.name}</h3>
              <p>{product.detail}</p>
              <div className="storefront-product-footer">
                <strong>{product.price}</strong>
                <Button small rounded onClick={addToBag}>Add</Button>
              </div>
            </div>
          </Card>
        ))}
        {visibleProducts.length === 0 && (
          <div className="storefront-empty">
            <span aria-hidden="true">⌕</span>
            <h3>No products found</h3>
            <p>Try another search or category.</p>
            <Button clear onClick={() => { setSearch(''); setCategory('All') }}>Clear filters</Button>
          </div>
        )}
      </div>

      <section className="storefront-visit">
        <span className="storefront-kicker">COME SAY HELLO</span>
        <h2>Experience Apple<br />at The Exchange TRX.</h2>
        <p>Visit us for personal recommendations and a closer look at your next device.</p>
        <a href="https://www.theexchange.my/" target="_blank" rel="noreferrer">Discover The Exchange TRX ↗</a>
      </section>
      <p className="storefront-disclaimer">Product selection and prices shown are for demonstration purposes.</p>
    </div>
  )
}
