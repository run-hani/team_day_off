<template>
  <div id="contents" class="contents">

    <header class="spot-t01">
      <h2 class="h-spot">야근내역</h2>
      <div class="breadcrumb">
        <a href="" class="ico_ home">home</a> &gt;
        <strong>야근내역</strong>
      </div>
    </header>

    <div class="contents-in">
      <full-calendar :events="works" :config="fullCalendar_config"></full-calendar>
    </div>
  </div>
  <!--//contents -->
</template>

<script>
  import { FullCalendar } from 'vue-full-calendar'
  import * as firebase from 'firebase';
  import Datepicker from 'vuejs-datepicker';
  import moment from 'moment';
  import axios from 'axios'

  export default {
    name: 'VacationList',
    components: {
      FullCalendar,
      Datepicker
    },
    data: function () {
      return {
        flagAddEvt: 0,
        works: [],
        fullCalendar_config: {
          defaultView: 'month'
        }
      }
    },
    methods: {
      getWorks () {
        axios.get('https://friends-vacation.firebaseio.com/list_vacation.json')
          .then(res => {
            console.log(res)
            const data = res.data
            const datas = []
            this.works = []

            for (let key in data) {
              const tempData = {
                id: key,
                title: data[key].userId + ' ( ' + data[key].workHours + ' )',
                start: this.customFormatter(data[key].workDate)
              }
              datas.push(tempData)
              //console.log('temp: ' + tempData)
            }

            // datas.sort((a,b) => {
            //   let arr0 = a.workDate.toString().split("-");
            //   let arr1 = b.workDate.toString().split("-");
            //   let date_a = new Date(arr0[0],arr0[1]-1,arr0[2]);
            //   let date_b = new Date(arr1[0],arr1[1]-1,arr1[2]);
            //   if (date_a < date_b) return 1;
            //   if (date_a > date_b) return -1;
            //   console.log(a)
            // })

            this.works = datas
          })
          .catch(error => {
            console.log(error)
          })
      },
      customFormatter(date) {
        return moment(date).format('YYYY-MM-DD');
      },
      customFormatter2(date) {
        return moment(date).format('YYYYMM');
      }
    },
    created () {
      this.getWorks()
    }
  }
</script>

<style>

</style>
