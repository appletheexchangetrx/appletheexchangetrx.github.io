export type CartItemStatus =
  | 'available'
  | 'unavailable'
  | 'out_of_stock'
  | 'stock_unverified'
  | 'stock_exceeded'

export interface CartItem {
  item_group_id: string
  variant_id: string
  title: string
  brand: string | null
  color: string | null
  size: string | null
  image_link: string | null
  price: number | null
  sale_price: number | null
  quantity: number
  quantity_to_sell_on_facebook: number | null
  status: CartItemStatus
  previous_price: number | null
  price_changed: boolean
}

export interface StoredCart {
  version: 1
  items: CartItem[]
}
