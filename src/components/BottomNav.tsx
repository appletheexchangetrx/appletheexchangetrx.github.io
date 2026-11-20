const navigationItems = [
  { label: 'Home', href: '#home' },
  { label: 'Products', href: '#products' },
  { label: 'Updates', href: '#updates' },
  { label: 'Account', href: '#account' },
]

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {navigationItems.map((item) => (
        <a className="bottom-nav-link" href={item.href} key={item.label}>
          {item.label}
        </a>
      ))}
    </nav>
  )
}
