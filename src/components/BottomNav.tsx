import { Heart, House, LayoutGrid, MessageCircle } from 'lucide-react'

type BottomNavProps = {
  activePage: 'home' | 'products' | 'profile' | 'wishlist'
}

const navigationItems = [
  { label: 'Home', href: '#/home', page: 'home', Icon: House },
  { label: 'Products', href: '#/products', page: 'products', Icon: LayoutGrid },
  { label: 'Wishlist', href: '#/wishlist', page: 'wishlist', Icon: Heart },
  { label: 'Livechat', href: '#/livechat', page: 'livechat', Icon: MessageCircle },
] as const

export default function BottomNav({ activePage }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {navigationItems.map(({ label, href, page, Icon }) => (
        <a
          className={`bottom-nav-link${activePage === page ? ' is-active' : ''}`}
          href={href}
          key={page}
          aria-current={activePage === page ? 'page' : undefined}
          data-navigation-item={page}
        >
          <Icon size={19} strokeWidth={1.7} aria-hidden="true" />
          <span>{label}</span>
        </a>
      ))}
    </nav>
  )
}
