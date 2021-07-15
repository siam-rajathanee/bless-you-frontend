export const SET_DONATIONS = 'SET_DONATIONS'

export default {
  [SET_DONATIONS] (state, donations) {
    Object.assign(state, { donations })
  }
}
