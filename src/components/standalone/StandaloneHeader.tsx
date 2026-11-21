import { ArrowLeft } from 'lucide-react'

type StandaloneHeaderProps = {
  title: string
  onBack: () => void
}

export default function StandaloneHeader({ title, onBack }: StandaloneHeaderProps) {
  return (
    <header className="standalone-header">
      <button className="standalone-back" type="button" onClick={onBack} aria-label="Back">
        <ArrowLeft size={21} strokeWidth={1.8} aria-hidden="true" />
      </button>
      <h1 className="standalone-title">{title}</h1>
    </header>
  )
}
