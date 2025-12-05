import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the auth token
axiosClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { refreshToken, setTokens, logout } = useAuthStore.getState();

    // If the error is 401 and it's not a retry, try to refresh the token
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!refreshToken) {
        logout();
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh`, {
          // Axios doesn't have a way to pass headers for a specific request without an interceptor
          // So we create a new instance or a one-off request
        }, {
          headers: { 'Authorization': `Bearer ` }
        });
        
        setTokens(data.access_token, refreshToken);
        axiosClient.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
        originalRequest.headers['Authorization'] = `Bearer ${data.access_token}`;
        
        return axiosClient(originalRequest);
      } catch (refreshError) {
        logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
