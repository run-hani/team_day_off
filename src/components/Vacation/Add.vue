<template>
  <div id="contents" class="contents">

    <header class="spot-t01">
      <h2 class="h-spot">추가근무 등록</h2>
      <div class="breadcrumb">
        <a href="" class="ico_ home">home</a> &gt;
        <strong>추가근무 등록</strong>
      </div>
    </header>

    <div class="contents-in mxWf-1200">
      <h3 class="h-t01">작업시간 입력</h3>
      <p class="txt-t02">추가근무내역을 입력 해주세요.</p>

      <div class="box-srch05">
        <div class="wrapData">
          <select name="" id="" class="select wf80" v-model="addData.userId">
            <option v-for="opt in options.userId" :value="opt.value">{{ opt.label }}</option>
          </select>

          <select name="" class="select wf120" v-model="addData.pjType">
            <option v-for="opt in options.pjType" :value="opt.value">{{ opt.label }}</option>
          </select>

          <datepicker v-model="addData.workDate" name="uniquename" language="ko" :format="dateYYYYMMDD"></datepicker>
          <input type="number" class="input wf150 m-w40" placeholder="작업시간 (숫자로 기입)" v-model="addData.workHours">
          <button class="btn t_m wf60 c_weight" @click="addVacation">확인</button>
        </div>
      </div>

      <hr>
      <div class="row">
        <table class="tbl-list01">
          <colgroup>
            <col style="width:15%">
            <col style="width:15%">
            <col style="width:15%">
            <col style="width:15%">
            <col style="width:15%">
            <col style="width:10%">
          </colgroup>
          <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">프로젝트</th>
            <th scope="col">평일/주말</th>
            <th scope="col">등록일</th>
            <th scope="col">작업시간</th>
            <th scope="col">삭제</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(user, idx) in listVacation" :id="user.id">
            <td>{{ user.userId }}</td>
            <td>{{ user.pjType }}</td>
            <td><span v-if="user.isWeekend" class="em-c02">주말</span><span v-else>평일</span></td>
            <td>{{ user.workDate }}</td>
            <td>{{ user.workHours }}</td>
            <td><button @click="deleteWork(user.id, idx)">삭제</button></td>
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
  import { dateYYYYMMDD } from '@/mixins/momentDate'
  import * as firebase from 'firebase'
  import Datepicker from 'vuejs-datepicker'
  import holidayKR from 'holiday-kr'
  import axios from 'axios'

  export default {
    name: 'VacationAdd',
    data: function () {
      return {
        listVacation: [],
        addData: {
          userId: 'PD',
          pjType: '0',
          isWeekend: 0,
          workDate: new Date(),
          workHours: null,
          editDate: ''
        },
        listPjType: ["온라인 스토어", "라이센시", "PRMS"],
        flagAddEvt: 0,
        options: option
      }
    },
    methods: {
      dateYYYYMMDD,
      addVacation () {
        if (this.addData.workHours === null) { alert("작업 시간을 입력해 주세요."); return }
        if (this.flagAddEvt) return

        this.flagAddEvt = 1
        let _getDay = this.addData.workDate.getDay()
        let _workDate = this.addData.workDate

        /* 주말, 공휴일 체크 */
        if(_getDay == 0 || _getDay == 6 || holidayKR.isSolarHoliday(_workDate.getFullYear(), _workDate.getMonth()+1, _workDate.getDate())) {
          this.addData.isWeekend = 1
        } else {
          this.addData.isWeekend = 0
        }

        /* 엽력내용 전송 */
        axios.post('https://friends-vacation.firebaseio.com/list_vacation.json', {
          userId: this.addData.userId,
          pjType: Number(this.addData.pjType),
          workDate: this.addData.workDate,
          workHours: Number(this.addData.workHours),
          editDate: this.addData.editDate,
          isWeekend: this.addData.isWeekend
        })
        .then(res => {
          console.log(res)
          this.addData.workHours = null
          this.getVacation()
          this.flagAddEvt = 0
        })
        .catch(error => {
          console.log(error)
        })
      },
      getVacation () {
        axios.get('https://friends-vacation.firebaseio.com/list_vacation.json')
          .then(res => {
            //console.log(res)
            const data = res.data
            const datas = []
            this.listVacation = []

            for (let key in data) {
              const tempData = {
                id: key,
                userId: data[key].userId,
                pjType: this.listPjType[data[key].pjType],
                workDate: this.dateYYYYMMDD(data[key].workDate),
                workHours: data[key].workHours,
                isWeekend: data[key].isWeekend
              }
              datas.push(tempData)
            }

            /* 날짜별 소팅 */
            datas.sort((a,b) => {
              let arr0 = a.workDate.toString().split("-")
              let arr1 = b.workDate.toString().split("-")
              let date_a = new Date(arr0[0],arr0[1]-1,arr0[2])
              let date_b = new Date(arr1[0],arr1[1]-1,arr1[2])

              if (date_a < date_b) return 1
              if (date_a > date_b) return -1
            })

            this.listVacation = datas
          })
          .catch(error => {
            console.log(error)
          })
      },
      deleteWork (userId, idx) {
        let isConfirm = confirm('정말로 삭제하시겠습니까?')
        if (!isConfirm) {
          return;
        }
        firebase.database().ref('list_vacation').child(userId).remove()
        this.listVacation.splice(idx,1)
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
