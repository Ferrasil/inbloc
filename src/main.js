// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// eslint-disable-next-line
import contract from 'truffle-contract'
import firebase from '@/firebase'
import VueMoment from 'vue-moment'
import Vue from 'vue'

import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import colors from 'vuetify/es5/util/colors'
import 'vuetify/dist/vuetify.min.css'
import { store } from './store'
const MetaMaskCmp = () => import('./components/Shared/MetaMask.vue')
const AlertCmp = () => import('./components/Shared/Alert.vue')
Vue.use(VueMoment)
Vue.use(Vuetify, {
  theme: {
    primary: '#000000',
    secondary: '#6baff5',
    lightgray: '#545454',
    black: '#000000',
    accent: '#cfe1f5',
    error: '#b71c1c'
  }
})

Vue.config.productionTip = false
Vue.component('app-metamask', MetaMaskCmp)
Vue.component('app-alert', AlertCmp)

// router.beforeEach((to, from, next) => {
//   const currentUser = firebase.auth().currentUser
//   const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
//   if (requiresAuth && !currentUser) {
//     next('/signin')
//   } else if (requiresAuth && currentUser) {
//     next()
//   } else {
//     next()
//   }
// })
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  theme: {
    primary: colors.red.darken1, // #E53935
    secondary: colors.red.lighten4, // #FFCDD2
    accent: colors.indigo.base // #3F51B5
  },
  created () {
    firebase.auth().onAuthStateChanged((user) => {
      let str = this.$store
      if (user) {
        str.dispatch('autoSignIn', user)
        str.dispatch('setLoad', true)
        const insurers = str.dispatch('getInsurers')
        const assessors = str.dispatch('getAssessors')
        const contract = str.dispatch('getContractInstance', user.uid)
        Promise.all([insurers, assessors, contract]).then((values) => {
          str.dispatch('setLoad', false)
        })
      }
    })
  }
})
