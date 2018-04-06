import Vue from 'vue'
import Router from 'vue-router'

import store from './store'

import VacationAdd from '@/components/Vacation/Add'
import VacationUse from '@/components/Vacation/Use'

/* 야근내역 */
import WorkList from '@/components/Vacation/WorkList/Index'
import WorkListCalendar from '@/components/Vacation/WorkList/Calendar'
import WorkListCalc from '@/components/Vacation/WorkList/Calc'

/* 대체휴가내역 */
import VacationList from '@/components/Vacation/VacaList/Index'
import VacationListCalendar from '@/components/Vacation/VacaList/Calendar'
import VacationListCalc from '@/components/Vacation/VacaList/Calc'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'VacationAdd',
      component: VacationAdd
    },
    {
      path: '/VacationUse',
      name: 'VacationUse',
      component: VacationUse
    },
    {
      path: '/WorkList',
      name: 'WorkList',
      component: WorkList,
      children: [
        {
          path:'',
          component: WorkListCalc
        },
        {
          path:'Calc',
          component: WorkListCalc
        },
        {
          path:'Calendar',
          component: WorkListCalendar
        }
      ]
    },
    {
      path: '/VacationList',
      name: 'VacationList',
      component: VacationList,
      children: [
        {
          path:'',
          component: VacationListCalc
        },
        {
          path:'Calc',
          component: VacationListCalc
        },
        {
          path:'Calendar',
          component: VacationListCalendar
        }
      ]
    }
  ]
})
