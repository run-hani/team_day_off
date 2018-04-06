<template>
  <div>
    <full-calendar :events="works" :config="fullCalendar_config"></full-calendar>
  </div>
</template>

<script>
  import { FullCalendar } from 'vue-full-calendar'
  import moment from 'moment';
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
      getWorks () {
        axios.get('https://friends-vacation.firebaseio.com/list_useVacation.json')
          .then(res => {
            console.log(res)
            const data = res.data
            const datas = []
            this.works = []

            for (let key in data) {
              const tempData = {
                id: key,
                title: data[key].userId,
                start: this.customFormatter(data[key].useDate),
                color: '#08aed6'
              }
              datas.push(tempData)
              //console.log('temp: ' + tempData)
            }

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
