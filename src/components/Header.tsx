import { ShoppingCart, UserRound } from 'lucide-react'

export default function Header() {
  return (
    <header className="app-header">
      <span className="app-eyebrow">THE EXCHANGE TRX · KUALA LUMPUR</span>
      <nav className="header-actions" aria-label="Account and shopping">
        <a className="header-action" href="#cart" aria-label="Cart">
          <ShoppingCart size={18} strokeWidth={1.7} aria-hidden="true" />
          <span>Cart</span>
        </a>
        <a className="header-action" href="#account" aria-label="Profile">
          <UserRound size={18} strokeWidth={1.7} aria-hidden="true" />
          <span>Profile</span>
        </a>
      </nav>
    </header>
  )
}
