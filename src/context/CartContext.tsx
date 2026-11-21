import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Product, ProductVariant } from '../types/product'
import type { CartItem, CartItemStatus } from '../types/cart'
import { readCart, writeCart } from '../services/cartStorage'

interface CartContextValue {
  items: CartItem[]
  addToCart: (product: Product, variant: ProductVariant, quantity: number) => void
  updateQuantity: (itemGroupId: string, variantId: string, quantity: number) => void
  removeItem: (itemGroupId: string, variantId: string) => void
  clearCart: () => void
  getSubtotal: () => number
  getItemCount: () => number
  syncCart: (products: Product[]) => void
  hasBlockingItems: boolean
}
const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readCart)
  useEffect(() => writeCart(items), [items])

  const addToCart = useCallback((product: Product, variant: ProductVariant, quantity: number) => {
    if (!product.item_group_id || !variant.id || !Number.isInteger(quantity) || quantity < 1) return
    const stock = product.quantity_to_sell_on_facebook
    if (stock != null && (!Number.isFinite(stock) || stock <= 0)) return
    setItems((current) => {
      const existing = current.find((item) => item.item_group_id === product.item_group_id && item.variant_id === variant.id)
      const requestedTotal = (existing?.quantity ?? 0) + quantity
      const safeTotal = stock == null ? requestedTotal : Math.min(requestedTotal, stock)
      if (safeTotal < 1) return current
      if (existing) return current.map((item) => item === existing
        ? { ...item, quantity: safeTotal, quantity_to_sell_on_facebook: stock, status: stock == null ? 'stock_unverified' : 'available' } : item)
      return [...current, {
        item_group_id: product.item_group_id!, variant_id: variant.id, title: product.title,
        brand: product.brand, color: variant.color, size: variant.size,
        image_link: variant.image_link, price: variant.price, sale_price: variant.sale_price,
        quantity: safeTotal, quantity_to_sell_on_facebook: stock,
        status: stock == null ? 'stock_unverified' : 'available',
        previous_price: null, price_changed: false,
      }]
    })
  }, [])

  const updateQuantity = useCallback((groupId: string, variantId: string, quantity: number) => {
    if (!Number.isInteger(quantity) || quantity < 1) return
    setItems((current) => current.map((item) => {
      if (item.item_group_id !== groupId || item.variant_id !== variantId) return item
      const safeQuantity = item.quantity_to_sell_on_facebook == null
        ? quantity
        : Math.min(quantity, Math.max(1, item.quantity_to_sell_on_facebook))
      const status = item.status === 'stock_exceeded' && item.quantity_to_sell_on_facebook != null && safeQuantity <= item.quantity_to_sell_on_facebook
        ? (item.quantity_to_sell_on_facebook <= 0 ? 'out_of_stock' : 'available')
        : item.status
      return { ...item, quantity: safeQuantity, status }
    }))
  }, [])
  const removeItem = useCallback((groupId: string, variantId: string) => {
    setItems((current) => current.filter((item) => !(item.item_group_id === groupId && item.variant_id === variantId)))
  }, [])
  const clearCart = useCallback(() => setItems([]), [])

  const syncCart = useCallback((products: Product[]) => {
    setItems((current) => current.map((item) => {
      const product = products.find((candidate) => candidate.item_group_id === item.item_group_id)
      const variant = product?.variants.find((candidate) => candidate.id === item.variant_id)
      if (!product || !variant) return { ...item, status: 'unavailable' as CartItemStatus }
      const latestPrice = variant.sale_price ?? variant.price
      const oldPrice = item.sale_price ?? item.price
      const changed = latestPrice !== oldPrice
      const stock = product.quantity_to_sell_on_facebook
      let status: CartItemStatus = 'available'
      if (stock == null) status = 'stock_unverified'
      else if (stock <= 0) status = 'out_of_stock'
      else if (item.quantity > stock) status = 'stock_exceeded'
      return {
        ...item, title: product.title, brand: product.brand, color: variant.color, size: variant.size,
        image_link: variant.image_link, price: variant.price, sale_price: variant.sale_price,
        quantity_to_sell_on_facebook: stock, status,
        previous_price: changed ? oldPrice : null, price_changed: changed,
      }
    }))
  }, [])

  const getSubtotal = useCallback(() => items.reduce((sum, item) =>
    sum + (item.sale_price ?? item.price ?? 0) * item.quantity, 0), [items])
  const getItemCount = useCallback(() => items.reduce((sum, item) => sum + item.quantity, 0), [items])
  const hasBlockingItems = items.some((item) => item.status !== 'available')
  const value = useMemo(() => ({
    items, addToCart, updateQuantity, removeItem, clearCart, getSubtotal, getItemCount, syncCart, hasBlockingItems,
  }), [items, addToCart, updateQuantity, removeItem, clearCart, getSubtotal, getItemCount, syncCart, hasBlockingItems])
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used inside CartProvider')
  return context
}
