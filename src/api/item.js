import constant from '../common/constant'

const item = {
  getAllItem: async (token) => {
    const response = await fetch(`${constant.apiDomain}/items`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.ok) {
      const result = await response.json()
      return result
    } else {
      throw new Error('Failed to get items')
    }
  },

  getAllItemPublic: async () => {
    const response = await fetch(`${constant.apiDomain}/items`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      const result = await response.json()
      return result
    } else {
      throw new Error('Failed to get public items')
    }
  },

  getById: async (id) => {
    const response = await fetch(`${constant.apiDomain}/items/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
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
    const response = await fetch(`${constant.apiDomain}/items`, {
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
    const response = await fetch(`${constant.apiDomain}/items/update`, {
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

  searchItem: async (data) => {
    const response = await fetch(`${constant.apiDomain}/items/search?keyword=${data}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })

    if (response.ok) {
      const content = await response.json()
      return content
    } else {
      throw new Error('Failed to found item')
    }
  },

  getItemByUserId: async () => {
    const response = await fetch(`${constant.apiDomain}/items/myitems`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })

    if (response.ok) {
      const content = await response.json()
      return content
    } else {
      throw new Error('Failed to found item')
    }
  },

  getStatisticsItem: async (data) => {
    const response = await fetch(`${constant.apiDomain}/items/report`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
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
