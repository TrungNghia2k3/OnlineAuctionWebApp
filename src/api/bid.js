import { authApiClient } from '@/config/axios';

const bid = {
  create: async (data) => {
    try {
      const response = await authApiClient.post('/bids', data);
      return response.data.result;
    } catch (error) {
      throw new Error('Failed to create item');
    }
  },

  getItemBids: async (itemId) => {
    try {
      const response = await authApiClient.get(`/bids/item/${itemId}`);
      return response.data.result;
    } catch (error) {
      throw new Error('Failed to get bids');
    }
  },
}
export default bid
