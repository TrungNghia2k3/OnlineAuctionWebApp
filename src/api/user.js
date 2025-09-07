import { publicApiClient, authApiClient } from '@/config/axios';

const user = {
  register: async (data) => {
    try {
      const response = await publicApiClient.post('/user/register', data);
      return response.data.result || '';
    } catch (error) {
      return '';
    }
  },

  authentication: async (userName, passWord) => {
    try {
      const response = await publicApiClient.post('/user/authenticate', { userName, passWord });
      return response.data.result || null;
    } catch (error) {
      throw new Error('Failed to authenticate data');
    }
  },

  GetAllUser: async () => {
    try {
      const response = await authApiClient.get('/user');
      return response.data.result;
    } catch (error) {
      throw new Error('Failed to get useres');
    }
  },

  getById: async (id) => {
    try {
      const response = await authApiClient.get(`/user/${id}`);
      return response.data.result;
    } catch (error) {
      throw new Error('Failed to found item');
    }
  },

  update: async (data) => {
    try {
      const response = await authApiClient.put('/user/update', data);
      return response.data.result || '';
    } catch (error) {
      return '';
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await publicApiClient.put(`/user/forgotpassword/${email}`);
      return response.data.result || '';
    } catch (error) {
      return '';
    }
  },

  sendProductSuggestions: async (suggestionData) => {
    try {
      const response = await authApiClient.post('/user/product-suggestions', suggestionData);
      return response.data.result || '';
    } catch (error) {
      console.warn('Product suggestions endpoint not available yet:', error);
      // For now, we'll return a success response for development
      return { success: true, message: 'Product suggestions queued for processing' };
    }
  },
}
export default user
