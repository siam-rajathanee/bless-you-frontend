import { SET_DONATIONS } from './mutations'

export default {
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
