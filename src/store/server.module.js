// import api from '@/api/request.js';
import api from '../../src/api/request';
import store from './index';
import { parseFunction } from '../../packages/utils/utils';
import router from '../router';

function openServeAction(serverItem, commit, i, getters) {
  return new Promise((resolve, reject) => {
    const {
      method,
      url,
      options,
      host,
      contentType = 'form',
      useCode,
      optionSlotCode,
      useCodeEditor,
      resultCode
    } = serverItem;
    let data = {};
    options.forEach((obj) => {
      let { key, value, content } = obj;
      // 读取不同参数
      data[key] = getters.getStoreValue(content, value);
    });
    data.__url = url;
    data.__method = method;
    data.__host = host;
    data.__contentType = contentType;
    if (useCode) {
      try {
        let parseFunctionResult = parseFunction(optionSlotCode?.jsCode);
        let newFun = new Function('data', parseFunctionResult.content);
        data = newFun(data);
        if (!data) {
          return false;
        }
      } catch (error) {
        console.log('数据源函数执行出错:', error);
      }
    }
    api.post('/proxy/index', data).then((res) => {
      if (useCodeEditor) {
        try {
          let parseFunctionResult = parseFunction(resultCode?.jsCode);
          let newFun = new Function('data', parseFunctionResult.content);
          res = newFun(res);
          if (!res) {
            return false;
          }
        } catch (error) {
          console.log('数据源结果转换函数执行出错:', error);
        }
      }
      commit('changeServerList', {
        server: res,
        index: i
      });
      resolve(res);
    }, reject);
  });
}

export default {
  state: {
    originServer: [],
    serverList: [],
    isOpenServerList: []
  },
  getters: {
    getServerName: (state) => {
      // 返回名字列表
      return state.originServer.map((item, index) => {
        return {
          label: item.name,
          value: 'server__' + index
        };
      });
    },
    getServer: (state) => (i) => {
      // 返回服务
      return state.serverList[i];
    },
    getServerRef: (state) => {
      // 返回服务
      const ref = {};
      state.serverList.map((item, index) => {
        ref['server__' + index] = item;
      });
      return ref;
    }
  },
  mutations: {
    setOriginServer(state, list) {
      state.originServer = list;
      let arr = new Array(list.length || 0);
      state.serverList = arr.fill({});
    },
    setIsOpenServer(state, list) {
      state.isOpenServerList = list;
    },
    changeServerList(state, { server, index }) {
      state.serverList.splice(index, 1, server);
    },
    changeIsOpenServer(state, { result, index }) {
      state.isOpenServerList.splice(index, 1, result);
    }
  },
  actions: {
    initServe({ commit, getters }, { formConf }) {
      return new Promise((resolve, reject) => {
        const { dataSource } = formConf;
        const isOpenServerList = [];
        if (!dataSource || !dataSource.length) {
          return;
        }
        commit('setOriginServer', dataSource);
        const contentArr = [];
        let count = 0,
          resultCount = 0;
        for (let i = 0; i < dataSource.length; i++) {
          const serverItem = dataSource[i];
          const { antoSend, sendOn } = serverItem;
          // 判断加载条件
          if (antoSend || getters.storeEvalExpress(sendOn)) {
            isOpenServerList.push(true);
            count++;
            contentArr.push('server__' + i);
            openServeAction(serverItem, commit, i, getters).then((res) => {
              resultCount++;
              if (resultCount === count) {
                resolve(contentArr);
              }
            }, reject);
          } else {
            commit('changeServerList', {
              server: {},
              index: i
            });
            isOpenServerList.push(false);
            if (i >= dataSource.length - 1 && resultCount === count) {
              resolve(contentArr);
            }
          }
        }
        commit('setIsOpenServer', isOpenServerList);
      });
    },
    changeServe({ commit, state, getters }, { formConf }) {
      return new Promise((resolve, reject) => {
        const contentArr = [];
        const { dataSource } = formConf;
        if (!dataSource || !dataSource.length) {
          return;
        }
        let count = 0,
          resultCount = 0;
        for (let i = 0; i < dataSource.length; i++) {
          const serverItem = dataSource[i];
          const isOpen = state.isOpenServerList[i];
          const { antoSend, sendOn } = serverItem;
          // 判断加载条件
          // 之前没有加载过
          if (!antoSend) {
            if (getters.storeEvalExpress(sendOn) && !isOpen) {
              contentArr.push(i);
              count++;
              commit('changeIsOpenServer', {
                result: true,
                index: i
              });
              openServeAction(serverItem, commit, i, getters).then((res) => {
                resultCount++;
                if (resultCount === count) {
                  resolve(contentArr);
                }
              }, reject);
            } else if (!getters.storeEvalExpress(sendOn)) {
              commit('changeIsOpenServer', {
                result: false,
                index: i
              });
              if (i >= dataSource.length - 1 && resultCount === count) {
                resolve(contentArr);
              }
            }
          }
        }
      });
    }
  }
};
