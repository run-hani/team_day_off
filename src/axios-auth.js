import axios from 'axios'
import Router from "./router";
import { mapActions } from 'vuex'

const instance = axios.create({
  baseURL: 'https://www.googleapis.com/identitytoolkit/v3/relyingparty'
})

// instance.defaults.headers.common['SOMETHING'] = 'something'

export default instance
