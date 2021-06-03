import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios, { AxiosRequestConfig } from 'axios'
import '../src/styles/global.css'
import ClickOutside from './directives/clickoutside'

// icode 3B21134AB7F96707
axios.defaults.baseURL = 'http://apis.imooc.com/api'

axios.interceptors.request.use(config => {
  store.commit('updateLoadingStatus', true)
  store.commit('setError', { status: false, message: '' })
  // get请求
  config.params = { ...config.params, icode: '3B21134AB7F96707' }
  // 其他请求，添加到body中
  // 如果是上传文件，添加到formData中
  if (config.data instanceof FormData) {
    config.data.append('icode', '3B21134AB7F96707')
  } else {
    // 普通的body对象，添加到data中
    config.data = { ...config.data, icode: '3B21134AB7F96707' }
  }
  return config
})

axios.interceptors.response.use(config => {
  store.commit('updateLoadingStatus', false)
  return config
}, err => {
  const { error } = err.response.data
  store.commit('setError', { status: true, message: error })
  store.commit('updateLoadingStatus', false)
  return Promise.reject(err.response.data)
})

const app = createApp(App)
app.use(router)
app.use(store)
app.directive('click-outside', ClickOutside)

const $http = async (
  url: string,
  config: AxiosRequestConfig = { method: 'get' }
) => {
  const { data } = await axios(url, config)
  return data
}

app.config.globalProperties.$store = store
app.config.globalProperties.$router = router
app.config.globalProperties.$axios = axios
app.config.globalProperties.$axios = $http

app.mount('#app')
