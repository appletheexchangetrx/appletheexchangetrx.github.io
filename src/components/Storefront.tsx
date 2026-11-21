import { useEffect, useRef, useState } from 'react'
import ProductCatalog from './ProductCatalog'

export default function Storefront() {
  const [activeHero, setActiveHero] = useState(0)
  const heroSliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (document.visibilityState !== 'visible') return

      const slider = heroSliderRef.current
      if (!slider || slider.clientWidth === 0) return

      const currentIndex = Math.round(slider.scrollLeft / slider.clientWidth)
      const nextIndex = (currentIndex + 1) % 3
      slider.scrollTo({
        left: slider.clientWidth * nextIndex,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      })
      setActiveHero(nextIndex)
    }, 4000)

    return () => window.clearInterval(interval)
  }, [])

  return (
    <div className="storefront">
      <section className="storefront-hero-slider" aria-label="Featured promotions">
        <div
          className="storefront-hero-track"
          onScroll={(event) => {
            const slider = event.currentTarget
            setActiveHero(Math.round(slider.scrollLeft / slider.clientWidth))
          }}
          ref={heroSliderRef}
        >
          <article className="storefront-hero storefront-hero-slide storefront-hero-slide-one">
            <div className="storefront-hero-copy">
              <span>THE LATEST FROM APPLE</span>
              <h1>Make room<br />for wonder.</h1>
              <p>Discover the latest Apple products, all in one place.</p>
              <a href="#store-products">Explore now <span aria-hidden="true">↗</span></a>
            </div>
            <div className="storefront-hero-orb" aria-hidden="true">
              <div className="storefront-hero-device" />
            </div>
          </article>
          <article className="storefront-hero storefront-hero-slide storefront-hero-slide-two">
            <div className="storefront-hero-copy">
              <span>POWER YOUR EVERY DAY</span>
              <h1>Big ideas.<br />Small details.</h1>
              <p>Find the Mac and iPad made for the way you create.</p>
              <a href="#store-products">Discover more <span aria-hidden="true">↗</span></a>
            </div>
            <div className="storefront-hero-art storefront-hero-art-laptop" aria-hidden="true">
              <span />
            </div>
          </article>
          <article className="storefront-hero storefront-hero-slide storefront-hero-slide-three">
            <div className="storefront-hero-copy">
              <span>MADE TO MOVE WITH YOU</span>
              <h1>Everyday<br />extraordinary.</h1>
              <p>Explore Apple Watch and AirPods for every moment.</p>
              <a href="#store-products">Shop accessories <span aria-hidden="true">↗</span></a>
            </div>
            <div className="storefront-hero-art storefront-hero-art-watch" aria-hidden="true">
              <span />
            </div>
          </article>
        </div>
        <div className="storefront-hero-pagination" role="group" aria-label="Choose featured slide">
          {[0, 1, 2].map((index) => (
            <button
              key={index}
              type="button"
              className={`storefront-hero-dot${activeHero === index ? ' is-active' : ''}`}
              aria-label={`Show slide ${index + 1}`}
              aria-pressed={activeHero === index}
              onClick={() => {
                const slider = heroSliderRef.current
                if (slider) slider.scrollTo({ left: slider.clientWidth * index, behavior: 'smooth' })
              }}
            />
          ))}
        </div>
      </section>

      <ProductCatalog />

      <section className="storefront-visit">
        <span className="storefront-kicker">COME SAY HELLO</span>
        <h2>Experience Apple<br />at The Exchange TRX.</h2>
        <p>Visit us for personal recommendations and a closer look at your next device.</p>
        <a href="https://www.theexchange.my/" target="_blank" rel="noreferrer">Discover The Exchange TRX ↗</a>
      </section>
      <p className="storefront-disclaimer">Product availability and prices may change.</p>
    </div>
  )
}
