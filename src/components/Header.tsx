export default function Header() {
  return (
    <header className="app-header">
      <span className="app-eyebrow">THE EXCHANGE TRX · KUALA LUMPUR</span>
      <nav className="header-actions" aria-label="Account and shopping">
        <a className="header-action" href="#cart" aria-label="Cart">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 1.9-1.4L22 8H6" />
            <circle cx="10" cy="20" r="1" />
            <circle cx="18" cy="20" r="1" />
          </svg>
          <span>Cart</span>
        </a>
        <a className="header-action" href="#account" aria-label="Profile">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="8" r="3.5" />
            <path d="M5 21a7 7 0 0 1 14 0" />
          </svg>
          <span>Profile</span>
        </a>
      </nav>
    </header>
  )
}
