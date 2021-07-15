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
        <form @submit.prevent="onSubmit">
          <b-field label="ชื่อ">
            <b-input v-model="firstname" />
          </b-field>
          <b-field label="นามสกุล">
            <b-input v-model="lastname" />
          </b-field>
          <b-field label="ร่วมทำบุญ">
            <b-select v-model="donate" expanded>
              <option v-for="(item, index) in donationTypes" :key="index" :value="item">
                {{ item }}
              </option>
              <option value="OTHER">
                อื่น ๆ
              </option>
            </b-select>
          </b-field>
          <b-field v-if="donate === 'OTHER'" label="โปรดระบุ">
            <b-input v-model="donate_other" />
          </b-field>
          <b-field label="หลักฐานการโอนเงิน">
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
          <b-field label="จำนวนเงิน">
            <b-input v-model="amount" type="numeric" />
          </b-field>
          <b-field>
            <b-checkbox v-model="allowMail">
              ยินยอมให้ส่งไปรษณีย์
            </b-checkbox>
          </b-field>
          <b-notification
            :closable="false"
            type="is-info"
            has-icon
            message="ข้อมูลของคุณจะถูกใช้เพื่อการจัดส่งใบอนุโมทนาบัตรเท่านั้น<br>ไม่ได้นำเพื่อไปใช้ทำการตลาด และวิเคราะห์ข้อมูลใด ๆ"
          />
          <template v-if="allowMail">
            <b-field label="ที่อยู่">
              <b-input v-model="address" required placeholder="บ้านเลขที่ หมู่บ้าน ถนน" />
            </b-field>
            <b-field label="รหัสไปรษณีย์">
              <b-input v-model="zipCode" type="numeric" required maxlength="5" />
            </b-field>
            <b-field label="ตำบล">
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
            <b-field label="อำเภอ">
              <b-input v-model="district" type="numeric" required readonly />
            </b-field>
            <b-field label="จังหวัด">
              <b-input v-model="province" type="numeric" required readonly />
            </b-field>
          </template>
          <b-field>
            <b-button type="is-success" native-type="submit" expanded>
              ส่งข้อมูล
            </b-button>
          </b-field>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
import Thai from 'thai-data'
import { mapActions } from 'vuex'

export default {
  name: 'HomePage',
  auth: false,
  data () {
    return {
      file: null,
      firstname: null,
      lastname: null,
      donate: 'โลงศพ',
      donate_other: null,
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
    onSubmit () {
      this.createDonation({
        file: this.file,
        firstname: this.firstname,
        lastname: this.lastname,
        donate: this.donate === 'OTHER' ? this.donate_other : this.donate,
        address: this.address,
        amount: this.amount,
        zipCode: this.zipCode,
        subDistrict: this.subDistrict,
        district: this.district,
        province: this.province,
        allowMail: this.allowMail
      })
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
