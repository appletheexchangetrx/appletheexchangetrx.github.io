import {createContext,useCallback,useContext,useMemo,useState,type ReactNode} from 'react'
import {readWishlist,writeWishlist} from '../services/wishlistStorage'
type Value={ids:string[];has:(id:string)=>boolean;toggle:(id:string)=>void}
const Context=createContext<Value|null>(null)
export function WishlistProvider({children}:{children:ReactNode}){const [ids,setIds]=useState<string[]>(readWishlist);const toggle=useCallback((id:string)=>setIds(current=>{const next=current.includes(id)?current.filter(value=>value!==id):[...current,id];writeWishlist(next);return next}),[]);const has=useCallback((id:string)=>ids.includes(id),[ids]);const value=useMemo(()=>({ids,has,toggle}),[ids,has,toggle]);return <Context.Provider value={value}>{children}</Context.Provider>}
export function useWishlist(){const value=useContext(Context);if(!value)throw new Error('useWishlist must be used inside WishlistProvider');return value}