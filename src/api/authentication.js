import {API_URL} from '@/common'

const authentication = {
  authenticate: async (username, password) => {
    const response = await fetch(`${API_URL}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })

    if (response.ok) {
      const content = await response.json()
      return content ? content : null
    } else {
      throw new Error('Failed to authenticate data')
    }
  },

  login: async (username, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })

    if (response.ok) {
      const content = await response.json()
      return content ? content : null
    } else {
      throw new Error('Failed to login')
    }
  },

  register: async (username, password) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })

    if (response.ok) {
      const content = await response.json()
      return content ? content : null
    } else {
      throw new Error('Failed to register')
    }
  },

  forgotPassword: async (email) => {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    if (response.ok) {
      const content = await response.json()
      return content ? content : null
    } else {
      throw new Error('Failed to send password reset email')
    }
  },

  resetPassword: async (token, newPassword) => {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, newPassword }),
    })

    if (response.ok) {
      const content = await response.json()
      return content ? content : null
    } else {
      throw new Error('Failed to reset password')
    }
  },

  refreshToken: async (token) => {
    const response = await fetch(`${API_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    })

    if (response.ok) {
      const content = await response.json()
      return content ? content : null
    } else {
      throw new Error('Failed to refresh token')
    }
  },
  
  validateToken: async (token) => {
    const response = await fetch(`${API_URL}/auth/validate-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    })

    if (response.ok) {
      const content = await response.json()
      return content ? content : null
    } else {
      throw new Error('Failed to validate token')
    }
  },

  changePassword: async (token, oldPassword, newPassword) => {
    const response = await fetch(`${API_URL}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, oldPassword, newPassword }),
    })

    if (response.ok) {
      const content = await response.json()
      return content ? content : null
    } else {
      throw new Error('Failed to change password')
    }
  }
}
export default authentication
