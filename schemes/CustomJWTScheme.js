import { RefreshScheme } from '~auth/runtime'

export default class CustomJWTScheme extends RefreshScheme {
  organization = null

  login (endpoint, options = {}) {
    this.organization = endpoint.data.organization

    this.options.endpoints.login.url = `/${this.organization}/auth/login`
    return super.login(endpoint, options)
  }

  fetchUser (endpoint) {
    this.options.endpoints.user.url = `/${this.organization}/auth/user-profile`
    return super.fetchUser(endpoint)
  }

  logout (endpoint = {}) {
    this.options.endpoints.logout.url = `/${this.organization}/auth/logout`
    return super.felogoutchUser(endpoint)
  }

  refreshTokens () {
    this.options.endpoints.refresh.url = `/${this.organization}/auth/logout`
    return super.refreshTokens()
  }
}
