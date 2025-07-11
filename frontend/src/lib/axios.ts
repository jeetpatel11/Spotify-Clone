import axios from 'axios';

declare global {
  interface Window {
    Clerk?: any;
  }
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === 'development'
    ? 'http://localhost:5000/api'
    : import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(async (config) => {
  // Check if we're in a browser and Clerk is loaded
  const token = await window.Clerk?.session?.getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export { axiosInstance };
