import Vue from 'vue'
import Vuex from 'vuex'
import axios from '../axios-auth'
import globalAxios from 'axios'
import Router from '../router'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    idToken: null,
    userId: null,
    user: null
  },
  mutations: {
    authUser (state, userData) {
      state.idToken = userData.token
      state.userId = userData.userId
    },
    storeUser (state, user) {
      state.user = user
    },
    clearAuthData (state) {
      state.idToken = null
      state.userId = null
      state.user = null
    }
  },
  actions: {
    setLogoutTimer ({commit}, expirationTime) {
      setTimeout(() => {
        commit('clearAuthData')
      }, expirationTime * 1000)
    },
    signup ({commit, dispatch}, authData) {
      axios.post('/signupNewUser?key=AIzaSyA7Y7nQMtyX-XwzBvo2dSIZPAu_IHtFoVg', {
        email: authData.email,
        password: authData.password,
        returnSecureToken: true
      })
        .then(res => {
          console.log(res)
          alert("가입이 완료되었습니다.")
          Router.push({ name: 'Signin' })
          // commit('authUser', {
          //   token: res.data.idToken,
          //   userId: res.data.localId
          // })
          // const now = new Date()
          // const expirationDate = new Date(now.getTime() + 100000000)
          // localStorage.setItem('token', res.data.idToken)
          // localStorage.setItem('userId', res.data.localId)
          // localStorage.setItem('expirationDate', expirationDate)
           dispatch('storeUser', authData)
          // dispatch('setLogoutTimer', res.data.expiresIn)
        })
        .catch((error) => {
          let err = error.response
          if (err.status === 400) {
            alert("동일한 이메일로 가입된 계정이 존재합니다.")
          }
        })
    },
    login ({commit, dispatch}, authData) {
      axios.post('/verifyPassword?key=AIzaSyA7Y7nQMtyX-XwzBvo2dSIZPAu_IHtFoVg', {
        email: authData.email,
        password: authData.password,
        returnSecureToken: true
      })
        .then(res => {
          //console.log(res)
          const now = new Date()
          const expirationDate = new Date(now.getTime() + res.data.expiresIn * 1000)
          localStorage.setItem('token', res.data.idToken)
          localStorage.setItem('userId', res.data.localId)
          localStorage.setItem('expirationDate', expirationDate)
          commit('authUser', {
            token: res.data.idToken,
            userId: res.data.localId
          })
          dispatch('setLogoutTimer', res.data.expiresIn)
          dispatch('fetchUser')
          Router.push({ name: 'VacationAdd' })
        })
        .catch((error) => {
          let err = error.response
          if (err) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            //console.log(error.response.data);
            //console.log(error.response.status);
            //console.log(error.response.headers);

            if (err.status === 400) {
              switch(err.data.error.message) {
                case "EMAIL_NOT_FOUND":
                  alert("해당 이메일을 찾을 수 없습니다.")
                  break;
                case "INVALID_PASSWORD":
                  alert("비밀번호가 틀렸습니다.");
                  break
                default:
                  alert(err.data.error.message);
                  break
              }
            }
          }
        })
    },
    tryAutoLogin ({commit, dispatch}) {
      const token = localStorage.getItem('token')
      if (!token) {
        return
      }
      const expirationDate = localStorage.getItem('expirationDate')
      const _expireDate = new Date(expirationDate)
      const now = new Date()

      if (now.getTime() >= _expireDate.getTime()) {
        dispatch('logout')
        return
      }
      const userId = localStorage.getItem('userId')
      commit('authUser', {
        token: token,
        userId: userId
      })
    },
    logout ({commit}) {
      commit('clearAuthData')
      localStorage.removeItem('expirationDate')
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      Router.push({ name: 'Signin' })
    },
    storeUser ({commit, state}, userData) {
      if (!state.idToken) {
        return
      }
      globalAxios.post('/users.json' + '?auth=' + state.idToken, userData)
        .then((res) => {
          //console.log(res)
        })
        .catch(error => console.log(error))
    },
    fetchUser ({commit, state}) {
      if (!state.idToken) {
        return
      }
      globalAxios.get('/users.json' + '?auth=' + state.idToken)
        .then(res => {
          //console.log(res)
          const data = res.data
          const users = []
          for (let key in data) {
            const user = data[key]
            user.id = key
            users.push(user)
          }
          //console.log(users)
          commit('storeUser', users[0])
        })
        .catch(error => console.log(error))
    }
  },
  getters: {
    user (state) {
      return state.user
    },
    isAuthenticated (state) {
      return state.idToken !== null
    }
  }
})

export default store
