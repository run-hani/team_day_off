<template>
  <div>
    <ul class="skipnavi">
      <li><a href="#container">본문 바로가기</a></li>
    </ul>
    <!-- //skip navi -->

    <header class="header">
      <h1 class="logo"><a href="main.html">Vacation</a></h1>
      <div class="gnb m-hide">
        <div class="util">
          <p class="txtGreeting">"<strong class="name">관리자</strong>"님! 안녕하세요.</p>
          <a href="sitemap.html" class="btn t_m w_xs2 c_slight m-hide"><span class="ico_ mypage"></span>내정보수정</a>
          <a href="mem_login.html" class="btn t_m w_xs2 c_weight">로그아웃</a>
        </div>
      </div>
      <!-- //util -->

      <nav class="lnb">
        <ul>
          <li class="depth01 menu01">
            <a href="#"><span class="bar"></span>menu01</a>
            <div class="wrapDepth02">
              <ul class="depth02">
                <li><a href="#" class="m_01">submenu01</a><span class="bg_m"></span></li>
                <li><a href="#" class="m_02">submenu02</a></li>
                <li><a href="#" class="m_03">submenu03</a></li>
                <li><a href="#" class="m_04">submenu04</a></li>
              </ul>
            </div>
          </li>
          <li class="depth01 menu01">
            <a href="#"><span class="bar"></span>menu02</a>
            <div class="wrapDepth02">
              <ul class="depth02">
                <li><a href="#" class="m_01">submenu01</a><span class="bg_m"></span></li>
                <li><a href="#" class="m_02">submenu02</a></li>
                <li><a href="#" class="m_03">submenu03</a></li>
                <li><a href="#" class="m_04">submenu04</a></li>
              </ul>
            </div>
          </li>
        </ul>
      </nav>
      <!-- //lnb -->
      <hr />
    </header>
    <!-- //header -->

    <a href="javascript:void(0)" class="btn-openLnb02"><span class="blind">LNB 열기</span></a>
  </div>
</template>

<script>
  export default {
    name: 'AppHeader'
  }
</script>
