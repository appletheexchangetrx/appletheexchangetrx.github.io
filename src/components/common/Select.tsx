import type { SelectHTMLAttributes } from 'react'
type Props = SelectHTMLAttributes<HTMLSelectElement> & { label?: string; options: Array<{label:string;value:string}> }
export default function Select({label,options,...props}:Props) {
  return <label className="ui-field">{label && <span>{label}</span>}<select {...props}>{options.map(option=><option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
}