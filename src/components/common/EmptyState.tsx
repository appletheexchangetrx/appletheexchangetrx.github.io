import type { ReactNode } from 'react'
type Props={title:string;description?:string;action?:ReactNode}
export default function EmptyState({title,description,action}:Props){return <section className="ui-state"><span aria-hidden="true">◇</span><h2>{title}</h2>{description&&<p>{description}</p>}{action}</section>}