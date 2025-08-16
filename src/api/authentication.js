import constant from '../common/constant'

const authentication = {
  authenticate: async (username, password) => {
    const response = await fetch(`${constant.apiDomain}/auth/token`, {
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
  }
}
export default authentication
