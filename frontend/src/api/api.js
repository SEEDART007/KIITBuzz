import axios from "axios";

// Base URL of your backend
const api = axios.create({
  baseURL: "http://localhost:5000/api", // replace with your backend URL
});

// Automatically attach JWT token from localStorage
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
