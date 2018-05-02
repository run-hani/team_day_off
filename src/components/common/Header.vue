<template>
  <div>
    <ul class="skipnavi">
      <li><a href="#container">본문 바로가기</a></li>
    </ul>
    <!-- //skip navi -->

    <header class="header" v-if="user">
      <h1 class="logo">
        <router-link to="/" exact><img src="../../assets/img/common/logo.jpg" alt=""></router-link></h1>
      <div class="gnb m-hide">
        <div class="util">
          <p class="txtGreeting">"<strong class="name">{{ user.userId }}</strong>"님! 안녕하세요.</p>
          <button @click="onLogout" class="btn t_m w_xs2 c_weight">로그아웃</button>
        </div>
      </div>
      <!-- //util -->

      <nav class="lnb">
        <!--<ul>-->
          <!--<li class="depth01 menu01">-->
            <!--<a href="#"><span class="bar"></span>menu01</a>-->
            <!--<div class="wrapDepth02">-->
              <!--<ul class="depth02">-->
                <!--<li><a href="#" class="m_01">submenu01</a><span class="bg_m"></span></li>-->
                <!--<li><a href="#" class="m_02">submenu02</a></li>-->
                <!--<li><a href="#" class="m_03">submenu03</a></li>-->
                <!--<li><a href="#" class="m_04">submenu04</a></li>-->
              <!--</ul>-->
            <!--</div>-->
          <!--</li>-->
          <!--<li class="depth01 menu01">-->
            <!--<a href="#"><span class="bar"></span>menu02</a>-->
            <!--<div class="wrapDepth02">-->
              <!--<ul class="depth02">-->
                <!--<li><a href="#" class="m_01">submenu01</a><span class="bg_m"></span></li>-->
                <!--<li><a href="#" class="m_02">submenu02</a></li>-->
                <!--<li><a href="#" class="m_03">submenu03</a></li>-->
                <!--<li><a href="#" class="m_04">submenu04</a></li>-->
              <!--</ul>-->
            <!--</div>-->
          <!--</li>-->
        <!--</ul>-->
      </nav>
      <!-- //lnb -->
      <hr />
    </header>
    <!-- //header -->

    <a href="javascript:void(0)" class="btn-openLnb02"><span class="blind">LNB 열기</span></a>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'AppHeader',
    data: function () {
      return {
      }
    },
    methods: {
      onLogout() {
        this.$store.dispatch('logout')
      }
    },
    computed: {
      ...mapGetters([
        'user'
      ])
    },
    created () {
      this.$store.dispatch('fetchUser')
    }
  }
</script>
