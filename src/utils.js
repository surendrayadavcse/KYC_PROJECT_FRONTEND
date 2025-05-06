import axios from 'axios';

export const baseUrl = import.meta.env.VITE_API_BASE_URL;
console.log(baseUrl)

const instance = axios.create({
  baseURL: baseUrl,
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
