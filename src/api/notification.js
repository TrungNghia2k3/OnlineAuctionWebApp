import {API_URL} from '@/common'

const notification = {
  getAllNotificationsByIdUser: async (token) => {
    const response = await fetch(`${API_URL}/notification`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.ok) {
      const content = await response.json()
      return content
    } else {
      throw new Error('Failed to found notification')
    }
  },

  updateNotification: async (token) => {
    const response = await fetch(`${API_URL}/notification/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.ok) {
      const content = await response.json()
      return content
    } else {
      throw new Error('Failed to found notification')
    }
  },
}
export default notification
