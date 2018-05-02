<template>
  <div id="app" class="wrap main">
    <app-header></app-header>
    <div id="container" class="container">
      <app-lnb></app-lnb>
      <router-view/>
      <hr />
    </div>
    <!-- //container -->

    <app-footer></app-footer>
  </div>
</template>

<script>
import AppHeader from '@/components/common/Header'
import AppLnb from '@/components/common/Lnb'
import AppFooter from '@/components/common/Footer'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppLnb,
    AppFooter
  },
  created () {
    this.$store.dispatch('tryAutoLogin')
  }
}
</script>

<style>

</style>
