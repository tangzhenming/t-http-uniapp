/**
 * @Author tangzhenming
 * @Description 网络请求封装
 * 主要支持平台：微信小程序
 * */

import defaultConfig from './default-config'

export  default class Http {
  config = { ...defaultConfig }

  /**
   * URL 完整性验证
   * 正则参考：https://static.kancloud.cn/thinkphp/regex-guide/43534
   * URL 正则参考：https://blog.walterlv.com/post/match-web-url-using-regex.html
   * */
  isURL (url) {
    return /^(http(s)?:\/\/)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:[0-9]{1,5})?[-a-zA-Z0-9()@:%_\\\+\.~#?&//=]*$/.test(url)
  }

  /**
   * 提供修改默认配置的接口
   * */
  setConfig (callback) {
    this.config = callback(this.config)
  }

  /**
   * 拦截器
   * request：拦截请求
   * response： 拦截响应
   * */
  requestInterceptor (options) {
    return options
  }
  responseInterceptor (res) {
    // do something with response data before the promise resolved or rejected ~~~
    return res
  }
  interceptor = {
    request: callback => {
      if (callback) this.requestInterceptor = callback
    },
    response: callback => {
      if (callback) this.responseInterceptor = callback
    }
  }

  /**
   * GET
   * customConfig：为开发者提供的，在单个请求扩展 config 配置的接口
   * */
  get (url, data = {}, customConfig = {}) {
    return this.request(Object.assign({}, this.config, { url, data, method: 'GET' }, customConfig))
  }

  /**
   * POST
   * customConfig：为开发者提供的，在单个请求扩展 config 配置的接口
   * */
  post (url, data = {}, customConfig = {}) {
    return this.request(Object.assign({}, this.config, { url, data, method: 'POST' }, customConfig))
  }

  /**
   * Request
   * */
  request (options) {
    options.url = this.isURL(options.url) ? options.url : (options.baseURL + options.url)
    options = this.requestInterceptor(options)
    return new Promise((resolve, reject) => {
      options.success = res => resolve(this.responseInterceptor(res))
      options.fail = err => reject(this.responseInterceptor(err))
      uni.request(options)
    })
  }
}
