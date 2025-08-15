const constant = {
  apiDomain: process.env.NODE_ENV === 'development' ? 'https://localhost:7021/api' : 'http://oaapi.runasp.net/api',
}

export default constant
