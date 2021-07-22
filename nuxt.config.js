export default {
  server: {
    port: 8080
  },

  publicRuntimeConfig: {
    axios: {
      browserBaseURL: process.env.API_URL
    }
  },

  privateRuntimeConfig: {
    axios: {
      baseURL: process.env.API_URL
    }
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'อนุโมทนา สาธุ',
    htmlAttrs: {
      lang: 'th'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/vee-validator.client.js'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/buefy
    'nuxt-buefy',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://auth.nuxtjs.org
    '@nuxtjs/auth-next',
    '@nuxtjs/dayjs'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  router: {
    base: process.env.BASE_URL || '/',
    middleware: ['auth']
  },

  dayjs: {
    locales: ['th'],
    defaultLocale: 'th',
    defaultTimeZone: 'Asia/Bangkok',
    plugins: ['utc', 'timezone']
  },

  auth: {
    redirect: {
      login: '/warden/login',
      logout: '/warden/',
      callback: '/warden/login',
      home: '/warden/'
    },
    strategies: {
      laravelJWT: {
        providor: 'laravel/jwt',
        url: process.env.API_URL,
        endpoints: {
          login: { url: '/auth/login', method: 'post' },
          refresh: { url: '/auth/refresh', method: 'post' },
          user: { url: '/auth/user-profile', method: 'get' },
          logout: { url: '/auth/logout', method: 'post' }
        },
        token: {
          property: 'access_token',
          maxAge: 60 * 60
        },
        refreshToken: {
          maxAge: 20160 * 60
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
