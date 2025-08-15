import constant from '../common/constant'

const rating = {
  update: async (data, token) => {
    const response = await fetch(`${constant.apiDomain}/rating/update`, {
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
    const response = await fetch(`${constant.apiDomain}/Rating`, {
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
