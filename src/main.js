import './public-path';
import Vue from 'vue';
import App from './App.vue';
import '@/styles/index.scss';
import '@/styles/home.scss';
import '@/styles/tailwind.css';
import '@/icons';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import draggable from 'vuedraggable';
import store from './store/index';
import router from './router';
import lib from '../packages/index';
import './utils/postMessage'

window.SDK.getParentInfo();
Vue.component('draggable', draggable);
Vue.config.productionTip = false;

Vue.use(ElementUI, { size: 'small' });
store.commit('registerComs', lib);

let instance = null
function render(props = {}) {
  instance = new Vue({
    router,
    store,
    render: (h) => h(App)
  }).$mount('#app');
}

export async function bootstrap() {
  console.log('react app bootstraped');
}

export async function update(props) {
  console.log('update props', props);
}


// // 独立运行时
// if (!window.__POWERED_BY_QIANKUN__) {
// }
render();

export async function mount(props) {
  render(props)
}

export async function unmount(props) {
  instance.$destroy();
  instance.$el.innerHTML = '';
  instance = null
  // router = null;
}
