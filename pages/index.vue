<template>
  <section class="section">
    <h1 class="title has-text-centered">
      อนุโมทนา สาธุ
    </h1>
    <p class="subtitle has-text-centered">
      กรุณากรอกข้อมูลเพิ่มเติม เพื่อให้เราส่งใบอนุโมทนาบุญให้คุณ
    </p>
    <div class="columns is-mobile">
      <div class="column is-fullwidth is-two-thirds-tablet mx-auto">
        <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
          <ValidationProvider v-slot="{ errors, valid }" rules="required" name="ชื่อ">
            <b-field label="ชื่อ" :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="errors">
              <b-input v-model="firstname" />
            </b-field>
          </ValidationProvider>
          <ValidationProvider v-slot="{ errors, valid }" rules="required" name="นามสกุล">
            <b-field label="นามสกุล" :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="errors">
              <b-input v-model="lastname" />
            </b-field>
          </ValidationProvider>
          <ValidationProvider v-slot="{ errors, valid }" rules="required" name="ร่วมทำบุญ">
            <b-field label="ร่วมทำบุญ" :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="errors">
              <b-select v-model="donate" expanded>
                <option v-for="(item, index) in donationTypes" :key="index" :value="item">
                  {{ item }}
                </option>
                <option value="OTHER">
                  อื่น ๆ
                </option>
              </b-select>
            </b-field>
          </ValidationProvider>
          <ValidationProvider v-if="donate === 'OTHER'" v-slot="{ errors, valid }" rules="required" name="โปรดระบุ">
            <b-field label="โปรดระบุ" :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="errors">
              <b-input v-model="donateOther" />
            </b-field>
          </ValidationProvider>
          <ValidationProvider v-slot="{ errors, valid }" rules="required" name="หลักฐานการโอนเงิน">
            <b-field label="หลักฐานการโอนเงิน" :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="errors">
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
                      <b-icon
                        icon="upload"
                        size="is-large"
                      />
                    </p>
                    <p>คลิกเพื่ออัปโหลดหลักฐานการโอนเงิน หรือลากไฟล์ใส่ได้เลย</p>
                  </div>
                </section>
              </b-upload>
            </b-field>
          </ValidationProvider>
          <ValidationProvider v-slot="{ errors, valid }" rules="required|numeric" name="จำนวนเงิน">
            <b-field label="จำนวนเงิน" :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="errors">
              <b-input v-model="amount" type="numeric" />
            </b-field>
          </ValidationProvider>
          <b-notification
            :closable="false"
            type="is-success"
            has-icon
            message="ข้อมูลของคุณจะถูกใช้เพื่อการจัดส่งใบอนุโมทนาบัตรเท่านั้น<br>ไม่ได้นำเพื่อไปใช้ทำการตลาด และวิเคราะห์ข้อมูลใด ๆ"
          />
          <b-field>
            <b-checkbox v-model="allowMail" type="is-success">
              ยินยอมให้ส่งไปรษณีย์
            </b-checkbox>
          </b-field>
          <template v-if="allowMail">
            <ValidationProvider v-slot="{ errors, valid }" rules="required" name="ที่อยู่">
              <b-field label="ที่อยู่" :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="errors">
                <b-input v-model="address" placeholder="บ้านเลขที่ หมู่บ้าน ถนน" />
              </b-field>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors, valid }" rules="required" name="ที่อยู่">
              <b-field label="รหัสไปรษณีย์" :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="errors">
                <b-input v-model="zipCode" type="numeric" maxlength="5" />
              </b-field>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors, valid }" rules="required" name="ที่อยู่">
              <b-field label="ตำบล" :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="errors">
                <b-select v-model="subDistrict" :disabled="subDistricts.length === 0" expanded @input="() => autoSuggestion()">
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
            <ValidationProvider v-slot="{ errors, valid }" rules="required" name="ที่อยู่">
              <b-field label="อำเภอ" :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="errors">
                <b-input v-model="district" type="numeric" readonly />
              </b-field>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors, valid }" rules="required" name="ที่อยู่">
              <b-field label="จังหวัด" :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="errors">
                <b-input v-model="province" type="numeric" readonly />
              </b-field>
            </ValidationProvider>
          </template>
          <b-field>
            <b-button type="is-success" @click="handleSubmit(onSubmit)">
              ส่งข้อมูล
            </b-button>
          </b-field>
        </ValidationObserver>
      </div>
    </div>
  </section>
</template>

<script>
import Thai from 'thai-data'
import { extend, ValidationObserver, ValidationProvider } from 'vee-validate'
import { mapActions } from 'vuex'
import { required, numeric } from 'vee-validate/dist/rules'

extend('required', {
  ...required,
  message: 'กรุณากรอกข้อมูลให้ครบถ้วน'
})

extend('numeric', {
  ...numeric,
  message: 'กรุณากรอกตัวเลขเท่านั้น'
})

export default {
  name: 'HomePage',
  auth: false,
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
    ...mapActions(['createDonation']),
    async onSubmit () {
      try {
        await this.createDonation({
          proof_of_transfer: this.file,
          firstname: this.firstname,
          lastname: this.lastname,
          donate: this.donate === 'OTHER' ? this.donateOther : this.donate,
          address: this.address,
          amount: this.amount,
          zip_code: this.zipCode,
          subdistrict: this.subDistrict,
          district: this.district,
          province: this.province,
          address_allow: this.allowMail
        })
        this.$buefy.dialog.alert({
          title: 'บันทึกข้อมูลเรียบร้อย',
          message: 'ขอบคุณที่ร่วมทำบุญกับเรา',
          type: 'is-success',
          hasIcon: true,
          ariaRole: 'alertdialog',
          ariaModal: true
        })
        this.clearForm()
      } catch (e) {
        this.$buefy.dialog.alert({
          title: 'ไม่สามารถบันทึกข้อมูลได้',
          message: 'กรุณาลองใหม่อีกครั้ง',
          type: 'is-danger',
          hasIcon: true,
          ariaRole: 'alertdialog',
          ariaModal: true
        })
      }
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
    autoSuggestion () {
      const { subDistrict, districtName, provinceName } = Thai.autoSuggestion(this.zipCode, this.subDistrict)

      if (Array.isArray(subDistrict)) {
        this.subDistricts = subDistrict
      }

      this.district = districtName
      this.province = provinceName
    }
  }
}
</script>

<style>
.background-upload-preview {
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}
.background-upload-preview .upload-draggable {
  background-color: rgba(255,255,255,0.5);
}
</style>
