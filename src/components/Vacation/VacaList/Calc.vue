<template>
  <div>
    <h3 class="h-t01 t_aside">대체휴가 사용내역
      <div class="aside">
        <select name="" id="" class="select wf80" v-model="printData.userId">
          <option v-for="opt in options.userId" :value="opt.value">{{ opt.label }}</option>
        </select>

        <select name="" id="" class="select wf80" v-model="printData.selecYear">
          <option value="2018">2018</option>
        </select>
        <button class="btn t_m wf60 c_weight" @click="getVacation">확인</button>
      </div>
    </h3>

    <p class="txt-t02" v-if="isPrint"><strong class="em-c04">{{ getData.userId }}</strong>의 <span class="em-c02">{{ getData.selecYear }}</span>년 대체휴가 사용내역입니다.</p>
    <p class="box-t01 t_info" v-if="!isPrint"><strong>{{ getData.selecYear }}</strong>년에 사용한 대체휴가가 없습니다.</p>

    <table class="tbl-list01" v-if="isPrint">
      <colgroup>
        <col style="width:25%">
        <col style="width:25%">
        <col style="width:25%">
        <col style="width:25%">
      </colgroup>
      <thead>
      <tr>
        <th scope="col">월</th>
        <th scope="col">발생</th>
        <th scope="col">사용</th>
      </tr>
      </thead>
      <tbody>
      <!--<tr v-for="(user, key, idx) in listUseVacation">-->
        <!--<td>{{ user.userId }}</td>-->
        <!--<td>{{ user.useDate }}</td>-->
      <!--</tr>-->
      <tr v-for="idx in 12">
        <td>{{ idx }}월</td>
        <td><span>{{ countCalcWorkTime[idx-1] }}</span> <span v-if="countWorkTime[idx-1]" class="em-slight">( {{ countWorkTime[idx-1] }} )</span></td>
        <td>{{ countUseVacation[idx-1] }}</td>
      </tr>
      <tr>
        <td><strong>총계</strong></td>
        <td colspan="2">
          <div class="tag-t02"><strong>발생 : <span class="em-c04">{{ countAllWorkTime }}</span></strong> 일</div>
          <div class="tag-t02"><strong>사용 : <span class="em-c03">{{ countAllUseVacation }}</span></strong> 일</div>
          <div class="tag-t02"><strong>= 잔여 : <span class="em-c02">{{ countAllWorkTime - countAllUseVacation }}</span></strong> 일</div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import option from '@/components/common/data/options'
  import * as firebase from 'firebase';
  import Datepicker from 'vuejs-datepicker';
  import moment from 'moment';
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
        countCalcWorkTime: [],
        countAllWorkTime: 0,
        listOccurVacation: [],
        listUseVacation: [],
        countUseVacation: [],
        countAllUseVacation: 0,
        getData: {
          userId: 'PD',
          selecYear: '2018'
        },
        printData: {
          userId: 'PD',
          selecYear: '2018'
        },
        isPrint: false,
        options: option
      }
    },
    methods: {
      getVacation () {
        axios.get('https://friends-vacation.firebaseio.com/list_useVacation.json')
          .then(res => {
            console.log(res)
            const data = res.data
            const datas = []
            this.listUseVacation = []
            this.countUseVacation = [0,0,0,0,0,0,0,0,0,0,0,0]

            let selecUserId = this.printData.userId
            let selecYear = this.printData.selecYear

            this.getData.userId = this.printData.userId
            this.getData.selecYear = this.printData.selecYear

            for (let key in data) {
              let selecYear_temp = this.customFormatter2(data[key].useDate)

              if (selecUserId == data[key].userId && selecYear == selecYear_temp) {
                const tempData = {
                  id: key,
                  userId: data[key].userId,
                  useDate: this.customFormatter(data[key].useDate)
                }
                datas.push(tempData)
                this.setMonthData(this.countUseVacation, data[key])
              }
            }

            /* 사용일 합산 */
            this.countAllUseVacation = this.getCountAll(this.countUseVacation)

            if(datas.length) {
              this.listUseVacation = datas
              this.isPrint = true
            }else{
              this.isPrint = false
            }
            //alert(this.countUseVacation)
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
            this.countCalcWorkTime = [0,0,0,0,0,0,0,0,0,0,0,0]

            let selecUserId = this.printData.userId
            let selecYear = this.printData.selecYear

            this.getData.userId = this.printData.userId
            this.getData.selecYear = this.printData.selecYear

            for (let key in data) {
              let selecYear_temp = this.customFormatter2(data[key].useDate)

              if (selecUserId == data[key].userId && selecYear == selecYear_temp) {
                const tempData = {
                  id: key,
                  userId: data[key].userId,
                  workHours: data[key].workHours,
                  workDate: this.customFormatter(data[key].workDate),
                  isWeekend: data[key].isWeekend
                }

                datas.push(tempData)
                if (!tempData.isWeekend) {
                  //alert(data[key].workHours)
                  let arr = this.countWorkTime
                  switch(this.customFormatter3(data[key].workDate)) {
                    case "01": this.countWorkTime[0] += Number(data[key].workHours); break
                    case "02": this.countWorkTime[1] += Number(data[key].workHours); break
                    case "03": this.countWorkTime[2] += Number(data[key].workHours); break
                    case "04": this.countWorkTime[3] += Number(data[key].workHours); break
                    case "05": this.countWorkTime[4] += Number(data[key].workHours); break
                    case "06": this.countWorkTime[5] += Number(data[key].workHours); break
                    case "07": this.countWorkTime[6] += Number(data[key].workHours); break
                    case "08": this.countWorkTime[7] += Number(data[key].workHours); break
                    case "09": this.countWorkTime[8] += Number(data[key].workHours); break
                    case "10": this.countWorkTime[9] += Number(data[key].workHours); break
                    case "11": this.countWorkTime[10] += Number(data[key].workHours); break
                    case "12": this.countWorkTime[11] += Number(data[key].workHours); break
                  }
                }
              }
            }

            for (let i = 0; i < this.countWorkTime.length; i++) {
              this.countCalcWorkTime[i] = parseInt(this.countWorkTime[i] / 16)

              if(parseInt(this.countWorkTime[i] % 16) >= 8)
              {
                this.countCalcWorkTime[i] += 1
              }
            }

            /* 발생일 합산 */
            this.countAllWorkTime = this.getCountAll(this.countCalcWorkTime)

            //alert(this.printHoursWeekday)

            if(datas.length) {
              this.listWorkTime = datas
              this.isPrint = true
            }else{
              this.isPrint = false
            }

            //alert(this.countWorkTime)
          })
          .catch(error => {
            console.log(error)
          })
      },
      getCountAll(arr) {
        let count = 0
        for (let i = 0; i < arr.length; i++) {
          count += Number(arr[i])
        }
        return count
      },
      setMonthData(arr, dataKey) {
        switch(this.customFormatter3(dataKey.useDate)) {
          case "01": arr[0] += 1; break
          case "02": arr[1] += 1; break
          case "03": arr[2] += 1; break
          case "04": arr[3] += 1; break
          case "05": arr[4] += 1; break
          case "06": arr[5] += 1; break
          case "07": arr[6] += 1; break
          case "08": arr[7] += 1; break
          case "09": arr[8] += 1; break
          case "10": arr[9] += 1; break
          case "11": arr[10] += 1; break
          case "12": arr[11] += 1; break
        }
      },
      customFormatter(date) {
        return moment(date).format('YYYY-MM-DD');
      },
      customFormatter2(date) {
        return moment(date).format('YYYY');
      },
      customFormatter3(date) {
        return moment(date).format('MM');
      }
    },
    created () {
      this.getVacation()
      this.getWorks()
    }
  }
</script>
