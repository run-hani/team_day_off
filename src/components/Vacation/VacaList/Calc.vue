<template>
  <div>
    <h3 class="h-t01 t_aside">대체휴가 사용내역
      <div class="aside">
        <select name="" id="" class="select wf80" v-model="printData.userId">
          <option v-for="opt in options.userId" :value="opt.value">{{ opt.label }}</option>
        </select>

        <select name="" id="" class="select wf80" v-model="printData.selecYear">
          <option v-for="opt2 in options.year" :value="opt2.value">{{ opt2.label }}</option>
        </select>
        <button class="btn t_m wf60 c_weight" @click="getWorkAndVaca">확인</button>
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
        <th scope="col">평일<br>(16시간 = 1일)</th>
        <th scope="col">주말<br>(8시간 = 1일)</th>
        <th scope="col">발생 합계</th>
        <th scope="col">사용</th>
      </tr>
      </thead>
      <tbody>
      <tr class="tr_dashedBg">
        <td><strong>전년도 총계</strong></td>
        <td><span class="em-slight">-</span></td>
        <td><span class="em-slight">-</span></td>
        <td><span>{{ countBeforeAllWorkTime }}</span></td>
        <td>{{ countBeforeAllUseVacation }}</td>
      </tr>
      <tr v-for="idx in 12" :class="{tr_active: idx == dateNewM()}">
        <td>{{ idx }}월</td>
        <td>
          <strong v-if="countWorkTime[idx-1]">{{ countWorkTime[idx-1] }}</strong>
          <span class="em-slight" v-else>0</span>
        </td>
        <td>
          <strong v-if="countWorkTimeX2[idx-1]">{{ countWorkTimeX2[idx-1] }}</strong>
          <span class="em-slight" v-else>0</span>
        </td>
        <td>
          <strong class="em-c04" v-if="countCalcWorkTime[idx-1]">{{ countCalcWorkTime[idx-1] }}</strong>
          <span class="em-slight" v-else>0</span>
        </td>
        <td>
          <strong class="em-c03" v-if="countUseVacation[idx-1]">{{ countUseVacation[idx-1] }}</strong>
          <span class="em-slight" v-else>0</span>
        </td>
      </tr>
      <tr class="tr_result">
        <td><strong>총계</strong></td>
        <td colspan="4">
          <div class="tag-t02">( <strong>전년도 잔여 : <span class="em-c04">{{ countBeforeAllWorkTime - countBeforeAllUseVacation }}</span></strong> 일</div> +
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

      getWorkAndVaca () {
        this.getVacation()
        this.getWorks()
      },
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
              let _year = this.dateYYYY(data[key].useDate)

              if (selecUserId == data[key].userId && selecYear == _year) {
                const tempData = {
                  id: key,
                  userId: data[key].userId,
                  useDate: this.dateYYYYMMDD(data[key].useDate)
                }

                datas.push(tempData)

                this.setMonthData(this.dateM(data[key].useDate), this.countUseVacation, 1)
              }

              // 직전년도 사용일 검색
              if (selecUserId == data[key].userId && selecYear > _year) {
                let _temp = this.countBeforeUseVacation

                if(_temp[_year] == null)
                  _temp[_year] = 0
                _temp[_year] += 1
                this.countBeforeAllUseVacation += 1
              }
            }

            // 선택년도 사용일 합산
            this.countAllUseVacation = this.getCountAll(this.countUseVacation)

            // 데이터 노출 여부 체크
            this.checkPrintData(datas, this.listUseVacation)
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

            let _arrWork = this.countBeforeWorkTime
            let _arrWorkX2 = this.countBeforeWorkTimeX2
            let _arrCalc = this.countBeforeCalcWorkTime

            this.getData.userId = this.printData.userId
            this.getData.selecYear = this.printData.selecYear

            for (let key in data) {
              let _year = this.dateYYYY(data[key].workDate)
              let _month = this.dateM(data[key].workDate)

              if (selecUserId == data[key].userId && selecYear === _year) {

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
                  this.setMonthData(this.dateM(data[key].workDate), this.countWorkTime, data[key].workHours)
                } else if (tempData.isWeekend && tempData.pjType != 0) {
                  // 주말 또는 휴일 : 온라인스토어는 제외
                  this.setMonthData(this.dateM(data[key].workDate), this.countWorkTimeX2, data[key].workHours)
                }
              }

              // 직전년도 발생 합계
              if (selecUserId == data[key].userId && selecYear > _year) {
                const tempData = {
                  pjType: data[key].pjType,
                  workHours: data[key].workHours,
                  workYear: this.dateYYYY(data[key].workDate),
                  workMonth: this.dateM(data[key].workDate),
                  isWeekend: data[key].isWeekend
                }

                if(_arrWork[_year] == null)
                  _arrWork[_year] = new Array()

                if(_arrWorkX2[_year] == null)
                  _arrWorkX2[_year] = new Array()

                // 평일
                if (!tempData.isWeekend) {
                  if(_arrWork[_year][_month] == null)
                    _arrWork[_year][_month] = 0

                  _arrWork[_year][_month] += tempData.workHours

                // 주말 또는 휴일 : 온라인스토어는 제외
                } else if (tempData.isWeekend && tempData.pjType != 0) {
                  if(_arrWorkX2[_year][_month] == null)
                    _arrWorkX2[_year][_month] = 0

                  _arrWorkX2[_year][_month] += (tempData.workHours * 2)
                }
                _arrCalc[_year] = new Array()
              }
            }

            let _arrCalcKeys = Object.keys(_arrCalc)

            // 직전 년도 데이터 넣기
            for(let i = 0; i < _arrCalcKeys.length; i++){
              let curYear = _arrCalcKeys[i]

              for(let j = 0; j < 13; j++) {
                if(_arrWork[curYear][j] == null)
                  _arrWork[curYear][j] = 0

                if(_arrWorkX2[curYear][j] == null)
                  _arrWorkX2[curYear][j] = 0

                _arrCalc[curYear][j] = _arrWork[curYear][j] + _arrWorkX2[curYear][j]
              }
            }

            // 직전 년도 계산
            for(let i = 0; i < _arrCalcKeys.length; i++){
              let curYear = _arrCalcKeys[i]

              for(let j = 0; j < 13; j++) {
                this.countBeforeAllWorkTime += parseInt(_arrCalc[curYear][j] / 16)

                if((_arrCalc[curYear][j] % 16) >= 8)
                  this.countBeforeAllWorkTime += 1
              }
            }

            // 현재 년도 계산
            for (let i = 0; i < this.countWorkTime.length; i++) {
              let _sum = this.countWorkTime[i] + (this.countWorkTimeX2[i] * 2)

              this.countCalcWorkTime[i] = parseInt(_sum / 16)

              if(parseInt(_sum % 16) >= 8)
                this.countCalcWorkTime[i] += 1
            }

            // 발생일 합산
            this.countAllWorkTime = this.getCountAll(this.countCalcWorkTime)

            // 데이터 노출 여부 체크
            this.checkPrintData(datas, this.listWorkTime)

          })
          .catch(error => {
            console.log(error)
          })
      },
      checkPrintData (data, arr) {
        if (data.length) {
          arr = data
          this.isPrint = true
        } else {
          this.isPrint = false
        }
      },
      setMonthData (guess, getArr, pushData) {
        switch(guess) {
          case "1": getArr[0] += pushData; break
          case "2": getArr[1] += pushData; break
          case "3": getArr[2] += pushData; break
          case "4": getArr[3] += pushData; break
          case "5": getArr[4] += pushData; break
          case "6": getArr[5] += pushData; break
          case "7": getArr[6] += pushData; break
          case "8": getArr[7] += pushData; break
          case "9": getArr[8] += pushData; break
          case "10": getArr[9] += pushData; break
          case "11": getArr[10] += pushData; break
          case "12": getArr[11] += pushData; break
        }
      },
      getCountAll (arr) {
        let count = 0
        for (let i = 0; i < arr.length; i++) {
          count += Number(arr[i])
        }
        return count
      }
    },
    created () {
      this.getVacation()
      this.getWorks()
    }
  }
</script>
