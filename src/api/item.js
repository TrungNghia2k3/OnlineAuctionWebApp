import { publicApiClient, authApiClient } from '@/config/axios';

const item = {
  getAllItem: async () => {
    try {
      const response = await publicApiClient.get('/items');
      return response.data.result;
    } catch (error) {
      throw new Error('Failed to get items');
    }
  },

  getAllItemPublic: async () => {
    try {
      const response = await publicApiClient.get('/items');
      return response.data.result;
    } catch (error) {
      throw new Error('Failed to get public items');
    }
  },

  getById: async (id) => {
    try {
      const response = await publicApiClient.get(`/items/${id}`);
      return response.data.result;
    } catch (error) {
      throw new Error('Failed to found item');
    }
  },

  create: async (data) => {
    try {
      const response = await authApiClient.post('/items', data);
      return response.data.result;
    } catch (error) {
      throw new Error('Failed to create item');
    }
  },

  update: async (data) => {
    try {
      const response = await authApiClient.put('/items/update', data);
      return response.data.result;
    } catch (error) {
      throw new Error('Failed to update item');
    }
  },

  searchItem: async (data) => {
    try {
      const response = await publicApiClient.get(`/items/search?keyword=${data}`);
      return response.data.result;
    } catch (error) {
      throw new Error('Failed to found item');
    }
  },

  getItemByUserId: async () => {
    try {
      const response = await authApiClient.get('/items/myitems');
      return response.data.result;
    } catch (error) {
      throw new Error('Failed to found item');
    }
  },

  getStatisticsItem: async (data) => {
    try {
      const response = await authApiClient.post('/items/report', data);
      return response.data.result;
    } catch (error) {
      throw new Error('Failed to found item');
    }
  },
}
export default item
