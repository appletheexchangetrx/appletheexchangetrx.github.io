import type { CartItem, StoredCart } from '../types/cart'

const CART_STORAGE_KEY = 'aet-cart'
const EMPTY_CART: StoredCart = { version: 1, items: [] }
const STATUSES = new Set(['available', 'unavailable', 'out_of_stock', 'stock_unverified', 'stock_exceeded'])

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === 'string'
}
function isNullableNumber(value: unknown): value is number | null {
  return value === null || (typeof value === 'number' && Number.isFinite(value))
}
function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== 'object') return false
  const item = value as Record<string, unknown>
  return typeof item.item_group_id === 'string' && item.item_group_id.trim().length > 0 &&
    typeof item.variant_id === 'string' && item.variant_id.trim().length > 0 &&
    typeof item.title === 'string' &&
    isNullableString(item.brand) && isNullableString(item.color) &&
    isNullableString(item.size) && isNullableString(item.image_link) &&
    isNullableNumber(item.price) && isNullableNumber(item.sale_price) &&
    Number.isSafeInteger(item.quantity) && (item.quantity as number) > 0 &&
    isNullableNumber(item.quantity_to_sell_on_facebook) &&
    (item.quantity_to_sell_on_facebook === null || (item.quantity_to_sell_on_facebook as number) >= 0) &&
    typeof item.status === 'string' && STATUSES.has(item.status) &&
    isNullableNumber(item.previous_price) && typeof item.price_changed === 'boolean'
}

export function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return []
    const stored = parsed as Partial<StoredCart>
    if (stored.version !== 1 || !Array.isArray(stored.items)) return []
    return stored.items.filter(isCartItem).map((item) => ({
      ...item,
      quantity: item.quantity_to_sell_on_facebook == null
        ? item.quantity
        : Math.min(item.quantity, Math.max(1, item.quantity_to_sell_on_facebook)),
      status: item.quantity_to_sell_on_facebook != null && item.quantity_to_sell_on_facebook <= 0
        ? 'out_of_stock'
        : item.status,
    }))
  } catch {
    return []
  }
}

export function writeCart(items: CartItem[]) {
  try {
    const value: StoredCart = { ...EMPTY_CART, items: items.filter(isCartItem) }
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(value))
  } catch {
    // Keep the in-memory cart usable if browser storage is unavailable.
  }
}
