<template>
  <section class="section">
    <div class="level">
      <div class="level-left">
        <h1 class="title">
          รายชื่อผู้บริจาค
        </h1>
      </div>
      <div class="level-right">
        <form @submit.prevent="search">
          <b-field grouped group-multiline>
            <b-field label="สถานะ">
              <b-select v-model="status">
                <option v-for="(item, index) in optionStatus" :key="index" :value="item.value">
                  {{ item.name }}
                </option>
              </b-select>
            </b-field>
            <b-field label="ชื่อ">
              <b-input v-model="name" />
              <p class="control">
                <b-button class="button is-primary" type="is-info" native-type="submit">
                  ค้นหา
                </b-button>
              </p>
            </b-field>
          </b-field>
        </form>
      </div>
    </div>
    <b-table
      v-if="donations"
      paginated
      backend-pagination
      :data="donations.data"
      :total="donations.total"
      :per-page="donations.per_page"
      :current-page="donations.current_page"
      @page-change="onPageChange"
    >
      <b-table-column
        v-slot="{ index }"
        field="id"
        label="#"
        width="40"
      >
        {{ index + 1 }}
      </b-table-column>
      <b-table-column
        v-slot="{ row }"
        field="firstname"
        label="ชื่อ"
        width="200"
      >
        {{ row.firstname }} {{ row.lastname }}
      </b-table-column>
      <b-table-column
        v-slot="{ row }"
        field="donate"
        label="ประเภท"
      >
        {{ row.donate }}
      </b-table-column>
      <b-table-column
        v-slot="{ row }"
        field="amount"
        label="จำนวนเงิน"
        numeric
      >
        {{ row.amount }}
      </b-table-column>
      <b-table-column
        v-slot="{ row }"
        field="status"
        label="สถานะ"
      >
        <b-tag v-if="row.status === 'approved'" size="is-medium" type="is-success">
          อนุมัติ
        </b-tag>
        <b-tag v-else-if="row.status === 'rejected'" size="is-medium" type="is-danger">
          ปฏิเสธ
        </b-tag>
        <b-tag v-else size="is-medium" type="is-light">
          ยังไม่ได้อนุมัติ
        </b-tag>
      </b-table-column>
      <b-table-column
        v-slot="{ row }"
        field="created_at"
        label="วันที่"
      >
        {{ $dayjs(row.created_at).format('DD MMM YYYY HH:mm') }}
      </b-table-column>
      <b-table-column v-slot="{ row }">
        <b-button type="is-info" :to="{ name: 'warden-id', params: { id: row.id } }">
          รายละเอียด
        </b-button>
      </b-table-column>
    </b-table>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      name: null,
      status: null,
      optionStatus: [
        { name: 'ยังไม่ได้อนุมัติ', value: null },
        { name: 'อนุมัติ', value: 'approved' },
        { name: 'ปฏิเสธ', value: 'rejected' },
        { name: 'ทั้งหมด', value: 'all' }
      ]
    }
  },
  computed: {
    ...mapGetters(['donations'])
  },
  mounted () {
    if (this.optionStatus.map(({ value }) => value).includes(this.$route.query?.status)) {
      this.status = this.$route.query?.status
    }

    this.name = this.$route.query?.name

    this.getDonations({
      status: this.status,
      name: this.name,
      page: this.$route.query?.page || 1
    })
  },
  methods: {
    ...mapActions(['getDonations']),
    onPageChange (page) {
      this.$router.push({ query: { page } })
      this.getDonations({ page })
    },
    search () {
      this.$router.push({ query: { status: this.status, name: this.name, page: 1 } })
      this.getDonations({ status: this.status, name: this.name, page: 1 })
    }
  }
}
</script>
