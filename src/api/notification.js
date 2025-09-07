import { authApiClient } from '@/config/axios';

const notification = {
  getAllNotificationsByIdUser: async () => {
    try {
      const response = await authApiClient.get('/notification');
      return response.data.result;
    } catch (error) {
      throw new Error('Failed to found notification');
    }
  },

  updateNotification: async () => {
    try {
      const response = await authApiClient.put('/notification/update');
      return response.data.result;
    } catch (error) {
      throw new Error('Failed to found notification');
    }
  },
}
export default notification
