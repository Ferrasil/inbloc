import db from '@/db'

export default {
  state: {
    assessors: []
  },
  mutations: {
    SET_ASSESSORS (state, { assessor }) {
      state.assessors = { ...state.assessors, [assessor.id]: assessor.data() }
    }
  },
  actions: {
    getAssessors ({commit}) {
      return new Promise((resolve, reject) => {
        db.collection('assessors').get().then(
        (assessors) => {
          assessors.forEach(assessor => commit('SET_ASSESSORS', {assessor}))
          resolve(true)
        })
      })
    }
  },
  getters: {
    getRandomAssessor: (state) => {
      let assessorsKeys = Object.keys(state.assessors)

      return assessorsKeys[Math.floor(Math.random() * assessorsKeys.length)]
    }
  }
}
