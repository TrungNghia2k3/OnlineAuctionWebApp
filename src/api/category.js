import { publicApiClient, authApiClient } from '@/config/axios';

const category = {
  getAllCategory: async () => {
    try {
      const response = await publicApiClient.get('/categories');
      return response.data.result;
    } catch (error) {
      throw new Error('Failed to get categories');
    }
  },

  getAllCategoryActive: async () => {
    try {
      const response = await publicApiClient.get('/categories/active');
      return response.data.result;
    } catch (error) {
      throw new Error('Failed to get categories');
    }
  },

  getAllItemByCategoryId: async () => {
    try {
      const response = await publicApiClient.get('/categories');
      return response.data.result;
    } catch (error) {
      throw new Error('Failed to found item');
    }
  },

  update: async (data) => {
    try {
      const response = await authApiClient.put('/categories/update', data);
      return response.data.result;
    } catch (error) {
      return null;
    }
  },

  create: async (data) => {
    try {
      const response = await authApiClient.post('/categories/create', data);
      return response.data.result;
    } catch (error) {
      throw new Error('Failed to create category');
    }
  },
}
export default category
