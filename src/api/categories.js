import constant from '../common/constant'

const category = {
  getAllCategory: async () => {
    const response = await fetch(`${constant.apiDomain}/categories`, {
      method: 'GET'
    })

    if (response.ok) {
      const categories = await response.json()
      return categories
    } else {
      throw new Error('Failed to get categories')
    }
  },

  getAllCategoryActive: async (token) => {
    const response = await fetch(`${constant.apiDomain}/categories/active`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })

    if (response.ok) {
      const categories = await response.json()
      return categories
    } else {
      throw new Error('Failed to get categories')
    }
  },

  getAllItemByCategoryId: async () => {
    const response = await fetch(`${constant.apiDomain}/categories`, {
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
  update: async (data, token) => {
    const response = await fetch(`${constant.apiDomain}/categories/update`, {
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
      return null
    }
  },

  create: async (data, token) => {
    const response = await fetch(`${constant.apiDomain}/categories/create`, {
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
export default category
