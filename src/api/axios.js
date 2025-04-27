// src/api/axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  withCredentials: true, 
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("Axios token being sent:", token); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
