
export const SET_LOADING = 'SET_LOADING'
export const SET_DONATIONS = 'SET_DONATIONS'
export const SET_DONATION_DETAIL = 'SET_DONATION_DETAIL'

export default {
  [SET_LOADING] (state, loading) {
    Object.assign(state, { loading })
  },
  [SET_DONATIONS] (state, donations) {
    Object.assign(state, { donations })
  },
  [SET_DONATION_DETAIL] (state, donation) {
    Object.assign(state, { donation })
  }
}
