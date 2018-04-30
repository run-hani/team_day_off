<template>
  <div>
    <h3 class="h-t01 t_aside">대체휴가 사용내역
      <div class="aside">
        <select name="" id="" class="select wf80" v-model="printData.userId">
          <option v-for="opt in options.userId" :value="opt.value">{{ opt.label }}</option>
        </select>

        <select name="" id="" class="select wf80" v-model="printData.selecYear">
          <option value="2017">2017</option>
          <option value="2018">2018</option>
        </select>
        <button class="btn t_m wf60 c_weight" @click="getVacation">확인</button>
      </div>
    </h3>

    <p class="txt-t02" v-if="isPrint"><strong class="em-c04">{{ getData.userId }}</strong>의 <span class="em-c02">{{ getData.selecYear }}</span>년 대체휴가 사용내역입니다.</p>
    <p class="box-t01 t_info" v-if="!isPrint"><strong>{{ getData.selecYear }}</strong>년에 사용한 대체휴가가 없습니다.</p>

    <div class="box-t01 t_info">
      <h4 class="h-t04"><strong>휴가산정  방법</strong></h4>
      <ul class="list-t01">
        <li><strong>'16시간 = 1일'</strong> 인 경우 : 모든 프로젝트 주중 야근 시 계산되며 8시간 이상 시 반올림 처리 됨. <small class="em-c01">(ex. 10시간 근무 = 1일, 23시간 근무 = 1일, 29시간 근무 2일)</small></li>
        <li><strong>'8시간 = 1일'</strong> 인 경우 : '온라인 스토어' 프로젝트 이외 모든 프로젝트 주말/휴일 출근 시.</li>
      </ul>
    </div>

    <table class="tbl-list01" v-if="isPrint">
      <colgroup>
        <col style="width:20%">
        <col style="width:20%">
        <col style="width:20%">
        <col style="width:20%">
        <col style="width:20%">
      </colgroup>
      <thead>
      <tr>
        <th scope="col">월</th>
        <th scope="col">발생<br>(16시간 = 1일)</th>
        <th scope="col">발생<br>(8시간 = 1일)</th>
        <th scope="col">발생 합계</th>
        <th scope="col">사용</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>직전 총계</td>
        <td><span class="em-slight">{{ countBeforeWorkTime }}</span></td>
        <td><span class="em-slight">{{ countBeforeWorkTimeX2 }}</span></td>
        <td><span>{{ countBeforeCalcWorkTime }}<br>
          합계 : {{ countBeforeAllWorkTime }}</span></td>
        <td>{{ countBeforeUseVacation }}<br>
          합계 : {{ countBeforeAllUseVacation }}</td>
      </tr>
      <tr v-for="idx in 12" :class="{tr_active: idx == dateNewM()}">
        <td>{{ idx }}월</td>
        <td><span class="em-slight">{{ countWorkTime[idx-1] }}</span></td>
        <td><span class="em-slight">{{ countWorkTimeX2[idx-1] }}</span></td>
        <td><span>{{ countCalcWorkTime[idx-1] }}</span></td>
        <td>{{ countUseVacation[idx-1] }}</td>
      </tr>
      <tr>
        <td><strong>총계</strong></td>
        <td colspan="4">
          <div class="tag-t02">( <strong>작년 : <span class="em-c04">{{ countBeforeAllWorkTime - countBeforeAllUseVacation }}</span></strong> 일</div> +
          <div class="tag-t02"><strong>발생 : <span class="em-c04">{{ countAllWorkTime }}</span></strong> 일 )</div> -
          <div class="tag-t02"><strong>사용 : <span class="em-c03">{{ countAllUseVacation }}</span></strong> 일</div>
          <div class="tag-t02"><strong>= 잔여 : <span class="em-c02">{{ countAllWorkTime - countAllUseVacation + (countBeforeAllWorkTime - countBeforeAllUseVacation) }}</span></strong> 일</div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import option from '@/components/common/data/options'
  import { dateYYYYMMDD, dateYYYY, dateM, dateNewYYYY, dateNewM } from '@/mixins/momentDate'
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
        listWorkTime: [],
        countWorkTime: [],
        listWorkTimeX2: [],
        countWorkTimeX2: [],
        countCalcWorkTime: [],
        countAllWorkTime: 0,

        listOccurVacation: [],
        listUseVacation: [],
        countUseVacation: [],
        countAllUseVacation: 0,

        countBeforeWorkTime: {},
        countBeforeWorkTimeX2: {},
        countBeforeCalcWorkTime: {},
        countBeforeAllWorkTime: 0,
        countBeforeUseVacation: {},
        countBeforeAllUseVacation: 0,

        getData: {
          userId: 'PD',
          selecYear: this.dateNewYYYY()
        },
        printData: {
          userId: 'PD',
          selecYear: this.dateNewYYYY()
        },
        isPrint: false,
        options: option
      }
    },
    methods: {
      dateYYYY,
      dateM,
      dateYYYYMMDD,
      dateNewYYYY,
      dateNewM,

      getVacation () {
        axios.get('https://friends-vacation.firebaseio.com/list_useVacation.json')
          .then(res => {
            console.log(res)
            const data = res.data
            const datas = []
            this.listUseVacation = []
            this.countUseVacation = [0,0,0,0,0,0,0,0,0,0,0,0]
            this.countBeforeUseVacation = {}
            this.countBeforeAllUseVacation = 0

            let selecUserId = this.printData.userId
            let selecYear = this.printData.selecYear

            this.getData.userId = this.printData.userId
            this.getData.selecYear = this.printData.selecYear

            for (let key in data) {
              let selecYear_temp = this.dateYYYY(data[key].useDate)

              if (selecUserId == data[key].userId && selecYear == selecYear_temp) {
                const tempData = {
                  id: key,
                  userId: data[key].userId,
                  useDate: this.dateYYYYMMDD(data[key].useDate)
                }
                datas.push(tempData)
                this.setMonthData(this.countUseVacation, data[key])
              }

              // 직전년도 사용일 검색
              if (selecUserId == data[key].userId && selecYear > selecYear_temp) {
                let _temp = this.countBeforeUseVacation
                if(_temp[selecYear_temp] == null)
                  _temp[selecYear_temp] = 0
                _temp[selecYear_temp] += 1
                this.countBeforeAllUseVacation += 1
              }
            }

            /* 선택년도 사용일 합산 */
            this.countAllUseVacation = this.getCountAll(this.countUseVacation)

            if(datas.length) {
              this.listUseVacation = datas
              this.isPrint = true
            }else{
              this.isPrint = false
            }

            this.getWorks()
          })
          .catch(error => {
            console.log(error)
          })
      },
      getWorks () {
        axios.get('https://friends-vacation.firebaseio.com/list_vacation.json')
          .then(res2 => {
            console.log(res2)

            const data = res2.data
            const datas = []
            this.listWorkTime = []
            this.countWorkTime = [0,0,0,0,0,0,0,0,0,0,0,0]
            this.countWorkTimeX2 = [0,0,0,0,0,0,0,0,0,0,0,0]
            this.countCalcWorkTime = [0,0,0,0,0,0,0,0,0,0,0,0]
            this.countBeforeWorkTime = {}
            this.countBeforeWorkTimeX2 = {}
            this.countBeforeCalcWorkTime = {}
            this.countBeforeAllWorkTime = 0

            let selecUserId = this.printData.userId
            let selecYear = this.printData.selecYear

            let _temp = this.countBeforeWorkTime
            let _temp2 = this.countBeforeWorkTimeX2
            let _temp3 = this.countBeforeCalcWorkTime
            let countBeforeAll = this.countBeforeAllWorkTime

            this.getData.userId = this.printData.userId
            this.getData.selecYear = this.printData.selecYear

            for (let key in data) {
              let selecYear_temp = this.dateYYYY(data[key].workDate)
              let selecMonth_temp = this.dateM(data[key].workDate)

              if (selecUserId == data[key].userId && selecYear === selecYear_temp) {
                const tempData = {
                  id: key,
                  userId: data[key].userId,
                  pjType: data[key].pjType,
                  workHours: data[key].workHours,
                  workDate: this.dateYYYYMMDD(data[key].workDate),
                  isWeekend: data[key].isWeekend
                }

                datas.push(tempData)
                if (!tempData.isWeekend) {
                  // 평일 : 모든 프로젝트 공통
                  switch(this.dateM(data[key].workDate)) {
                    case "1": this.countWorkTime[0] += data[key].workHours; break
                    case "2": this.countWorkTime[1] += data[key].workHours; break
                    case "3": this.countWorkTime[2] += data[key].workHours; break
                    case "4": this.countWorkTime[3] += data[key].workHours; break
                    case "5": this.countWorkTime[4] += data[key].workHours; break
                    case "6": this.countWorkTime[5] += data[key].workHours; break
                    case "7": this.countWorkTime[6] += data[key].workHours; break
                    case "8": this.countWorkTime[7] += data[key].workHours; break
                    case "9": this.countWorkTime[8] += data[key].workHours; break
                    case "10": this.countWorkTime[9] += data[key].workHours; break
                    case "11": this.countWorkTime[10] += data[key].workHours; break
                    case "12": this.countWorkTime[11] += data[key].workHours; break
                  }
                } else if (tempData.isWeekend && tempData.pjType != 0) {
                  // 주말 또는 휴일 : 온라인스토어는 제외
                  switch(this.dateM(data[key].workDate)) {
                    case "1": this.countWorkTimeX2[0] += data[key].workHours; break
                    case "2": this.countWorkTimeX2[1] += data[key].workHours; break
                    case "3": this.countWorkTimeX2[2] += data[key].workHours; break
                    case "4": this.countWorkTimeX2[3] += data[key].workHours; break
                    case "5": this.countWorkTimeX2[4] += data[key].workHours; break
                    case "6": this.countWorkTimeX2[5] += data[key].workHours; break
                    case "7": this.countWorkTimeX2[6] += data[key].workHours; break
                    case "8": this.countWorkTimeX2[7] += data[key].workHours; break
                    case "9": this.countWorkTimeX2[8] += data[key].workHours; break
                    case "10": this.countWorkTimeX2[9] += data[key].workHours; break
                    case "11": this.countWorkTimeX2[10] += data[key].workHours; break
                    case "12": this.countWorkTimeX2[11] += data[key].workHours; break
                  }
                }
              } else if (selecUserId == data[key].userId && selecYear > selecYear_temp) {
                //alert("!")
              }

              // 직전년도 발생 합계
              if (selecUserId == data[key].userId && selecYear > selecYear_temp) {
                const tempData = {
                  workHours: data[key].workHours,
                  workYear: this.dateYYYY(data[key].workDate),
                  workMonth: this.dateM(data[key].workDate),
                  isWeekend: data[key].isWeekend
               }

                if(_temp[selecYear_temp] == null)
                  _temp[selecYear_temp] = new Array()

                if(_temp2[selecYear_temp] == null)
                  _temp2[selecYear_temp] = new Array()

                // 평일
                if (!tempData.isWeekend) {
                  if(_temp[selecYear_temp][selecMonth_temp] == null)
                    _temp[selecYear_temp][selecMonth_temp] = 0

                  _temp[selecYear_temp][selecMonth_temp] += tempData.workHours
                  console.log(selecYear_temp + ":" +_temp[selecYear_temp][selecMonth_temp])

                // 주말 또는 휴일 : 온라인스토어는 제외
                } else if (tempData.isWeekend && tempData.pjType != 0) {

                  if(_temp2[selecYear_temp][selecMonth_temp] == null)
                    _temp2[selecYear_temp][selecMonth_temp] = 0

                  _temp2[selecYear_temp][selecMonth_temp] += (tempData.workHours * 2)
                }

                _temp3[selecYear_temp] = new Array()
                //console.log(_temp)
              }
            }

            var temp4 = Object.keys(_temp3)

            for(let i = 0; i < Object.keys(_temp3).length; i++){
              let curYear = temp4[i]

              for(let j = 0; j < 13; j++) {
                if(_temp[curYear][j] == null)
                  _temp[curYear][j] = 0

                if(_temp2[curYear][j] == null)
                  _temp2[curYear][j] = 0

                _temp3[curYear][j] = _temp[curYear][j] + _temp2[curYear][j]
              }
            }

            //직전년도 계산
            for(let i = 0; i < Object.keys(_temp3).length; i++){
              let curYear = temp4[i]
              for(let j = 0; j < 13; j++) {

                this.countBeforeAllWorkTime += parseInt(_temp3[curYear][j] / 16)

                if((_temp3[curYear][j] % 16) >= 8)
                {
                  this.countBeforeAllWorkTime += 1
                }

              }
            }

            for (let i = 0; i < this.countWorkTime.length; i++) {
              let temp_sum = this.countWorkTime[i] + (this.countWorkTimeX2[i] * 2)

              this.countCalcWorkTime[i] = parseInt(temp_sum / 16)

              if(parseInt(temp_sum % 16) >= 8)
              {
                this.countCalcWorkTime[i] += 1
              }
            }

            /* 발생일 합산 */
            this.countAllWorkTime = this.getCountAll(this.countCalcWorkTime)

            if(datas.length) {
              this.listWorkTime = datas
              this.isPrint = true
            }else{
              this.isPrint = false
            }

          })
          .catch(error => {
            console.log(error)
          })
      },
      getCountAll (arr) {
        let count = 0
        for (let i = 0; i < arr.length; i++) {
          count += Number(arr[i])
        }
        return count
      },
      setMonthData (arr, dataKey) {
        switch(this.dateM(dataKey.useDate)) {
          case "1": arr[0] += 1; break
          case "2": arr[1] += 1; break
          case "3": arr[2] += 1; break
          case "4": arr[3] += 1; break
          case "5": arr[4] += 1; break
          case "6": arr[5] += 1; break
          case "7": arr[6] += 1; break
          case "8": arr[7] += 1; break
          case "9": arr[8] += 1; break
          case "10": arr[9] += 1; break
          case "11": arr[10] += 1; break
          case "12": arr[11] += 1; break
        }
      }
    },
    created () {
      this.getVacation()
      this.getWorks()
    }
  }
</script>
