<template>
  <div>
    <h3 class="h-t01 t_aside">추가근무 내역 검색
      <div class="aside">
        <select class="select wf80" v-model="printData.userId">
          <option v-for="opt in options.userId" :value="opt.value">{{ opt.label }}</option>
        </select>

        <select class="select wf80" v-model="printData.selecYear">
          <option value="2017">2017</option>
          <option value="2018">2018</option>
        </select>

        <select class="select wf80" v-model="printData.selecMonth">
          <option v-for="opt in options.month" :value="opt.value">{{ opt.label }}</option>
        </select>
        <button class="btn t_m wf60 c_weight" @click="getWorks">확인</button>
      </div>
    </h3>

    <p class="txt-t02" v-if="isPrint"><strong class="em-c04">{{ getData.userId }}</strong>의 <span class="em-c02">{{ getData.selecYear }}</span>년 <span class="em-c02">{{ getData.selecMonth }}</span>월 추가근무내역 검색결과입니다.</p>
    <p class="box-t01 t_info" v-if="!isPrint"><span class="em-c02">{{ getData.selecYear }}</span>년 <span class="em-c02">{{ getData.selecMonth }}</span>월에 입력된 추가근무내역이 없습니다.</p>

    <table class="tbl-list01" v-if="isPrint">
      <colgroup>
        <col style="width:25%">
        <col style="width:75%">
      </colgroup>
      <thead>
      <tr>
        <th scope="col">등록일</th>
        <th scope="col">시간</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(user, key, idx) in works">
        <td :class="{ 'em-c02': user.isWeekend }">{{ user.workDate }}</td>
        <td :class="{ 'em-c02': user.isWeekend }">{{ user.workHours }}</td>
      </tr>
      <tr>
        <td><strong>총계</strong></td>
        <td>
          <div class="tag-t02"><strong>평일 : <span class="em-c04">{{ printHoursWeekday }}</span></strong> 시간</div>
          <div class="tag-t02"><strong>주말 (공휴일) : <span class="em-c02">{{ printHoursWeekend }}</span></strong> 시간</div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import option from '@/components/common/data/options'
  import { dateNewYYYY, dateNewMM, dateYYYYMMDD, dateYYYYMM } from '@/mixins/momentDate'
  import * as firebase from 'firebase';
  import Datepicker from 'vuejs-datepicker';
  import axios from 'axios'

  export default {
    name: 'WorkList',
    components: {
      Datepicker
    },
    data: function () {
      return {
        getData: {
          userId: 'PD',
          selecYear: this.dateNewYYYY(),
          selecMonth: this.dateNewMM()
        },
        printData: {
          userId: 'PD',
          selecYear: this.dateNewYYYY(),
          selecMonth: this.dateNewMM()
        },
        works: [],
        printHoursWeekday: 0,
        printHoursWeekend: 0,
        isPrint: false,
        options: option
      }
    },
    methods: {
      dateNewYYYY,
      dateNewMM,
      dateYYYYMMDD,
      dateYYYYMM,

      getWorks () {
        axios.get('https://friends-vacation.firebaseio.com/list_vacation.json')
          .then(res => {
            console.log(res)

            const data = res.data
            const datas = []

            this.works = []
            this.printHoursWeekday = 0
            this.printHoursWeekend = 0

            let selecUserId = this.printData.userId
            let selecMonth = this.printData.selecYear.toString() + this.printData.selecMonth

            this.getData.userId = this.printData.userId
            this.getData.selecYear = this.printData.selecYear
            this.getData.selecMonth = this.printData.selecMonth

            for (let key in data) {
              let selecMoth_temp = this.dateYYYYMM(data[key].workDate)

              if (selecUserId == data[key].userId && selecMonth == selecMoth_temp) {
                const tempData = {
                  id: key,
                  userId: data[key].userId,
                  workHours: data[key].workHours,
                  workDate: this.dateYYYYMMDD(data[key].workDate),
                  isWeekend: data[key].isWeekend
                }

                datas.push(tempData)
                if (tempData.isWeekend) {
                  this.printHoursWeekend += Number(data[key].workHours)
                } else {
                  this.printHoursWeekday += Number(data[key].workHours)
                }
              }
            }

            if(datas.length) {
              this.works = datas
              this.isPrint = true
            }else{
              this.isPrint = false
            }

          })
          .catch(error => {
            console.log(error)
          })
      }
    },
    created () {
      this.getWorks()
    }
  }
</script>
