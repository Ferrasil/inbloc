import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
import shared from './shared'
import metamask from './metamask'
import types from './types'
import policies from './policies'
import insurer from './insurer'
import assessors from './assessor'
Vue.use(Vuex)
export const store = new Vuex.Store({
  modules: {
    user: user,
    shared: shared,
    metamask: metamask,
    types: types,
    policies: policies,
    insurers: insurer,
    assessors: assessors
  }
})
