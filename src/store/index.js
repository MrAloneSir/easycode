import Vue from 'vue';
import Vuex from 'vuex';
import lib from './lib.module';
import server from './server.module';
import model from './model.module';
import route from './route.module';
import ref from './ref.module';
import monaco from './monaco.module';
import interval from './interval.module';
import state from './state.module';


import { evalJS, evalExpression, filter } from '../utils/tpl';
import router from '../router';
import { isObjectNumber } from '../utils';

Vue.use(Vuex);
function evalOrFilter(value, content) {
  if (value.includes('<%')) {
    return filter(value, content);
  } else {
    return evalJS(value, content)
  }
}

export default new Vuex.Store({
  getters: {
    getStoreValue: (_, getters) => (content, value) => {
      // 读取不同参数
      let data = '';
      switch (content) {
        case undefined:
        case 'undefined':
        case 'none':
          data = value;
          break;
        case 'ls':
          data = evalOrFilter(value, window.localStorage);
          break;
        case 'ss':
          data = evalOrFilter(value, window.sessionStorage);
          break;
        case 'window':
          data = evalOrFilter(value, window);
          break;
        case 'state':
          data = evalOrFilter(value, getters.getState);
          break;
        case 'Route':
          data = router.currentRoute.query[value];
          break;
        case 'currentScope':
          data = evalOrFilter(value, getters.getModelValue(content));

        default:
          if (isObjectNumber(content)) {
            data = evalOrFilter(value, getters.getServer(content));
          } else if (content.includes('server__')) {
            let serverContent = content.replace('server__', '');
            data = evalOrFilter(value, getters.getServer(serverContent));
          } else {
            data = evalOrFilter(value, getters.getModelValue(content));
          }
          break;
      }
      return data;
    },
    storeEvalExpress: (_, getters) => (express, otherContent = {}) => {
      return evalExpression(express, {
        Route: router.currentRoute.query,
        ls: window.localStorage,
        ss: window.sessionStorage,
        window: window,
        ...getters.getModelRef,
        ...getters.getServerRef,
        state: getters.getState || {},
        ...otherContent
      });
    }
  },
  modules: {
    lib,
    server,
    model,
    route,
    ref,
    monaco,
    interval,
    state
  }
});
