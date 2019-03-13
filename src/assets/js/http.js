//引入axios
import axios from 'axios'
import staticConfig from './config'
import router from '../../router'
import {
  Message
} from 'element-ui';
import querystring from 'querystring'

let cancel, promiseArr = {}
const CancelToken = axios.CancelToken;

// "请求" 拦截器
axios.interceptors.request.use(config => {
  //发起请求时，取消掉当前正在进行的相同请求
  if (promiseArr[config.url]) {
    promiseArr[config.url]('操作取消')
    promiseArr[config.url] = cancel
  } else {
    promiseArr[config.url] = cancel
  }
  return config
}, error => {
  return Promise.reject(error)
})

// "响应" 拦截器即异常处理 
axios.interceptors.response.use(response => {
  return response;
}, err => {
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        err = '错误请求'
        break;
      case 401:
        setTimeout(() => {
          router.push("/")
        }, 2010);
        err = '登录过期，请重新登录'
        break;
      case 403:
        err = '拒绝访问，请重新登录'
        break;
      case 404:
        err = '请求错误,未找到该资源'
        break;
      case 405:
        err = '请求方法未允许'
        break;
      case 408:
        err = '请求超时'
        break;
      case 500:
        err = '服务器端出错'
        break;
      case 501:
        err = '网络未实现'
        break;
      case 502:
        err = '网络错误'
        break;
      case 503:
        err = '服务不可用'
        break;
      case 504:
        err = '网络超时'
        break;
      case 505:
        err = 'http版本不支持该请求'
        break;
      default:
        err = `连接错误${err.response.status}`
    }
  } else {
    err = "连接到服务器失败"
  }
  Message({
    message: err,
    type: "warning",
    duration: 2000
  })
  return Promise.resolve(err.response)
})

// 设置默认
axios.defaults.baseURL = staticConfig.api;
//设置默认请求头
axios.defaults.headers = {
  "content-type": "application/x-www-form-urlencoded",
  "token": ""
}
axios.defaults.timeout = 50000 // 访问时间
export default {
  //get请求
  get(url, param) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url: url,
        params: param,
        cancelToken: new CancelToken(c => {
          cancel = c
        })
      }).then(res => {
        resolve(res)
      })
    })
  },
  //post请求
  post(url, param) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: url,
        data: querystring.stringify(param),
        cancelToken: new CancelToken(c => {
          cancel = c
        })
      }).then(res => {
        resolve(res)
      })
    })
  },
  put(url, param) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'put',
        url: url,
        data: querystring.stringify(param),
        cancelToken: new CancelToken(c => {
          cancel = c
        })
      }).then(res => {
        resolve(res)
      })
    })
  },
  delete(url, param) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'delete',
        url: url,
        data: querystring.stringify(param),
        cancelToken: new CancelToken(c => {
          cancel = c
        })
      }).then(res => {
        resolve(res)
      })
    })
  }
};
