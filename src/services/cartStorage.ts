import type { CartItem, StoredCart } from '../types/cart'

const CART_STORAGE_KEY = 'aet-cart'
const EMPTY_CART: StoredCart = { version: 1, items: [] }

export function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Partial<StoredCart>
    if (parsed.version !== 1 || !Array.isArray(parsed.items)) return []
    return parsed.items.filter((item): item is CartItem =>
      Boolean(item && typeof item.item_group_id === 'string' &&
      typeof item.variant_id === 'string' && Number.isInteger(item.quantity) && item.quantity > 0))
  } catch {
    return []
  }
}

export function writeCart(items: CartItem[]) {
  try {
    const value: StoredCart = { ...EMPTY_CART, items }
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(value))
  } catch {
    // Keep the in-memory cart usable if browser storage is unavailable.
  }
}
