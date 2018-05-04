<template>
  <div id="contents" class="contents">
    냠냠냠냠냠
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'Home',
    created () {
      this.$store.dispatch('fetchUser')
    }
  }
</script>

<style scoped>
  h1, p {
    text-align: center;
  }

  p {
    color: red;
  }
</style>
