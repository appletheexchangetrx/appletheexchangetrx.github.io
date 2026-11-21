import type { ApiProduct, Product, ProductsApiResponse } from '../types/product'

export const PRODUCTS_ENDPOINT =
  'https://axednjikcambzbkxyqpp.supabase.co/functions/v1/get-products'

// Publishable keys are intended for browser clients. Never place a service-role/secret key here.
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_Vysddy5_b0uZ3iKgnkDTIw_X5O1pBEd'

const PAGE_LIMIT = 100

function normalizeProduct(item: ApiProduct, index: number): Product {
  const variants = Array.isArray(item.variants) ? item.variants : []
  return {
    ...item,
    id: item.item_group_id || variants[0]?.id || `product-${index}`,
    title: item.title || 'Untitled product',
    brand: item.brand ?? null,
    description: item.description ?? null,
    availability: item.availability ?? 'unknown',
    category: item.product_type || item.google_product_category || 'Other',
    variants,
    defaultVariant: variants[0] ?? null,
  }
}

async function fetchProductsPage(page: number, signal?: AbortSignal) {
  const url = new URL(PRODUCTS_ENDPOINT)
  url.searchParams.set('page', String(page))
  url.searchParams.set('limit', String(PAGE_LIMIT))
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      apikey: SUPABASE_PUBLISHABLE_KEY,
    },
    signal,
  })
  if (!response.ok) throw new Error(`Unable to load products (HTTP ${response.status})`)
  const result = (await response.json()) as ProductsApiResponse
  if (result.success !== true || !Array.isArray(result.data)) {
    throw new Error('The products API returned an unexpected response.')
  }
  return result
}

export async function getProducts(signal?: AbortSignal): Promise<Product[]> {
  const firstPage = await fetchProductsPage(1, signal)
  const allItems = [...firstPage.data]
  const pagination = firstPage.pagination
  const totalPages = pagination?.total_pages ?? (pagination?.has_next_page ? 2 : 1)

  for (let page = 2; page <= totalPages; page += 1) {
    if (signal?.aborted) throw new DOMException('The request was aborted.', 'AbortError')
    const result = await fetchProductsPage(page, signal)
    allItems.push(...result.data)
    if (result.pagination && !result.pagination.has_next_page) break
  }

  const byProduct = new Map<string, ApiProduct>()
  allItems.forEach((item, index) => {
    const key = item.item_group_id || item.variants?.[0]?.id || `product-${index}`
    const existing = byProduct.get(key)
    if (!existing) byProduct.set(key, item)
    else {
      const variants = [...(existing.variants ?? [])]
      const knownIds = new Set(variants.map((variant) => variant.id))
      for (const variant of item.variants ?? []) {
        if (!knownIds.has(variant.id)) variants.push(variant)
      }
      byProduct.set(key, { ...existing, ...item, variants })
    }
  })

  return Array.from(byProduct.values()).map(normalizeProduct)
}
