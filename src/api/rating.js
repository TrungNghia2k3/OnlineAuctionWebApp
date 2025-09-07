import { authApiClient } from '@/config/axios';

const rating = {
  update: async (data) => {
    try {
      const response = await authApiClient.post('/rating/update', data);
      return response.data.result;
    } catch (error) {
      throw new Error('Failed to create item');
    }
  },

  getAllRating: async () => {
    try {
      const response = await authApiClient.get('/Rating');
      return response.data.result;
    } catch (error) {
      throw new Error('Failed to get categories');
    }
  },
}

export default rating
