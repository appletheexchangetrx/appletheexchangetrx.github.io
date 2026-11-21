import type { Order, OrderItem, OrderShippingAddress } from '../types/order'

export const ORDERS_STORAGE_KEY = 'store_orders'

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === 'string'
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function isShippingAddress(value: unknown): value is OrderShippingAddress {
  if (!value || typeof value !== 'object') return false
  const address = value as Record<string, unknown>
  return typeof address.address === 'string' &&
    typeof address.city === 'string' &&
    typeof address.state === 'string' &&
    typeof address.postcode === 'string' &&
    typeof address.country === 'string' &&
    isNullableString(address.notes)
}

function isOrderItem(value: unknown): value is OrderItem {
  if (!value || typeof value !== 'object') return false
  const item = value as Record<string, unknown>
  return typeof item.id === 'string' &&
    typeof item.item_group_id === 'string' &&
    typeof item.variant_id === 'string' &&
    typeof item.title === 'string' &&
    isNullableString(item.brand) &&
    isNullableString(item.color) &&
    isNullableString(item.size) &&
    isNullableString(item.image_link) &&
    isFiniteNumber(item.price) && item.price >= 0 &&
    (item.sale_price === null || (isFiniteNumber(item.sale_price) && item.sale_price >= 0)) &&
    Number.isSafeInteger(item.quantity) && (item.quantity as number) > 0
}

function isOrder(value: unknown): value is Order {
  if (!value || typeof value !== 'object') return false
  const order = value as Record<string, unknown>
  return typeof order.id === 'string' &&
    typeof order.order_number === 'string' &&
    typeof order.customer_name === 'string' &&
    typeof order.phone === 'string' &&
    isNullableString(order.email) &&
    isShippingAddress(order.shipping_address) &&
    Array.isArray(order.items) && order.items.length > 0 && order.items.every(isOrderItem) &&
    isFiniteNumber(order.subtotal) && order.subtotal >= 0 &&
    isFiniteNumber(order.shipping_fee) && order.shipping_fee >= 0 &&
    isFiniteNumber(order.total) && order.total >= 0 &&
    order.payment_method === null &&
    order.payment_status === 'pending' &&
    order.order_status === 'pending' &&
    order.shipping_status === 'pending' &&
    typeof order.created_at === 'string' && Number.isFinite(Date.parse(order.created_at))
}

export function readOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isOrder)
  } catch {
    return []
  }
}

export function getOrderById(orderId: string): Order | null {
  return readOrders().find((order) => order.id === orderId) ?? null
}

export function saveOrder(order: Order): void {
  if (!isOrder(order)) throw new Error('Order data is invalid.')
  const existing = readOrders()
  if (existing.some((item) => item.id === order.id)) throw new Error('This order has already been saved.')
  const next = [order, ...existing]
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(next))
}
