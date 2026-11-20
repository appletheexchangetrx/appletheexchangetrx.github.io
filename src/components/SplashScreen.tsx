type SplashScreenProps = {
  label?: string
}

export default function SplashScreen({ label = 'Apple The Exchange TRX' }: SplashScreenProps) {
  return (
    <div className="splash-screen" role="status" aria-label="Loading application">
      <img className="splash-logo" src="https://axednjikcambzbkxyqpp.supabase.co/storage/v1/object/public/images/logo.png" alt="Apple The Exchange TRX" />
      <p className="splash-label">{label}</p>
    </div>
  )
}
