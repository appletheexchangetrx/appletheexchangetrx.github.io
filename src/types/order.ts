export interface OrderShippingAddress {
  address: string
  city: string
  state: string
  postcode: string
  country: string
  notes: string | null
}

export interface OrderItem {
  id: string
  item_group_id: string
  variant_id: string
  title: string
  brand: string | null
  color: string | null
  size: string | null
  image_link: string | null
  price: number
  sale_price: number | null
  quantity: number
}

export type OrderStatus = 'pending'
export type PaymentStatus = 'pending'
export type ShippingStatus = 'pending'

export interface Order {
  id: string
  order_number: string
  customer_name: string
  phone: string
  email: string | null
  shipping_address: OrderShippingAddress
  items: OrderItem[]
  subtotal: number
  shipping_fee: number
  total: number
  payment_method: string | null
  payment_status: PaymentStatus
  order_status: OrderStatus
  shipping_status: ShippingStatus
  created_at: string
}
