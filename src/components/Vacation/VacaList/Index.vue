<template>
  <div id="contents" class="contents">
    <header class="spot-t01">
      <h2 class="h-spot">대체휴가 내역</h2>
      <div class="breadcrumb">
        <a href="" class="ico_ home">home</a> &gt;
        <strong>대체휴가 내역</strong>
      </div>
    </header>

    <div class="contents-in mxWf-1200">
      <ul class="tab-t01 n2 mxWf-1200">
        <router-link to="/VacationList/Calc" tag="li" active-class="on">
          <a href="javascript:void(0)">내역</a>
        </router-link>
        <router-link to="/VacationList/Calendar" tag="li" active-class="on">
          <a href="javascript:void(0)">캘린더</a>
        </router-link>
      </ul>

      <router-view/>
    </div>
  </div>
  <!--//contents -->
</template>

<script>
  export default {
    name: 'WorkList'
  }
</script>
