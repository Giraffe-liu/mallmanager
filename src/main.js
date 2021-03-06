// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import '../node_modules/element-ui/lib/theme-chalk/index.css'
import '@/assets/css/style.css'
import httpHelper from '@/assets/plugins/http.js'
import App from './App'
import router from './router'
import myBread from '@/component/myBread'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(httpHelper)

Vue.component(myBread.name, myBread)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
