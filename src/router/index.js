import Vue from 'vue'
import Router from 'vue-router'

import store from '@/store'

/* Home */
import Home from '@/components/Home'

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

/* 회원가입 */
import Signup from '@/components/Member/Signup'

/* 로그인 */
import Signin from '@/components/Member/Signin'

/* test */
import DashboardPage from '@/components/dashboard.vue'

Vue.use(Router)


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { auth: true }
  },
  {
    path: '/dashboard',
    component: DashboardPage,
    meta: { auth: true }
  },
  {
    path: '/Signup',
    name: 'Signup',
    component: Signup,
    meta: { auth: false }
  },
  {
    path: '/Signin',
    name: 'Signin',
    component: Signin,
    meta: { auth: false }
  },
  {
    path: '/VacationAdd',
    name: 'VacationAdd',
    component: VacationAdd,
    meta: { auth: true }
  },
  {
    path: '/VacationUse',
    name: 'VacationUse',
    component: VacationUse,
    meta: { auth: true }
  },
  {
    path: '/WorkList',
    name: 'WorkList',
    component: WorkList,
    meta: { auth: true },
    children: [
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
    meta: { auth: true },
    children: [
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

const router = new Router({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.auth)) {
    // 이 라우트는 인증이 필요하며 로그인 한 경우 확인하십시오.
    // 그렇지 않은 경우 로그인 페이지로 리디렉션하십시오.
    if (!store.state.idToken) {
      next({
        path: '/Signin'
      })
    } else {
      next()
    }
  } else {
    next() // 반드시 next()를 호출하십시오!
  }
})

// router.beforeEach((to, from, next) => {
//   if (store.state.idToken) {
//     router.push({ name: 'VacationAdd' })
//   } else {
//     router.push({ name: 'Signin' })
//   }
// })

export default router
