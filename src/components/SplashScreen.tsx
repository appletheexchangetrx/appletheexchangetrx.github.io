type SplashScreenProps = {
  label?: string
}

export default function SplashScreen({ label = 'Apple The Exchange TRX' }: SplashScreenProps) {
  return (
    <div className="splash-screen" role="status" aria-label="Loading application">
      <div className="splash-mark" aria-hidden="true">A</div>
      <p className="splash-label">{label}</p>
    </div>
  )
}
