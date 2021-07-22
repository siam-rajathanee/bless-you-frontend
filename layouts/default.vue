<template>
  <main>
    <div class="container">
      <b-overlay :show="$store.getters.loading">
        <Nuxt />
      </b-overlay>
    </div>
  </main>
</template>

<script>
export default {
  name: 'LayoutDefault'
}
</script>
