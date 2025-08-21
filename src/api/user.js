import {API_URL} from '@/common'

const user = {
  register: async (data) => {
    const response = await fetch(`${API_URL}/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    let errorMessage = ''
    if (response.ok) {
      const data = await response.json()
      errorMessage = data.result
    }
    return errorMessage
  },

  authentication: async (userName, passWord) => {
    const response = await fetch(`${API_URL}/user/authenticate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userName, passWord }),
    })

    if (response.ok) {
      const content = await response.json()
      return content ? content : null
    } else {
      throw new Error('Failed to authenticate data')
    }
  },

  GetAllUser: async (token) => {
    const response = await fetch(`${API_URL}/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.ok) {
      const useres = await response.json()
      return useres
    } else {
      throw new Error('Failed to get useres')
    }
  },

  getById: async (id, token) => {
    const response = await fetch(`${API_URL}/user/${id}`, {
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

  update: async (data, token) => {
    const response = await fetch(`${API_URL}/user/update`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    let errorMessage = ''
    if (response.ok) {
      const data = await response.json()
      errorMessage = data.result
    }
    return errorMessage
  },

  forgotPassword: async (email) => {
    const response = await fetch(`${API_URL}/user/forgotpassword/${email}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    let errorMessage = ''
    if (response.ok) {
      const data = await response.json()
      errorMessage = data.result
    }
    return errorMessage
  },
}
export default user
