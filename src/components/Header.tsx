import { Bell, ShoppingBag, UserRound } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function Header() {
  const { getItemCount } = useCart()
  const bagCount = getItemCount()

  return (
    <header className="app-header">
      <a className="app-brand" href="#/home" aria-label="Apple The Exchange TRX home">
        <img
          src="https://axednjikcambzbkxyqpp.supabase.co/storage/v1/object/public/images/logo.png"
          alt="The Exchange TRX"
          width={24}
          height={24}
          style={{ width: 24, height: 24, objectFit: 'contain' }}
        />
      </a>
      <nav className="header-actions" aria-label="Account and shopping">
        <a className="header-action" href="#/notification" aria-label="Notification">
          <Bell size={18} strokeWidth={1.7} aria-hidden="true" />
          <span>Notification</span>
        </a>
        <a className="header-action header-bag-action" href="#/cart" aria-label={`Shopping bag, ${bagCount} items`}>
          <span className="header-bag-icon">
            <ShoppingBag size={19} strokeWidth={1.7} aria-hidden="true" />
            {bagCount > 0 && <span className="header-bag-count">{bagCount}</span>}
          </span>
          <span>Cart</span>
        </a>
        <a className="header-action" href="#/profile" aria-label="Profile">
          <UserRound size={18} strokeWidth={1.7} aria-hidden="true" />
          <span>Profile</span>
        </a>
      </nav>
    </header>
  )
}
