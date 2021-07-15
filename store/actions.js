import { SET_DONATIONS } from './mutations'

export default {
  createDonation (_, data) {
    const formData = new FormData()
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key])
    })
    return this.$axios.post('donations', formData)
  },
  async getDonations ({ commit }, { page = 1, status = null, name = null } = {}) {
    const { data } = await this.$axios.get('donations', {
      params: {
        page,
        status,
        name
      }
    })
    commit(SET_DONATIONS, data)
    return Promise.resolve(data)
  }
}
