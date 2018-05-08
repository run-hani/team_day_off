<template>
  <form @submit.prevent="onSubmit">
    <div class="wrap_login">
      <h1>대휴관리 시스템</h1>
      <p>Log-in을 해주세요.</p>
      <div class="box-login">
        <ul>
          <li>
            <label for="email" class="wf60">E-mail</label>
            <input type="text" id="email" class="input_txt" placeholder="이메일" v-model="email" />
          </li>
          <li>
            <label for="pw" class="wf60">비밀번호</label>
            <input type="text" id="pw" class="input_txt" placeholder="휴대폰번호" v-model="password">
          </li>
        </ul>
        <button type="submit" class="input_btn" title="로그인">로그인</button>
        <div class="txt_join">
          <router-link to="/Signup">계정이 아직 없으신가요?</router-link>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
  export default {
    name: 'Signin',
    data: function () {
      return {
        hasToken: false,
        email: 'myrnvl@nate.com',
        password: '123456'
      }
    },
    methods: {
      onSubmit () {
        const formData = {
          email: this.email,
          password: this.password
        }
        console.log(formData)
        this.$store.dispatch('login', {email: formData.email, password: formData.password})
      }
    },
    created () {
      if (this.$store.state.idToken != null) {
        this.hasToken = true
      } else {
        this.hasToken = false
      }
    },
    watch: {
      'hasToken' (data) {
        if (data) {
          this.$router.push({ name: 'VacationAdd' })
        } else {
          this.$router.push({ name: 'Signin' })
        }
      }
    }
  }
</script>
