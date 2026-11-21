import { ArrowLeft } from 'lucide-react'

type StandaloneHeaderProps = {
  title: string
}

export default function StandaloneHeader({ title }: StandaloneHeaderProps) {
  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back()
      return
    }

    window.location.hash = '#/home'
  }

  return (
    <header className="standalone-header">
      <button className="standalone-back" type="button" onClick={handleBack} aria-label="Back">
        <ArrowLeft size={21} strokeWidth={1.8} aria-hidden="true" />
      </button>
      <h1 className="standalone-title">{title}</h1>
    </header>
  )
}
