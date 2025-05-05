
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:9999/api', // your backend URL
});

// Automatically attach JWT token to every request if available
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
export const getUserId = () => localStorage.getItem("id");

export const baseUrl = import.meta.env.VITE_API_BASE_URL;





