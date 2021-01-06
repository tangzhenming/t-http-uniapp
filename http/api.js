/**
 * @Author tangzhenming
 * @Description 统一管理 api 请求
 * */

import Http from '@/utils/http/http'
import store from '@/store'

const http = new Http()
http.setConfig(config => {
  config.baseURL = 'http://222.18.149.113:9296/app'
  return config
})
http.interceptor.request(options => {
  // 请求统一携带 token
  options.data.token = uni.getStorageSync('userInfo').token || ''
  // 非登录接口需判断登录态
  // if (getCurrentPages()[0].route !== 'pages/login/login' && !store.state.isLogin) {
  //   uni.showToast({
  //     title: '您的账号尚未登录，请重新登录',
  //     icon: 'none',
  //     mask: true,
  //     duration: 2000
  //   })
  //   setTimeout(() => {
  //     store.commit('handleLogoutSuccess')
  //   }, 2000)
  // }
  return options
})
http.interceptor.response(res => {
  // token 失效
  if (res.code === 401) {
    uni.showToast({
      title: 'token 失效，请重新登录',
      icon: 'none',
      mask: true,
      duration: 2000
    })
    setTimeout(() => {
      store.commit('handleLogoutSuccess')
    }, 2000)
  }
  return res
})

export default {
  /**
   * 登录
   * data {
   *   username, password
   * }
   * */
  login (data) {
    return http.post('/login', data)
  },
  /**
   * 退出登录
   * data {
   *   token
   * }
   * */
  logout () {
    return http.get('/logout')
  },
  /**
   * 产品文件路径
   * data {
   *   type, token
   * }
   * type 10 MONITOR 状态数据
   * type 20 FFT 功率谱数据
   * type 21 RAD 径向数据
   * type 31 ROBS 实时数据
   * type 32 HOBS 半小时数据
   * type 33 OOBS 1小时数据
   * */
  getFilePath (data) {
    return http.get('/getFilePath', data)
  },
  /**
   * 产品文件数据
   * data {
   *   fileName, token
   * }
   * */
  getFileByName (data) {
    return http.get('/getFileByName', data, { responseType: 'arraybuffer'} )
  }
}
