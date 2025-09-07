import { publicApiClient, authApiClient, clearAuthData } from '@/config/axios';

const authentication = {
  authenticate: async (username, password) => {
    try {
      const response = await publicApiClient.post('/auth/token', { username, password });
      return response.data.result || null;
    } catch (error) {
      throw new Error('Failed to authenticate data');
    }
  },

  login: async (username, password) => {
    try {
      const response = await publicApiClient.post('/auth/login', { username, password });
      return response.data.result || null;
    } catch (error) {
      throw new Error('Failed to login');
    }
  },

  register: async (username, password) => {
    try {
      const response = await publicApiClient.post('/auth/register', { username, password });
      return response.data.result || null;
    } catch (error) {
      throw new Error('Failed to register');
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await publicApiClient.post('/auth/forgot-password', { email });
      return response.data.result || null;
    } catch (error) {
      throw new Error('Failed to send password reset email');
    }
  },

  resetPassword: async (token, newPassword) => {
    try {
      const response = await publicApiClient.post('/auth/reset-password', { token, newPassword });
      return response.data.result || null;
    } catch (error) {
      throw new Error('Failed to reset password');
    }
  },

  refreshToken: async (token) => {
    try {
      const response = await publicApiClient.post('/auth/refresh', { token });
      return response.data.result || null;
    } catch (error) {
      throw new Error('Failed to refresh token');
    }
  },

  logout: async (token) => {
    try {
      const response = await authApiClient.post('/auth/logout', { token });
      clearAuthData();
      return response.data.result || null;
    } catch (error) {
      clearAuthData();
      throw new Error('Failed to logout');
    }
  },

  introspect: async (token) => {
    try {
      const response = await authApiClient.post('/auth/introspect', { token });
      return response.data.result || null;
    } catch (error) {
      throw new Error('Failed to introspect token');
    }
  },
  
  validateToken: async (token) => {
    try {
      const response = await authApiClient.post('/auth/validate-token', { token });
      return response.data.result || null;
    } catch (error) {
      throw new Error('Failed to validate token');
    }
  },

  changePassword: async (token, oldPassword, newPassword) => {
    try {
      const response = await authApiClient.post('/auth/change-password', { token, oldPassword, newPassword });
      return response.data.result || null;
    } catch (error) {
      throw new Error('Failed to change password');
    }
  }
}
export default authentication
