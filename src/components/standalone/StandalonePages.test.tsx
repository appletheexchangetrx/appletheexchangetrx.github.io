import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import StandalonePages from './StandalonePages'

describe('StandalonePages', () => {
  it('renders a recoverable not-found page for unknown routes', () => {
    render(<StandalonePages route="not-found" onBack={vi.fn()} />)
    expect(screen.getByRole('heading', { name: 'We couldn’t find that page' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Return to Home' })).toHaveAttribute('href', '#/home')
  })
})
