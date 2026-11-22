import type { HTMLAttributes, ReactNode } from 'react'
type Props = HTMLAttributes<HTMLSpanElement> & { tone?: 'neutral'|'success'|'warning'|'danger'; children: ReactNode }
export default function Badge({tone='neutral',children,...props}:Props) { return <span className={`ui-badge ui-badge--${tone}`} {...props}>{children}</span> }