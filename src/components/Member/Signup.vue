<template>
  <div id="contents" class="contents">

    <header class="spot-t01">
      <h2 class="h-spot">회원가입</h2>
      <div class="breadcrumb">
        <a href="" class="ico_ home">home</a> &gt;
        <strong>회원가입</strong>
      </div>
    </header>

    <div class="contents-in mxWf-1200">
      <form @submit.prevent="onSubmit">
        <div class="mb10">
          <input type="text" class="input wf200" placeholder="LDAP 아이디" v-model="userId">
        </div>
        <div class="mb10">
          <input type="text" class="input wf200" placeholder="이메일" v-model="email">
        </div>
        <div class="mb10">
          <input type="text" class="input wf200" placeholder="휴대폰번호" v-model="password">
        </div>
        <button type="submit" class="btn t_l wf200 c_weightier">가입하기</button>
      </form>
    </div>
  </div>
</template>

<script>


  export default {
    name: 'Signup',
    data: function () {
      return {
        userId: '',
        email: '',
        password: ''
      }
    },
    methods: {
      onSubmit () {
        const formData = {
          userId: this.userId,
          email: this.email,
          password: this.password
        }
        console.log(formData)
        this.$store.dispatch('signup', formData)
      }
    }
  }
</script>
