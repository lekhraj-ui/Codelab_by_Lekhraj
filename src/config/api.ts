const mode = import.meta.env.VITE_API_MODE || "offline";
const offlineBase = import.meta.env.VITE_OFFLINE_API_URL || "http://localhost:3000";
const onlineBase = import.meta.env.VITE_ONLINE_API_URL || "";

export const API_BASE_URL = mode === "online" ? onlineBase : offlineBase;
export const SOCKET_URL = mode === "online" ? (import.meta.env.VITE_ONLINE_SOCKET_URL || onlineBase) : (import.meta.env.VITE_OFFLINE_SOCKET_URL || offlineBase);
export const API_MODE = mode;
