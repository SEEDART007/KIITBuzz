import axios from "axios";

// Base URL of your backend
const api = axios.create({
  baseURL: "http://localhost:3000/api/v1", // replace with your backend URL
});

// Automatically attach JWT token from localStorage
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
