<template>

    <nav class="lnb-t02 m-hide">
      <ul>
        <li class="depth01 menu01 menu_noChild">
          <router-link to="/"><span class="bar"></span>추가근무 등록</router-link>
        </li>
        <li class="depth01 menu01 menu_noChild">
          <router-link to="/WorkList"><span class="bar"></span>추가근무 내역</router-link>
        </li>
        <li class="depth01 menu01 menu_noChild">
          <router-link to="/VacationUse"><span class="bar"></span>대체휴가 사용</router-link>
        </li>
        <li class="depth01 menu01 menu_noChild">
          <router-link to="/VacationList"><span class="bar"></span>대체휴가 내역</router-link>
        </li>
      </ul>
      <a href="javascript:void(0)" class="btn-closeLnb02"><span class="blind">LNB 닫기</span></a>
    </nav>
  <!-- //lnb -->
</template>

<script>
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
    }
  }
</script>
