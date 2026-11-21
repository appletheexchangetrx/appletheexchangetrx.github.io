import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { getProducts } from '../services/productService'
import type { Product } from '../types/product'

interface ProductsContextValue {
  products: Product[]
  isLoading: boolean
  error: string | null
  reload: () => void
}

const ProductsContext = createContext<ProductsContextValue | null>(null)

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [requestKey, setRequestKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function loadProducts() {
      setIsLoading(true)
      setError(null)

      try {
        const result = await getProducts(controller.signal)
        setProducts(result)
      } catch (cause) {
        if (controller.signal.aborted) return
        setError(cause instanceof Error ? cause.message : 'An unexpected error occurred.')
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }

    void loadProducts()
    return () => controller.abort()
  }, [requestKey])

  return (
    <ProductsContext.Provider
      value={{ products, isLoading, error, reload: () => setRequestKey((key) => key + 1) }}
    >
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductsContext)
  if (!context) throw new Error('useProducts must be used inside ProductsProvider')
  return context
}
