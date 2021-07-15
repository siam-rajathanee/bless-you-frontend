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
        <form>
          <b-field>
            <b-upload
              v-model="file"
              drag-drop
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
          <b-notification :closable="false" type="is-success" has-icon message="ข้อมูลของคุณจะถูกใช้เพื่อการจัดส่งใบอนุโมทนาบุญเท่านั้น" />
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
          <b-field>
            <b-checkbox v-model="allowMail" required>
              ยินยอมให้ส่งไปรษณีย์
            </b-checkbox>
          </b-field>
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

export default {
  name: 'HomePage',
  auth: false,
  data () {
    return {
      file: null,
      address: null,
      amount: null,
      zipCode: null,
      subDistrict: null,
      district: null,
      province: null,
      allowMail: false,
      subDistricts: []
    }
  },
  watch: {
    zipCode () {
      if (this.zipCode.length === 5) {
        this.autoSuggestion()
      } else {
        this.unsetAddress()
      }
    }
  },
  methods: {
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
