import axios from 'axios'
import { HOST } from './env.js'

const instance = axios.create({
  baseURL: HOST,
  timeout: 10000,
})
const token = localStorage.getItem('token')

// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    if (token) {
      config.headers['Authorization'] = 'bearer ' + token
    }
    console.log(config)
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    return response
  },
  function (error) {
    // 对响应错误做点什么
    console.log(error)
    return Promise.reject(error)
  }
)

export { instance }
