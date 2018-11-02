import Vue from 'vue'
import Router from 'vue-router'
import login from '@/views/login'
import home from '@/views/home'

Vue.use(Router)

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
      component: home
    }
  ]
})
