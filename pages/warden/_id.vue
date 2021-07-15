<template>
  <section class="section" v-if="donation !== null">
    <h1 class="title has-text-centered">
      ข้อมูลการร่วมบริจาค
    </h1>
    <p class="subtitle has-text-centered my-5">
      รายละเอียดของคุณ {{ fullname }}
    </p>
    <div class="has-text-centered my-5">
      <NuxtLink to="./" >
        กลับหน้าหลัก
      </NuxtLink >
    </div>
    <div class="columns is-mobile">
      <div class="column is-half-desktop">
        <h2 class="mb-3">
          <b>หลักฐานการโอนเงิน</b>
        </h2>
        <img :src="donation.proof_of_transfer">
      </div>
      <div class="column ">
        <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
          <ValidationProvider
            v-slot="{ errors, valid }"
            rules="required"
            name="ชื่อ"
          >
            <b-field
              label="ชื่อ"
              :type="{ 'is-danger': errors[0], 'is-success': valid }"
              :message="errors"
            >
              <b-input v-model="firstname" />
            </b-field>
          </ValidationProvider>
          <ValidationProvider
            v-slot="{ errors, valid }"
            rules="required"
            name="นามสกุล"
          >
            <b-field
              label="นามสกุล"
              :type="{ 'is-danger': errors[0], 'is-success': valid }"
              :message="errors"
            >
              <b-input v-model="lastname" />
            </b-field>
          </ValidationProvider>
          <ValidationProvider
            v-slot="{ errors, valid }"
            rules="required"
            name="ร่วมทำบุญ"
          >
            <b-field
              label="ร่วมทำบุญ"
              :type="{ 'is-danger': errors[0], 'is-success': valid }"
              :message="errors"
            >
              <b-select v-model="donate" expanded>
                <option
                  v-for="(item, index) in donationTypes"
                  :key="index"
                  :value="item"
                >
                  {{ item }}
                </option>
                <option value="OTHER">
                  อื่น ๆ
                </option>
              </b-select>
            </b-field>
          </ValidationProvider>
          <ValidationProvider
            v-if="donate === 'OTHER'"
            v-slot="{ errors, valid }"
            rules="required"
            name="โปรดระบุ"
          >
            <b-field
              label="โปรดระบุ"
              :type="{ 'is-danger': errors[0], 'is-success': valid }"
              :message="errors"
            >
              <b-input v-model="donateOther" />
            </b-field>
          </ValidationProvider>
          <ValidationProvider
            v-slot="{ errors, valid }"
            rules="required"
            name="หลักฐานการโอนเงิน"
          >
            <b-field
              label="หลักฐานการโอนเงิน"
              :type="{ 'is-danger': errors[0], 'is-success': valid }"
              :message="errors"
            >
              <b-upload
                v-model="file"
                drag-drop
                expanded
                class="background-upload-preview"
                :style="preview ? `background-image: url(${preview});` : ''"
              >
                <section class="section">
                  <div class="content has-text-centered">
                    <p>
                      <b-icon icon="upload" size="is-large" />
                    </p>
                    <p>คลิกเพื่ออัปโหลดหลักฐานการโอนเงิน หรือลากไฟล์ใส่ได้เลย</p>
                  </div>
                </section>
              </b-upload>
            </b-field>
          </ValidationProvider>
          <ValidationProvider
            v-slot="{ errors, valid }"
            rules="required|numeric"
            name="จำนวนเงิน"
          >
            <b-field
              label="จำนวนเงิน"
              :type="{ 'is-danger': errors[0], 'is-success': valid }"
              :message="errors"
            >
              <b-input v-model="amount" type="numeric" />
            </b-field>
          </ValidationProvider>
          <b-field>
            <b-checkbox v-model="allowMail" type="is-success">
              ยินยอมให้ส่งไปรษณีย์
            </b-checkbox>
          </b-field>
          <template v-if="allowMail">
            <ValidationProvider
              v-slot="{ errors, valid }"
              rules="required"
              name="ที่อยู่"
            >
              <b-field
                label="ที่อยู่"
                :type="{ 'is-danger': errors[0], 'is-success': valid }"
                :message="errors"
              >
                <b-input
                  v-model="address"
                  placeholder="บ้านเลขที่ หมู่บ้าน ถนน"
                />
              </b-field>
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ errors, valid }"
              rules="required"
              name="ที่อยู่"
            >
              <b-field
                label="รหัสไปรษณีย์"
                :type="{ 'is-danger': errors[0], 'is-success': valid }"
                :message="errors"
              >
                <b-input v-model="zipCode" type="numeric" maxlength="5" />
              </b-field>
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ errors, valid }"
              rules="required"
              name="ที่อยู่"
            >
              <b-field
                label="ตำบล"
                :type="{ 'is-danger': errors[0], 'is-success': valid }"
                :message="errors"
              >
                <b-select
                  v-model="subDistrict"
                  :disabled="subDistricts.length === 0"
                  expanded
                  @input="() => autoSuggestion()"
                >
                  <option :value="null" disabled>
                    กรุณาเลือกตำบล
                  </option>
                  <option
                    v-for="(name, index) in subDistricts"
                    :key="index"
                    :value="name"
                  >
                    {{ name }}
                  </option>
                </b-select>
              </b-field>
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ errors, valid }"
              rules="required"
              name="ที่อยู่"
            >
              <b-field
                label="อำเภอ"
                :type="{ 'is-danger': errors[0], 'is-success': valid }"
                :message="errors"
              >
                <b-input v-model="district" type="numeric" readonly />
              </b-field>
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ errors, valid }"
              rules="required"
              name="ที่อยู่"
            >
              <b-field
                label="จังหวัด"
                :type="{ 'is-danger': errors[0], 'is-success': valid }"
                :message="errors"
              >
                <b-input v-model="province" type="numeric" readonly />
              </b-field>
            </ValidationProvider>
          </template>
          <b-field class="mt-3">
            <b-button type="is-warning" @click="handleSubmit(onSubmit)">
              บันทึกการแก้ไข
            </b-button>
            <b-button type="is-success mx-2" @click="handleSubmit(onSubmit)">
              อนุมัติใบอนุโมทนาบุญ
            </b-button>
            <b-button type="is-default" @click="handleSubmit(onSubmit)">
              พิมพ์ใบอนุโมทนาบุญ
            </b-button>
          </b-field>
        </ValidationObserver>
      </div>

    </div>
  </section>
</template>

<script>
import Thai from 'thai-data'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    ValidationObserver,
    ValidationProvider
  },
  data () {
    return {
      file: null,
      firstname: null,
      lastname: null,
      donate: 'โลงศพ',
      donateOther: null,
      address: null,
      amount: null,
      zipCode: null,
      subDistrict: null,
      district: null,
      province: null,
      allowMail: false,
      subDistricts: [],
      donationTypes: ['โลงศพ', 'ค่าน้ำ / ค่าไฟ'],
      preview: null
    }
  },
  async fetch () {
    await this.getDonationsById({
      id: this.$route.params.id
    })

    this.firstname = this.donation.firstname
    this.lastname = this.donation.lastname
    this.donate = this.donation.donate
    this.amount = parseFloat(this.donation.amount)

    if (this.donation.address !== null) {
      this.allowMail = true
      this.address = this.donation.address.address
      this.zipCode = this.donation.address.zip_code
      this.autoSuggestion(this.donation.address.subdistrict, this.donation.address.district)
    }
  },
  computed: {
    ...mapGetters(['donation']),
    fullname () {
      const { firstname, lastname } = this.donation
      return `${firstname} ${lastname}`
    }
  },
  watch: {
    file (file) {
      this.preview = URL.createObjectURL(file)
    },
    zipCode () {
      if (this.zipCode.length === 5) {
        this.autoSuggestion()
      } else {
        this.unsetAddress()
      }
    }
  },
  methods: {
    ...mapActions(['getDonationsById']),
    async onSubmit () {

    },
    clearForm () {
      this.file = null
      this.firstname = null
      this.lastname = null
      this.donate = null
      this.donateOther = null
      this.address = null
      this.allowMail = false
      this.unsetAddress()
    },
    unsetAddress () {
      this.subDistrict = null
      this.district = null
      this.province = null
      this.subDistricts = []
    },
    autoSuggestion (inputSubdistrict = null, inputDistrict = null) {
      const { subDistrict, districtName, provinceName } = Thai.autoSuggestion(this.zipCode, this.subDistrict)

      if (Array.isArray(subDistrict)) {
        this.subDistricts = subDistrict
      }

      this.district = districtName
      this.province = provinceName

      if (inputSubdistrict !== null && inputDistrict !== null) {
        this.district = inputDistrict
        this.subDistrict = inputSubdistrict
      }
    }
  }
}
</script>
