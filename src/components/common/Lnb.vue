<template>
    <nav class="lnb-t02 m-hide" v-if="user">
      <ul>
        <li class="depth01 menu01 menu_noChild">
          <router-link to="/VacationAdd" active-class="on" exact><span class="bar"></span>추가근무 등록</router-link>
        </li>
        <li class="depth01 menu01 menu_noChild">
          <router-link to="/WorkList/Calc" active-class="on"><span class="bar"></span>추가근무 내역</router-link>
        </li>
        <li class="depth01 menu01 menu_noChild">
          <router-link to="/VacationUse" active-class="on"><span class="bar"></span>대체휴가 사용</router-link>
        </li>
        <li class="depth01 menu01 menu_noChild">
          <router-link to="/VacationList/Calc" active-class="on"><span class="bar"></span>대체휴가 내역</router-link>
        </li>
        <li class="depth01 menu01 menu_noChild">
          <router-link to="/dashboard" active-class="on"><span class="bar"></span>대시보드</router-link>
        </li>
      </ul>
      <a href="javascript:void(0)" class="btn-closeLnb02"><span class="blind">LNB 닫기</span></a>
    </nav>
  <!-- //lnb -->
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'AppLnb',
    data () {
      return {
        isLnbOpen: false
      }
    },
    methods: {
      aa () {
        router.push({ path: '/VacationUse' })
      }
    },
    computed: {
      ...mapGetters([
        'user'
      ])
    }
  }
</script>
