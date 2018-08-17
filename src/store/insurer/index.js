import db from '@/db'
export default {
  state: {
    insurers: []
  },
  mutations: {
    SET_INSURERS (state, { insurer }) {
      state.insurers = { ...state.insurers, [insurer.id]: insurer.data() }
    }
  },
  actions: {
    getInsurers ({commit}) {
      return new Promise((resolve, reject) => {
        db.collection('insurers').get().then(
        (insurers) => {
          insurers.forEach(insurer => commit('SET_INSURERS', {insurer}))
          resolve(true)
        })
      })
    }},
  getters: {
    getRandomInsurer: (state) => (type) => {
      const result = []
      Object.keys(state.insurers).forEach(hash => {
        if (state.insurers[hash].insuranceTypes.includes(type)) { result.push({...state.insurers[hash], hash: hash}) }
      })

      return result[Math.floor(Math.random() * result.length)].hash
    }
  }
}
