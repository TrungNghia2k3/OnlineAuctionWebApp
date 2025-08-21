import {API_URL} from '@/common/'

const rating = {
  update: async (data, token) => {
    const response = await fetch(`${API_URL}/rating/update`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.ok) {
      const content = await response.json()
      return content
    } else {
      throw new Error('Failed to create item')
    }
  },

  getAllRating: async (token) => {
    const response = await fetch(`${API_URL}/Rating`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.ok) {
      const categories = await response.json()
      return categories
    } else {
      throw new Error('Failed to get categories')
    }
  },
}

export default rating
