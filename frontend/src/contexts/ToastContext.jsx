import { createContext, useContext, useState } from 'react';
import Icon from '../components/Icon.jsx';
const ToastContext=createContext(null);
export function ToastProvider({children}){const [toasts,setToasts]=useState([]);const notify=(message,type='success')=>{const id=Date.now()+Math.random();setToasts(x=>[...x,{id,message,type}]);setTimeout(()=>setToasts(x=>x.filter(t=>t.id!==id)),3500)};return <ToastContext.Provider value={{notify}}>{children}<div className="toast-stack">{toasts.map(t=><div className={`app-toast toast-${t.type}`} key={t.id}><Icon name={t.type==='success'?'shield':'spark'} size={18}/><span>{t.message}</span><button onClick={()=>setToasts(x=>x.filter(v=>v.id!==t.id))}><Icon name="close" size={16}/></button></div>)}</div></ToastContext.Provider>}
export const useToast=()=>useContext(ToastContext);

