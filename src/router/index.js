import Vue from 'vue'
import Router from 'vue-router'
import moment from 'moment'
import login from '@/views/login'
import home from '@/views/home'
import user from '@/views/user/user'
import http from '@/assets/plugins/http'
import right from '@/views/right/right'
import role from '@/views/right/role'

Vue.use(Router)
Vue.use(http)
Vue.filter('fmDate', (value, fmString) => {
  return moment(value).format(fmString)
})

export default new Router({
  routes: [
    {
      name: 'login',
      path: '/',
      component: login
    },
    {
      name: 'home',
      path: '/home',
      component: home,
      children: [
        {
          name: 'user',
          path: '/user',
          component: user
        },
        {
          name: 'right',
          path: '/right',
          component: right
        },
        {
          name: 'role',
          path: '/role',
          component: role
        }
      ]
    }
  ]
})
