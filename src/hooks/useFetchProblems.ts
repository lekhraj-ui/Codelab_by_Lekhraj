import axios from "axios";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api";
interface Problem { _id:string; title:string; difficulty:string; }
export default function useFetchProblems(){
 const [problems,setProblems]=useState<Problem[]>([]); const [error,setError]=useState<string|null>(null);
 useEffect(()=>{axios.get(`${API_BASE_URL}/api/v1/problems`).then(r=>setProblems(r.data.data)).catch(()=>setError("Failed to fetch problems. Is the backend running?"));},[]);
 return {problems,error};
}
