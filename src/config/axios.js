import axios from 'axios';
import { API_URL } from '@/common';
import { STORAGE_KEYS } from '@/common/storage-key';

// Create axios instance for public endpoints
const publicApiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create axios instance for authenticated endpoints
const authApiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for authenticated client to add auth token
authApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh for authenticated client
authApiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        
        if (!refreshToken) {
          // No refresh token available, redirect to login
          clearAuthData();
          window.location.href = '/login';
          return Promise.reject(error);
        }

        // Try to refresh the token using public client (no auth needed for refresh)
        const refreshResponse = await publicApiClient.post('/auth/refresh', {
          token: refreshToken
        });

        if (refreshResponse.data && refreshResponse.data.result && refreshResponse.data.result.accessToken) {
          // Update tokens in localStorage
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, refreshResponse.data.result.accessToken);
          
          if (refreshResponse.data.result.refreshToken) {
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshResponse.data.result.refreshToken);
          }

          // Update the authorization header and retry the original request
          originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.result.accessToken}`;
          return authApiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        clearAuthData();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Helper function to set auth token
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  } else {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  }
};

// Helper function to set refresh token
export const setRefreshToken = (token) => {
  if (token) {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  } else {
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  }
};

// Helper function to clear all auth data
export const clearAuthData = () => {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_DATA);
};

// Export both clients
export { publicApiClient, authApiClient };

// Default export for backward compatibility (use authApiClient as default)
export default authApiClient;
