export const SET_DONATIONS = 'SET_DONATIONS'
export const SET_DONATION_DETAILS = 'SET_DONATION_DETAILS'
export default {
  [SET_DONATIONS] (state, donations) {
    Object.assign(state, { donations })
  },
  [SET_DONATION_DETAILS] (state, donation) {
    Object.assign(state, { donation })
  }
}
