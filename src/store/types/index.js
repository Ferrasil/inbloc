import db from '@/db'
export default {
  state: {
    types: [],
    subtypes: [],
    models: []
  },
  mutations: {
    CLEAR_TYPES (state) {
      state.types = {}
    },
    CLEAR_SUBTYPES (state) {
      state.subtypes = {}
    },
    SET_TYPES (state, { type }) {
      state.types = { ...state.types, [type.id]: type.data() }
    },
    SET_SUBTYPES (state, { subtype }) {
      state.subtypes = { ...state.subtypes, [subtype.id]: subtype.data() }
    }
  },
  getters: {
    getModels: (state) => (subtypeId) => state.types[subtypeId].models
  },
  actions: {
    async getSubTypes ({ commit }, type) {
      commit('CLEAR_SUBTYPES')
      let convoRef = db.collection('types').doc(type).collection('subtypes')
      let convos = await convoRef.get()
      convos.forEach(subtype => commit('SET_SUBTYPES', { subtype }))
    },
    // async getModels ({ commit }, subtype) {
    //   let convoRef = db.collection('types').doc(type).collection('subtypes').doc(subtype)
    //   let convos = await convoRef.get()
    //   convos.forEach(type => commit('SET_TYPES', { type }))
    // },
    async getTypes ({ commit }) {
      let convoRef = db.collection('types')
      let convos = await convoRef.get()
      commit('CLEAR_TYPES')
      convos.forEach(type => commit('SET_TYPES', { type }))
    }
  }
}
