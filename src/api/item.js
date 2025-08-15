import constant from '../common/constant'

const item = {
  getAllItem: async (token) => {
    const response = await fetch(`${constant.apiDomain}/item`, {
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

  getById: async (id, token) => {
    const response = await fetch(`${constant.apiDomain}/item/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.ok) {
      const content = await response.json()
      return content
    } else {
      throw new Error('Failed to found item')
    }
  },

  create: async (data, token) => {
    const response = await fetch(`${constant.apiDomain}/item/create`, {
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

  update: async (data, token) => {
    const response = await fetch(`${constant.apiDomain}/item/update`, {
      method: 'PUT',
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
      throw new Error('Failed to update item')
    }
  },

  searchItem: async (data, token) => {
    const response = await fetch(`${constant.apiDomain}/Item/search?keyword=${data}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.ok) {
      const content = await response.json()
      return content
    } else {
      throw new Error('Failed to found item')
    }
  },

  getItemByUserId: async (token) => {
    const response = await fetch(`${constant.apiDomain}/Item/myitems`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.ok) {
      const content = await response.json()
      return content
    } else {
      throw new Error('Failed to found item')
    }
  },

  getStatisticsItem: async (data, token) => {
    const response = await fetch(`${constant.apiDomain}/item/report`, {
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
      throw new Error('Failed to found item')
    }
  },
}
export default item
