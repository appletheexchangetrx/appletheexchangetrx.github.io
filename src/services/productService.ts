import type { ApiProduct, Product, ProductsApiResponse } from '../types/product'

export const PRODUCTS_ENDPOINT =
  'https://axednjikcambzbkxyqpp.supabase.co/functions/v1/get-products'

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

export async function getProducts(signal?: AbortSignal): Promise<Product[]> {
  const response = await fetch(PRODUCTS_ENDPOINT, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    signal,
  })

  if (!response.ok) {
    throw new Error(`Unable to load products (HTTP ${response.status})`)
  }

  const result = (await response.json()) as ProductsApiResponse
  if (result.success !== true || !Array.isArray(result.data)) {
    throw new Error('The products API returned an unexpected response.')
  }

  return result.data.map(normalizeProduct)
}
