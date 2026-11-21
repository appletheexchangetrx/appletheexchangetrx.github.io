export interface ProductVariant {
  id: string
  size: string | null
  color: string | null
  price: number | null
  image_link: string | null
  sale_price: number | null
  custom_label_0?: string | null
  additional_image_link?: string[] | null
  sale_price_effective_date?: string | null
}

export interface ApiProduct {
  title: string
  description?: string | null
  brand?: string | null
  item_group_id?: string | null
  availability?: string | null
  product_type?: string | null
  variants?: ProductVariant[] | null
}

export interface ProductsApiResponse {
  success: boolean
  data: ApiProduct[]
}

export interface Product {
  id: string
  title: string
  brand: string
  category: string
  description: string
  availability: string
  variants: ProductVariant[]
  defaultVariant: ProductVariant | null
}
