<template>
  <section class="section">
    <div class="columns">
      <div class="column mx-auto is-4">
        <div class="card">
          <div class="card-content">
            <h1 class="title has-text-centered">
              เข้าสู่ระบบ
            </h1>
            <form @submit.prevent="onSubmit">
              <b-field label="ชื่อผู้ใช้งาน">
                <b-input v-model="username" required />
              </b-field>
              <b-field label="รหัสผ่าน">
                <b-input v-model="password" type="password" required />
              </b-field>
              <b-field>
                <b-button type="is-success" expanded native-type="submit">
                  เข้าสู่ระบบ
                </b-button>
              </b-field>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  auth: 'guest',
  data () {
    return {
      username: null,
      password: null
    }
  },
  computed: {
    ...mapGetters(['organization'])
  },
  methods: {
    async onSubmit () {
      await this.$auth.loginWith(
        'laravelJWT',
        {
          data: {
            username: this.username,
            password: this.password
          }
        })
    }
  }
}
</script>
