import { SET_LOADING, SET_DONATIONS, SET_DONATION_DETAIL } from './mutations'

export default {
  loading ({ commit }) {
    commit(SET_LOADING, true)
  },
  loaded ({ commit }) {
    commit(SET_LOADING, false)
  },
  async createDonation ({ dispatch }, data) {
    dispatch('loading')
    try {
      const formData = new FormData()
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key])
      })
      const response = await this.$axios.post('donations', formData)
      return response
    } finally {
      dispatch('loaded')
    }
  },
  async getDonations ({ commit, dispatch }, { page = 1, status = null, name = null } = {}) {
    dispatch('loading')
    try {
      const { data } = await this.$axios.get('donations', {
        params: {
          page,
          status,
          name
        }
      })
      commit(SET_DONATIONS, data)
      return Promise.resolve(data)
    } finally {
      dispatch('loaded')
    }
  },
  async getDonationById ({ commit, dispatch }, id) {
    dispatch('loading')
    try {
      const { data } = await this.$axios.get(`donations/${id}`)
      commit(SET_DONATION_DETAIL, data)
      return Promise.resolve(data)
    } finally {
      dispatch('loaded')
    }
  },
  async updateDonation ({ dispatch }, { id, body }) {
    dispatch('loading')
    try {
      await this.$axios.put(`donations/${id}`, body)
      return await dispatch('getDonationById', id)
    } finally {
      dispatch('loaded')
    }
  }
}
