import Vue from 'vue';
import VueRouter from 'vue-router';
import list from '@/views/List/index.vue';
Vue.use(VueRouter);
let origin = VueRouter.prototype.push;
let originreplace = VueRouter.prototype.replace;
VueRouter.prototype.push = function (location, resolve, reject) {
  if (resolve && reject) {
    origin.call(this, location);
  } else {
    origin.call(
      this,
      location,
      () => { },
      () => { }
    );
  }
};
VueRouter.prototype.replace = function (location, resolve, reject) {
  if (resolve && reject) {
    originreplace.call(this, location);
  } else {
    originreplace.call(
      this,
      location,
      () => { },
      () => { }
    );
  }
};

const routes = [
  {
    path: '/',
    name: 'list',
    component: list
  },
  {
    path: '/runtime',
    name: 'runtime',
    component: () => import(/* webpackChunkName: "runtime" */'@/views/RunTime/index.vue')
  },
  {
    path: '/parser',
    name: 'parser',
    component: () => import(/* webpackChunkName: "parser" */'@/views/RunTime/components/Detail.vue')
  },
  {
    path: '/edit',
    name: 'edit',
    component: () => import(/* webpackChunkName: "edit" */'@/views/Edit/index.vue')
  }
];
const router = new VueRouter({
  base: '/easycode/',
  routes,
  mode: 'history'
});
export default router;
