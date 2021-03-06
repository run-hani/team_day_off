// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'

import firebase from 'firebase'
import FullCalendar from 'vue-full-calendar'

import './assets/css/style.css'
import './assets/css/fullcalendar.css'

axios.defaults.baseURL = 'https://friends-vacation.firebaseio.com'
axios.defaults.headers.get['Accepts'] = 'application/json'
axios.defaults.headers.delete['Accepts'] = 'application/json'

Vue.config.productionTip = false

var config = {
  apiKey: "AIzaSyA7Y7nQMtyX-XwzBvo2dSIZPAu_IHtFoVg",
  authDomain: "friends-vacation.firebaseapp.com",
  databaseURL: "https://friends-vacation.firebaseio.com",
  projectId: "friends-vacation",
  storageBucket: "friends-vacation.appspot.com",
  messagingSenderId: "401496203285"
};

firebase.initializeApp(config);

Vue.use(FullCalendar)
window.jQuery = window.$ = require('jquery')

axios.interceptors.response.use(res =>
  {
    return res;
  },
  error => {
  let err = error.response

  if (err.status === 401) {
    store.dispatch('logout')
    router.push({name: 'Signin'})
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
