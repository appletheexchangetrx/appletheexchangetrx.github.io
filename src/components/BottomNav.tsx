import { House, LayoutGrid, MessageCircle } from 'lucide-react'

type BottomNavProps = {
  activePage: 'home' | 'products' | 'profile'
}

const navigationItems = [
  { label: 'Home', href: '#/home', page: 'home', Icon: House },
  { label: 'Products', href: '#/products', page: 'products', Icon: LayoutGrid },
  { label: 'Livechat', href: '#/livechat', page: 'livechat', Icon: MessageCircle },
] as const

export default function BottomNav({ activePage }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {navigationItems.map(({ label, href, page, Icon }) => (
        <a
          className={`bottom-nav-link${activePage === page ? ' is-active' : ''}`}
          href={href}
          key={label}
          aria-current={activePage === page ? 'page' : undefined}
        >
          <Icon size={19} strokeWidth={1.7} aria-hidden="true" />
          <span>{label}</span>
        </a>
      ))}
    </nav>
  )
}
