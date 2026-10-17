import { useNavigate } from "react-router-dom";
import { connectSocket } from "../../services/socket.service";

export default function Login(){
  const navigate=useNavigate();
  const continueOffline=()=>{
    const user={uid:`local-${crypto.randomUUID()}`,email:"local@lekhraj-codelab.local",displayName:"Local Developer",photoURL:null,emailVerified:true};
    localStorage.setItem("user",JSON.stringify(user));
    connectSocket(user.uid);
    navigate("/problems");
  };
  return <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center"><div className="bg-gray-800 p-8 rounded-lg shadow-md w-96"><h2 className="text-2xl font-bold text-white mb-6 text-center">Welcome to Lekhraj CodeLab</h2><p className="text-gray-300 mb-8 text-center">Sign in to start solving coding challenges</p><button onClick={continueOffline} className="w-full btn btn-primary">Continue Offline</button><p className="text-xs text-gray-400 text-center mt-4">Local account mode — no Firebase or internet is required.</p></div></div>;
}
