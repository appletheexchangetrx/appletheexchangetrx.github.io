export default function NotFoundPage() {
  return (
    <section className="not-found-page" aria-labelledby="not-found-title">
      <span className="not-found-code" aria-hidden="true">404</span>
      <h2 id="not-found-title">We couldn’t find that page</h2>
      <p>The link may be incorrect, or the page may have moved.</p>
      <a className="not-found-home" href="#/home">Return to Home</a>
    </section>
  )
}
