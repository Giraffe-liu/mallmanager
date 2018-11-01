// 将axios改为Vue的插件
// 导入axios
import axios from 'axios'
const httpHelper = {}
httpHelper.install = function fn (Vue) {
  axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'
  Vue.prototype.$http = axios
}
export default httpHelper
