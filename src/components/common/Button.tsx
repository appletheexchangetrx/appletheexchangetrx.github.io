import type { ButtonHTMLAttributes, ReactNode } from 'react'
type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost'; children: ReactNode }
export default function Button({ variant='primary', className='', children, ...props }: Props) {
  return <button className={`ui-button ui-button--${variant} ${className}`.trim()} {...props}>{children}</button>
}