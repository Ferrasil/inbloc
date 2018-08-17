// eslint-disable-next-line
import getContract from '@/utils/getContract'
import db from '@/db'
export default {
  state: {
    policies: []
  },
  mutations: {
    REGISTER_CONTRACT (state, payload) {
      console.log('Casino contract instance: ', payload)
      state.contractInstance = () => payload
    },
    SET_POLICY (state, { policy }) {
      state.policies = { ...state.policies, [policy.id]: policy.data() }
    },
    UPDATE_POLICY (state, policy) {
      state.policies[policy.id].status = policy.status
      state.policies[policy.id].claim = policy.claim
    },
    SET_PENDING (state, id) {
      state.policies[id].pending = true
    },
    REMOVE_PENDING (state, id) {
      state.policies[id].pending = false
    },
    SET_NEW_POLICY (state, policy) {
      state.policies = { ...state.policies, ...policy }
    }
  },
  actions: {
    setPending ({commit}, id) {
      commit('SET_PENDING', id)
    },
    addClaim ({commit}, policy) {
      return new Promise((resolve, reject) => {
        policy.claim.createdAt = (new Date())
        db.collection('policies').doc(policy.id).update({
          claim: policy.claim,
          status: 2
        }).then(() => {
          policy.status = 2
          commit('UPDATE_POLICY', policy)
          resolve(true)
          commit('REMOVE_PENDING', policy.id)
        })
      })
    },
    updateClaim ({commit}, policy) {
      return new Promise((resolve, reject) => {
        db.collection('policies').doc(policy.id).update(policy).then(() => {
          policy.status = 2
          resolve(true)
        })
      })
    },
    getContractInstance ({commit}, userID) {
      return new Promise((resolve, reject) => {
        console.log(userID)
        db.collection('policies').where('insured', '==', userID).get().then(
          (policies) => {
            policies.forEach(policy => commit('SET_POLICY', {policy}))
            resolve(true)
          })
      })
    },
    getAllClaimed ({commit}) {
      return new Promise((resolve, reject) => {
        db.collection('policies').where('status', '>', 1).get().then(
        (policies) => {
          resolve(policies)
        })
      })
    },
    getAllInsurances (context, data) {
      return new Promise((resolve, reject) => {
        db.collection('policies').get().then(
          (policies) => {
            resolve(policies)
          })
      })
    },
    addPolicy ({commit}, policy) {
      return new Promise((resolve, reject) => {
        db.collection('policies').add(policy)
            .then(function (newPolicy) {
              commit('SET_NEW_POLICY', {[newPolicy.id]: policy})
              resolve(newPolicy)
            })
            .catch(function (error) {
              reject(error)
            })
      })
    }

    //   getContract.then(result => {
    //     commit('REGISTER_CONTRACT', {result})
    //   }).catch(e => console.log(e))
  },
  getters: {
    getPolicies: (state) => {
      let arrPolicies = []
      Object.keys(state.policies).forEach(policyId => {
        arrPolicies.push({id: policyId, ...state.policies[policyId]})
      })

      return arrPolicies
    }
  }
}
