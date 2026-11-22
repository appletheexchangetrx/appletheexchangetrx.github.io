import { describe, expect, it } from 'vitest'
import { parseRoute } from './App'

describe('parseRoute', () => {
  it('resolves app-shell routes', () => {
    expect(parseRoute('#/home')).toEqual({ name: 'home' })
    expect(parseRoute('#/wishlist')).toEqual({ name: 'wishlist' })
  })

  it('resolves standalone routes and decodes identifiers', () => {
    expect(parseRoute('#/product/iPhone%2017')).toEqual({ name: 'product', id: 'iPhone 17' })
    expect(parseRoute('#/order/order-123')).toEqual({ name: 'order', id: 'order-123' })
  })

  it('returns not-found for unknown, malformed, or incomplete routes', () => {
    expect(parseRoute('#/unknown')).toEqual({ name: 'not-found' })
    expect(parseRoute('#/product')).toEqual({ name: 'not-found' })
    expect(parseRoute('#/product/%E0%A4%A')).toEqual({ name: 'not-found' })
    expect(parseRoute('#/home/extra')).toEqual({ name: 'not-found' })
  })
})
