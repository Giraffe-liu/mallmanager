import Vue from 'vue'
import Router from 'vue-router'
import login from '@/views/login'
import home from '@/views/home'
import user from '@/views/user/user'
import http from '@/assets/plugins/http'

Vue.use(Router)
Vue.use(http)

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
        }
      ]
    }
  ]
})
