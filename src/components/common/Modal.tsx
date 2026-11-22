import { useEffect, type ReactNode } from 'react'
type Props = { open:boolean; title:string; onClose:()=>void; children:ReactNode }
export default function Modal({open,title,onClose,children}:Props) {
 useEffect(()=>{ if(!open)return; const key=(event:KeyboardEvent)=>{if(event.key==='Escape')onClose()}; window.addEventListener('keydown',key); return()=>window.removeEventListener('keydown',key)},[open,onClose])
 if(!open)return null
 return <div className="ui-modal-backdrop" onMouseDown={event=>{if(event.target===event.currentTarget)onClose()}}><section className="ui-modal" role="dialog" aria-modal="true" aria-label={title}><header><h2>{title}</h2><button type="button" onClick={onClose} aria-label="Close">×</button></header>{children}</section></div>
}