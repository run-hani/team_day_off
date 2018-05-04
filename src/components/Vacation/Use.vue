<template>
  <div id="contents" class="contents">

    <header class="spot-t01">
      <h2 class="h-spot">대체휴가 사용</h2>
      <div class="breadcrumb">
        <a href="" class="ico_ home">home</a> &gt;
        <strong>대체휴가 사용</strong>
      </div>
    </header>

    <div class="contents-in mxWf-1200">
      <h3 class="h-t01">대체휴가 사용일 입력</h3>
      <p class="txt-t02">대체휴가 사용일을 입력 해주세요.</p>

      <div class="box-srch05">
        <div class="wrapData">
          <select name="" id="" class="select wf80" v-model="useData.userId">
            <option v-for="opt in options.userId" :value="opt.value">{{ opt.label }}</option>
          </select>

          <datepicker v-model="useData.useDate" name="uniquename" language="ko" :format="dateYYYYMMDD"></datepicker>
          <input type="text" class="input wf300" v-model="useData.desc" placeholder="비고 입력란">
          <button class="btn t_m wf60 c_weight" @click="useVacation">확인</button>
        </div>
      </div>

      <hr>
      <div class="row">
        <table class="tbl-list01">
          <colgroup>
            <col style="width:15%">
            <col style="width:20%">
            <col style="width:50%">
            <col style="width:15%">
          </colgroup>
          <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">사용일</th>
            <th scope="col">비고</th>
            <th scope="col">삭제</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(user, idx) in listUseVacation" :id="user.id">
            <td>{{ user.userId }}</td>
            <td>{{ user.useDate }}</td>
            <td>{{ user.desc }}</td>
            <td><button @click="deleteVacation(user.id, idx)">삭제</button></td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <!--//contents -->
</template>

<script>
  import option from '@/components/common/data/options'
  import { dateYYYYMMDD, sortAscending } from '@/mixins/momentDate'
  import * as firebase from 'firebase'
  import Datepicker from 'vuejs-datepicker'
  import axios from 'axios'

  export default {
    name: 'VacationUse',
    data: function () {
      return {
        listUseVacation: [],
        useData: {
          userId: 'PD',
          useDate: new Date(),
          desc: '',
          editDate: new Date()
        },
        flagAddEvt: 0,
        options: option
      }
    },
    methods: {
      dateYYYYMMDD,
      sortAscending,

      useVacation () {
        if (this.flagAddEvt) return
        this.flagAddEvt = 1

        axios.post('https://friends-vacation.firebaseio.com/list_useVacation.json', {
          userId: this.useData.userId,
          useDate: this.useData.useDate,
          desc: this.useData.desc,
          editDate: this.useData.editDate
        })
          .then(res => {
            this.useData.workHours = null
            this.useData.desc = ''
            this.getVacation()
            this.flagAddEvt = 0
          })
          .catch(error => {
            console.log(error)
          })
      },
      getVacation () {
        axios.get('https://friends-vacation.firebaseio.com/list_useVacation.json')
          .then(res => {
            //console.log(res)
            const data = res.data
            const datas = []
            this.listUseVacation = []

            for (let key in data) {
              const tempData = {
                id: key,
                userId: data[key].userId,
                useDate: this.dateYYYYMMDD(data[key].useDate),
                desc: data[key].desc
              }
              datas.push(tempData)
            }

            /* 날짜별 소팅 */
            this.sortAscending(datas, 'useDate', "-")
            this.listUseVacation = datas
          })
          .catch(error => {
            console.log(error)
          })
      },
      deleteVacation (userId, idx) {
        let isConfirm = confirm('정말로 삭제하시겠습니까?')
        if (!isConfirm) {
          return;
        }
        firebase.database().ref('list_useVacation').child(userId).remove()
        this.listUseVacation.splice(idx,1)
      }
    },
    created () {
      this.getVacation()
    },
    components: {
      Datepicker
    }
  }
</script>
