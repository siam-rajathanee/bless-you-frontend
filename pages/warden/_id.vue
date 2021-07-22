<template>
  <section v-if="donation !== null" class="section">
    <div class="level">
      <div class="level-left">
        <div class="level-item">
          <div>
            <p class="heading">
              ข้อมูลการร่วมบริจาค
            </p>
            <p class="title">
              คุณ {{ fullname }}
            </p>
          </div>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <NuxtLink :to="{ name: 'warden' }">
            กลับหน้าหลัก
          </NuxtLink>
        </div>
      </div>
    </div>
    <div class="columns is-mobile">
      <div class="column">
        <b-collapse class="card" :open="!donation.blessing_card">
          <template #trigger="{ open }">
            <div class="card-header">
              <p class="card-header-title">
                หลักฐานการโอนเงิน
              </p>
              <a class="card-header-icon">
                <b-icon :icon="open ? 'menu-down' : 'menu-up'" />
              </a>
            </div>
          </template>
          <div class="card-image">
            <img :src="donation.proof_of_transfer">
          </div>
        </b-collapse>
        <b-collapse v-if="donation.blessing_card" class="card mt-3">
          <template #trigger="{ open }">
            <div class="card-header">
              <p class="card-header-title">
                ใบอนุโมทนาบัตร
              </p>
              <a class="card-header-icon">
                <b-icon :icon="open ? 'menu-down' : 'menu-up'" />
              </a>
            </div>
          </template>
          <div class="card-image">
            <img :src="donation.blessing_card.card">
          </div>
        </b-collapse>
      </div>
      <div class="column">
        <ValidationObserver ref="observer" v-slot="{ handleSubmit, dirty }">
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
            <div class="buttons">
              <b-button type="is-info" :disabled="!dirty" @click="handleSubmit(onSubmit)">
                บันทึกการแก้ไข
              </b-button>
              <b-button type="is-default" :disabled="!dirty" @click="handleSubmit(onSubmit)">
                ยกเลิกการแก้ไข
              </b-button>
            </div>
          </b-field>
          <div class="buttons mt-3">
            <template v-if="!donation.status">
              <b-button type="is-success" :disabled="dirty" @click="approve">
                อนุมัติ
              </b-button>
              <b-button type="is-danger" :disabled="dirty" @click="reject">
                ปฏิเสธ
              </b-button>
            </template>
            <b-button v-else type="is-success" :disabled="dirty" @click="print">
              พิมพ์ใบอนุโมทนาบัตร
            </b-button>
          </div>
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
      donate: null,
      donateOther: null,
      address: null,
      amount: null,
      zipCode: null,
      subDistrict: null,
      district: null,
      province: null,
      allowMail: false,
      subDistricts: [],
      preview: null
    }
  },
  computed: {
    ...mapGetters(['donation', 'donationTypes']),
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
  async mounted () {
    await this.getDonationById(this.$route.params.id)
    this.resetForm()
  },
  methods: {
    ...mapActions(['getDonationById', 'updateDonation']),
    async onSubmit () {
      await this.updateDonation({
        id: this.donation.id,
        body: {
          firstname: this.firstname,
          lastname: this.lastname,
          donate: this.donate,
          donateOther: this.donateOther,
          address: this.address,
          amount: this.amount,
          zipCode: this.zipCode,
          subDistrict: this.subDistrict,
          district: this.district,
          province: this.province,
          allowMail: this.allowMail
        }
      })
    },
    approve () {
      this.updateDonation({
        id: this.donation.id,
        body: {
          status: 'approved'
        }
      })
    },
    reject () {
      this.updateDonation({
        id: this.donation.id,
        body: {
          status: 'rejected'
        }
      })
    },
    print () {

    },
    resetForm () {
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
    },
    unsetAddress () {
      this.subDistrict = null
      this.district = null
      this.province = null
      this.subDistricts = []
    }
  }
}
</script>
