import { API_URL } from '@/common'
import AuthUtils from '@/utils/AuthUtils'

const bid = {
  create: async (data) => {
    const response = await fetch(`${API_URL}/bids`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...AuthUtils.getAuthHeader()
      },
    })

    if (response.ok) {
      const bids = await response.json()
      return bids
    } else {
      throw new Error('Failed to create item')
    }
  },
  getItemBids: async (itemId) => {
    const response = await fetch(`${API_URL}/bids/item/${itemId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...AuthUtils.getAuthHeader()
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
