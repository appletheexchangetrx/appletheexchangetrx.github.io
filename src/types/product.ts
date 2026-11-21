export interface ProductVariant {
  id: string
  size: string | null
  color: string | null
  price: number | null
  image_link: string | null
  sale_price: number | null
  additional_image_link: string[] | null
}

export interface ApiProduct {
  title: string
  description: string | null
  brand: string | null
  gtin: string | null
  mpn: string | null
  item_group_id: string | null
  availability: string | null
  condition: string | null
  quantity_to_sell_on_facebook: number | null
  expiration_date: string | null
  link: string | null
  google_product_category: string | null
  product_type: string | null
  created_at: string | null
  updated_at: string | null
  rich_text_description: string | null
  custom_label_0: string | null
  sale_price_effective_date: string | null
  variants: ProductVariant[] | null
}

export interface ProductsPagination {
  page: number
  limit: number
  total: number
  total_pages: number
  has_next_page: boolean
  has_previous_page: boolean
}

export interface ProductsApiResponse {
  success: boolean
  data: ApiProduct[]
  pagination?: ProductsPagination
}

export interface Product extends ApiProduct {
  id: string
  category: string
  defaultVariant: ProductVariant | null
}
