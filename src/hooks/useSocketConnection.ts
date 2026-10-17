import { useEffect } from "react";

import { useAuth } from "../context/AuthContext";
import { socket } from "../socket";

export function useSocketConnection() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      socket.disconnect();
      return;
    }

    socket.connect();
    socket.emit("setUserId", user.uid);
    console.log("Connected with user:", user.uid);

    return () => {
      socket.disconnect();
    };
  }, [user]);

  return socket;
}
