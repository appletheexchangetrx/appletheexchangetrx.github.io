import { ShoppingBag, UserRound } from 'lucide-react'

type HeaderProps = {
  bagCount: number
}

export default function Header({ bagCount }: HeaderProps) {
  return (
    <header className="app-header">
      <span className="app-eyebrow">THE EXCHANGE TRX · KUALA LUMPUR</span>
      <nav className="header-actions" aria-label="Account and shopping">
        <a className="header-action header-bag-action" href="#cart" aria-label={`Shopping bag, ${bagCount} items`}>
          <span className="header-bag-icon">
            <ShoppingBag size={19} strokeWidth={1.7} aria-hidden="true" />
            {bagCount > 0 && <span className="header-bag-count">{bagCount}</span>}
          </span>
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
