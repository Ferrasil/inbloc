import db from '@/db'
export default {
  state: {
    claims: []
  },
  mutations: {
    SET_CLAIM (state, {claim}) {
      state.claims[claim.id] = claim.data()
    }
  },
  actions: {
    addClaim ({commit}, policy) {
      db.collection('policies').doc.add(policy.id).update({
        claim: {createdAt: new Date()},
        status: policy.status
      }).then(claims =>
            claims.forEach(claim => commit('SET_CLAIM', {claim})))
    }
  },
  getters: {
    getClaims (state) {
      return state.loading
    }

  }
}
