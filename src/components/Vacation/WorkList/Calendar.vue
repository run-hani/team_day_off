<template>
  <div>
    <full-calendar :events="works" :config="fullCalendar_config"></full-calendar>
  </div>
</template>

<script>
  import { FullCalendar } from 'vue-full-calendar'
  import { dateYYYYMMDD } from '@/mixins/momentDate'
  import axios from 'axios'

  export default {
    name: 'WorkList',
    components: {
      FullCalendar
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
      dateYYYYMMDD,

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
                start: this.dateYYYYMMDD(data[key].workDate),
                color: (data[key].isWeekend ? '#EB4997' : '#08aed6')
              }
              datas.push(tempData)
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
      }
    },
    created () {
      this.getWorks()
    }
  }
</script>

<style>

</style>
