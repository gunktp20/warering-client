import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_DOMAIN,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosPrivate = axios.create({
  baseURL: import.meta.env.VITE_API_DOMAIN,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api;
