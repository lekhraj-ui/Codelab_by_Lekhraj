import { createContext, useContext, useEffect, useState } from "react";
import { connectSocket, disconnectSocket } from "../services/socket.service";

export interface LocalUser { uid:string; email:string|null; displayName:string|null; photoURL:string|null; emailVerified:boolean; }
interface AuthContextType { user: LocalUser | null; loading:boolean; setUser:(user:LocalUser|null)=>void; }
const AuthContext=createContext<AuthContextType>({user:null,loading:true,setUser:()=>{}});
export function AuthProvider({children}:{children:React.ReactNode}){
 const [user,setUser]=useState<LocalUser|null>(()=>{try{const x=localStorage.getItem("user");return x?JSON.parse(x):null;}catch{return null;}});
 const [loading,setLoading]=useState(true);
 useEffect(()=>{
  if(!user){ const guest={uid:`local-${crypto.randomUUID()}`,email:"local@lekhraj-codelab.local",displayName:"Local Developer",photoURL:null,emailVerified:true}; localStorage.setItem("user",JSON.stringify(guest)); setUser(guest); connectSocket(guest.uid); }
  else { connectSocket(user.uid); }
  setLoading(false);
  return()=>disconnectSocket();
  // The initial local session is intentionally established once.
  // eslint-disable-next-line react-hooks/exhaustive-deps
 },[]);
 const updateUser=(next:LocalUser|null)=>{ if(next) localStorage.setItem("user",JSON.stringify(next)); else localStorage.removeItem("user"); setUser(next); };
 return <AuthContext.Provider value={{user,loading,setUser:updateUser}}>{!loading&&children}</AuthContext.Provider>;
}
export const useAuth=()=>useContext(AuthContext);
