import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://vuejs-http-5b038.firebaseio.com'
})

// instance.defaults.headers.common['SOMETHING'] = 'something'

export default instance
