import constant from '../common/constant'

const category = {
  getAllCategory: async (token, role) => {
    const response = await fetch(`${constant.apiDomain}/Category/role?role=${role}`, {
      method: 'GET',
      headers: {
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

  getAllCategoryActive: async (token) => {
    const response = await fetch(`${constant.apiDomain}/Category/active`, {
      method: 'GET',
      headers: {
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

  getAllItemByCategoryId: async (id, token, pageNumber) => {
    const response = await fetch(`${constant.apiDomain}/category/${id}/${pageNumber}`, {
      method: 'GET',
      headers: {
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
  update: async (data, token) => {
    const response = await fetch(`${constant.apiDomain}/category/update`, {
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
    const response = await fetch(`${constant.apiDomain}/category/create`, {
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
