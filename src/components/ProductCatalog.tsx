import { useMemo, useState } from 'react'
import { useProducts } from '../context/ProductsContext'
import ProductCard from './product/ProductCard'
import ProductFilters from './product/ProductFilters'
import Input from './common/Input'
import Skeleton from './common/Skeleton'
import ErrorState from './common/ErrorState'
import EmptyState from './common/EmptyState'
interface ProductCatalogProps { title?: string; kicker?: string }
export default function ProductCatalog({title='Shop products',kicker='CURATED FOR YOU'}:ProductCatalogProps){
 const {products,isLoading,error,reload}=useProducts()
 const [category,setCategory]=useState('All')
 const [search,setSearch]=useState('')
 const [sort,setSort]=useState('featured')
 const categories=useMemo(()=>['All',...Array.from(new Set(products.map(p=>p.category).filter(Boolean)))],[products])
 const visible=useMemo(()=>{
  const term=search.trim().toLowerCase()
  const list=products.filter(p=>(category==='All'||p.category===category)&&`${p.title} ${p.brand??''} ${p.category} ${p.description??''}`.toLowerCase().includes(term))
  return [...list].sort((a,b)=>{const ap=a.defaultVariant?.sale_price??a.defaultVariant?.price??Infinity;const bp=b.defaultVariant?.sale_price??b.defaultVariant?.price??Infinity;if(sort==='price-asc')return ap-bp;if(sort==='price-desc')return bp-ap;if(sort==='name')return a.title.localeCompare(b.title);return 0})
 },[products,category,search,sort])
 return <section className="catalog-section" aria-labelledby="catalog-title">
  <div className="storefront-section-heading"><div>{kicker&&<span className="storefront-kicker">{kicker}</span>}<h2 id="catalog-title">{title}</h2></div>{!isLoading&&!error&&<span className="storefront-count">{visible.length} items</span>}</div>
  <div className="storefront-search"><Input type="search" value={search} placeholder="Search products" aria-label="Search products" onChange={e=>setSearch(e.target.value)}/></div>
  {!isLoading&&!error&&<ProductFilters categories={categories} category={category} onCategoryChange={setCategory} sort={sort} onSortChange={setSort}/>}
  <div className="storefront-products" id="store-products" aria-live="polite">
   {isLoading&&<Skeleton lines={4} className="catalog-loading"/>}
   {!isLoading&&error&&<ErrorState title="Unable to load products" message={error} onRetry={reload}/>}
   {!isLoading&&!error&&visible.map(product=><ProductCard key={product.id} product={product}/>)}
   {!isLoading&&!error&&visible.length===0&&<EmptyState title={products.length?'No products found':'No products available'} description={products.length?'Try another search or category.':'Products will appear here when available.'} action={products.length?<button type="button" className="storefront-clear-filters" onClick={()=>{setSearch('');setCategory('All');setSort('featured')}}>Clear filters</button>:undefined}/>}
  </div>
 </section>
}