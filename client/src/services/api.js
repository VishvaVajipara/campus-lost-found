import axios from 'axios';

// One Axios instance used by the whole app. The base URL comes from the .env file.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Before every request, attach the saved login token (if there is one)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Turns an Axios error into a message we can show to the user
export const getErrorMessage = (error) => {
  if (error.response) {
    return error.response.data?.message || 'Something went wrong. Please try again.';
  }
  return 'Cannot reach the server. Please check your connection and try again.';
};

export default api;
