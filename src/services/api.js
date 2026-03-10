import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true
});

export const getAuthBaseUrl = () => {
  const url = import.meta.env.VITE_API_URL;
  if (url) return String(url).replace(/\/api\/?$/, "");
  return window.location.origin;
};

export default api;