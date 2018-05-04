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
        <div class="wrap_login">
          <p>회원가입을 위한 정보를 입력해주세요.</p>
          <div class="box-login">
            <div class="mb10">
              <input type="text" class="input w100" placeholder="닉네임 ( ex. hani )" ref="formUserId" v-model="userId" v-on:blur="validUserId()">
              <span v-if="invalid.userId" class="em-weightier">정확한 닉네임을 입력해주세요.</span>
            </div>
            <div class="mb10">
              <input type="text" class="input w100" placeholder="이메일 ( ex. hani.run@kakaocorp.com )" ref="formEmail" v-model="email" v-on:blur="validEmail()">
              <span v-if="invalid.email" class="em-weightier">정확한 이메일을 입력해주세요.</span>
            </div>
            <div class="mb10">
              <input type="text" class="input w100" placeholder="휴대폰번호 ( - 없이 입력)" ref="formPhone" v-model="phone" v-on:blur="validPhone()">
              <span v-if="invalid.phone" class="em-weightier">정확한 휴대폰번호를 입력해주세요.</span>
            </div>
            <button type="submit" class="btn t_l w100 c_weight">가입하기</button>
            <div class="txt_join">
              <router-link to="/Signin">계정이 생각나셨나요?</router-link>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'Signup',
    data: function () {
      return {
        users: [],
        userId: 'hani',
        email: 'myrnvl@nate.com',
        phone: '01048181426',
        invalid: {
          userId: false,
          email: false,
          phone: false
        },
        reg: {
          userId: /^[a-zA-Z\s]{2,30}$/,
          email: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/,
          phone: /^[0-9]{10,15}$/
        }
      }
    },
    methods: {
      onSubmit () {
        const formData = {
          userId: this.userId,
          email: this.email,
          password: this.phone
        }

        if(!this.validUserId()) return false;
        if(!this.validEmail()) return false;
        if(!this.validPhone()) return false;

        this.getUserList();
        if(!this.validDuplicateUserId()) return false;

        this.$store.dispatch('signup', formData)
      },
      validUserId () {
        let _userId = this.invalid.userId = !this.reg.userId.test(this.userId) ? true : false;
        if (_userId) return false;

        return true;
      },
      validEmail () {
        let _email = this.invalid.email = !this.reg.email.test(this.email) ? true : false;
        if (_email) return false;

        return true;
      },
      validPhone () {
        let _phone = this.invalid.phone = !this.reg.phone.test(this.phone) ? true : false;
        if (_phone) return false;

        return true;
      },
      validDuplicateUserId () {
        for(let key of this.users) {
          if(this.userId == key) {
            alert("같은 닉네임이 존재합니다. 가입 내역을 확인해주세요.")
            return false;
          }
        }
        return true;
      },
      getUserList () {
        let _users = [];

        axios.get('/users.json')
          .then(res => {
            const data = res.data

            for (let key in data) {
              const tempData =  data[key].userId
              _users.push(tempData)
            }
            this.users = _users;
          })
          .catch(error => console.log(error))
      }
    },
    created () {
      this.getUserList()
    }
  }
</script>
