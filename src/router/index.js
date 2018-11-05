import Vue from 'vue'
import Router from 'vue-router'
import moment from 'moment'
import login from '@/views/login'
import home from '@/views/home'
import user from '@/views/user/user'
import http from '@/assets/plugins/http'
import right from '@/views/right/right'
import role from '@/views/right/role'
import { Message } from 'element-ui'

Vue.use(Router)
Vue.use(http)
Vue.filter('fmDate', (value, fmString) => {
  return moment(value).format(fmString)
})

const router = new Router({
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
          name: 'users',
          path: '/users',
          component: user
        },
        {
          name: 'rights',
          path: '/rights',
          component: right
        },
        {
          name: 'roles',
          path: '/roles',
          component: role
        }
      ]
    }
  ]
})

// 设置路由守卫
// 通过路由跳转之前，在“路由拦截器”中做一些事情，这就是路由守卫
router.beforeEach((to, from, next) => {
  // console.log(to, from)
  // 判断即将要跳转的这个路径是否需要登录
  if (to.name === 'login') {
    next()
  } else {
    const token = sessionStorage.getItem('token')
    if (!token) {
      router.push({name: 'login'})
      Message.success('请先登录 U_U')
    } else {
      next()
    }
  }
})
export default router
