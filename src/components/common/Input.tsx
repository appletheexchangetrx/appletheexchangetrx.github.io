import { useId, type InputHTMLAttributes } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement> & { label?: string; hint?: string }

export default function Input({ label, hint, id, ...props }: Props) {
  const generatedId = useId()
  const inputId = id ?? props.name ?? generatedId
  const hintId = hint ? `${inputId}-hint` : undefined

  return (
    <label className="ui-field" htmlFor={inputId}>
      {label && <span>{label}</span>}
      <input id={inputId} aria-describedby={hintId} {...props} />
      {hint && <small id={hintId}>{hint}</small>}
    </label>
  )
}
