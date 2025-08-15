const errorMessages = {
  userName: {
    required: 'Username is required',
  },
  passWord: {
    required: 'Password is required',
  },
  email: {
    required: 'Email is required',
    isValid: 'Email must be a valid email',
  },
  fullName: {
    required: 'FullName is required',
  },
  phoneNumber: {
    required: 'PhoneNumber is required',
  },
  address: {
    required: 'Address is required',
  },
  amount: {
    required: 'Please enter amount',
    isValid: 'The amount must be greater than the sum of Current bid and Min increase',
  },
  name: {
    required: 'Name is required',
    isValid: 'Name is duplicated',
  },
  description: {
    required: 'Description is required',
  },
  imageFile: {
    required: 'Image file is required',
  },
  minIncreasePrice: {
    required: 'Min increase price is required',
    isValid: 'Min increase price should be an integer',
  },
  currentBidPrice: {
    required: 'Starting bid price is required',
    isValid: 'Starting bid price should be an integer',
  },
  auctionStartDate: {
    required: 'Start date is required',
    isValid: 'Start date must be later than today',
  },
  auctionEndDate: {
    required: 'End date is required',
    isValid: 'End date must be the same as or later than the start date',
  },
}

export default errorMessages
