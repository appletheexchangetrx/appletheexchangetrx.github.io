import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import BottomNav from './BottomNav'

describe('BottomNav', () => {
  it('renders all primary navigation destinations', () => {
    render(<BottomNav activePage="products" />)
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '#/home')
    expect(screen.getByRole('link', { name: /wishlist/i })).toHaveAttribute('href', '#/wishlist')
    expect(screen.getByRole('link', { name: /products/i })).toHaveAttribute('aria-current', 'page')
  })
})
