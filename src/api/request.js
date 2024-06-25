import axios from 'axios';
import qs from 'qs';
import { Message } from 'element-ui';
import { env } from './config';
import { resolveHost } from '../config/config';

/**
 * 请求正常服务端返回 code 处理
 * 接口需分 upc、相应后端服务 两种服务接口，UPC接口字符串含v1，通过v1 区别
 * @param {*} res
 */
const checkCode = (res) => {
  if (res && res.status === 200) {
    let message = ''
    if (res?.data?.message?.code === 'ERR_HTTP_INVALID_HEADER_VALUE' || res?.data?.code === 10012) {
      message = '登录失效，请重新登录'
    } else if (!res.data || (res.data && res.data.code !== 0)) {
      message = res.data.message
    }
    if (message) {
      Message({
        showClose: true,
        type: 'error',
        message: message || `后端接口异常`
      });
    }
  }
  return Promise.resolve(res.data);
};

/**
 * 请求异常 status 处理
 * @param {*} res
 */
const checkStatus = (error) => {
  let { message } = error;
  if (message === 'Network Error') {
    message = '后端接口连接异常';
  }
  if (message.includes('timeout')) {
    message = '后端接口请求超时';
  }
  if (message.includes('Request failed with status code')) {
    const code = message.substr(message.length - 3);
    message = `后端接口${code}异常`;
  }
  Message({
    showClose: true,
    type: 'error',
    message
  });
};

/**
 * 兼容 contentType 类型
 * @param {*} config
 */
const checkContentType = (config) => {
  if (
    Object.prototype.toString.call(config.data) !== '[object FormData]' &&
    config.headers['Content-Type'] === 'application/x-www-form-urlencoded;charset=UTF-8;'
  ) {
    config.data = qs.stringify(config.data);
  }
  if (config.otherConfig) {
    config = { ...config, ...config.otherConfig };
  }
  return config;
};

const instance = axios.create({
  baseURL: env.apiBase,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
  }
});


// 响应拦截处理
instance.interceptors.response.use(
  (response) => checkCode(response),
  (error) => checkStatus(error)
);

const headerFormData = {
  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
};

const headerJson = {
  'Content-Type': 'application/json'
};

const csvHeader = {
  'Content-Type': 'text/csv',
  'Content-Disposition': 'attachment;filename=Example.csv'
}
// 默认封装get、post、upload、download方法
export default {
  // 抛出axios 实例方便扩展
  request: instance,
  /**
   * GET 请求
   * @param {*} url
   * @param {*} params
   * @param {*} headers
   */
  get({ url, baseURL, params, headers = {} }) {
    return instance({
      url,
      baseURL,
      method: 'GET',
      params,
      headers
    });
  },

  /**
   * POST请求
   * @param {*} url
   * @param {*} data
   * @param {*} headers
   */
  post(url, data) {
    if (data.__url) {
      let hostUrl = resolveHost(data.__host);
      if (!hostUrl) {
        Message({
          showClose: true,
          type: 'error',
          message: `${data.__host}没有配置域名，请先添加域名`
        });
        return Promise.reject();
      }
      data.__url = hostUrl + data.__url;
    }
    const contentType = data.__contentType || 'form';
    if (data.__method) {
      data.__method = data.__method.toLowerCase();
    }
    delete data.__contentType;
    delete data.__host;
    let headers = headerJson
    if (contentType === 'form' && data.__method === 'post') {
      headers = headerFormData
    }
    const localAuthorization = localStorage.getItem('Authorization')
    if (window.SDK?.parentInfo?.token) {
      headers.Authorization = window.SDK.parentInfo.token
    } else if (localAuthorization) {
      headers.Authorization = localAuthorization
    }
    return instance({
      url,
      method: 'POST',
      data: contentType === 'form' && data.__method === 'post' ? qs.stringify(data) : data,
      headers
    });
  },

  // request
  req({ baseURL, url, upload = false, data = {}, method = 'post', params = {}, otherConfig = {} }) {
    let base = '';
    if (upload) {
      base = env.upload;
    } else if (baseURL !== undefined) {
      base = baseURL;
    } else {
      base = env.apiBase;
    }
    let config = {
      url,
      baseURL: base,
      data: qs.stringify(data),
      method,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      params,
      ...otherConfig //如有其他header及contentType,可在otherConfig中配置说明
    };
    return instance(config);
  },

  /**
   * 上传请求
   * @param {*} url
   * @param {*} formdata
   * @param {*} headers
   */
  upload(
    url,
    formdata,
    headers = {
      'Content-Type': 'multipart/form-data'
    }
  ) {
    return instance({
      //注意： 这个baseUrl 是UPC接口域名，若不是建议重新基于request封装下
      url,
      method: 'POST',
      headers,
      data: formdata
    });
  },

  /**
   * 下载请求
   * @param {*} url
   * @param {*} data
   * @param {*} headers
   * @param {*} method
   */
  download(url, data, headers = {}, method = 'POST') {
    return instance({
      url,
      method,
      responseType: 'blob',
      transformResponse: [(res) => res],
      data,
      headers
    });
  }
};
