type StandalonePagesProps = {
  pathname: string
}

export default function StandalonePages({ pathname }: StandalonePagesProps) {
  if (pathname === '/' || pathname === '/index.html') return null

  return (
    <main className="standalone-page">
      <p className="standalone-code">404</p>
      <h1>Page not found</h1>
      <p className="standalone-description">
        The page you are looking for does not exist or may have moved.
      </p>
      <a className="standalone-link" href="/">Back to home</a>
    </main>
  )
}
