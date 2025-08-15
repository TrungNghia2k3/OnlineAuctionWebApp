import constant from '../common/constant'

const bid = {
  create: async (data, token) => {
    const response = await fetch(`${constant.apiDomain}/bid/create`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.ok) {
      const bids = await response.json()
      return bids
    } else {
      throw new Error('Failed to create item')
    }
  },
  GetAllBid: async (token, itemId) => {
    const response = await fetch(`${constant.apiDomain}/bid/${itemId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.ok) {
      const bids = await response.json()
      return bids
    } else {
      throw new Error('Failed to get bids')
    }
  },
}
export default bid
