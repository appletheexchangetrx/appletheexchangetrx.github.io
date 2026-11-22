import type { WishlistRecord } from '../types/wishlist'
const KEY='aet-wishlist-v1'
export function readWishlist():string[]{try{const value:unknown=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(value)?value.filter((id):id is string=>typeof id==='string'):[]}catch{return []}}
export function writeWishlist(ids:string[]):void{try{const record:WishlistRecord={version:1,ids:[...new Set(ids)]};localStorage.setItem(KEY,JSON.stringify(record.ids))}catch{/* In-memory wishlist remains available. */}}