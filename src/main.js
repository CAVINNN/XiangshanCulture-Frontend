// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios';
import echarts from 'echarts'
import contextmenu from 'v-contextmenu'
import 'v-contextmenu/dist/index.css'
import App from './App'
import router from './router'
import store from './store/store'

Vue.use(ElementUI);
Vue.use(contextmenu);
Vue.prototype.$Loading = ElementUI.Loading;
Vue.prototype.$ajax = axios;
Vue.prototype.$echarts = echarts;

Vue.config.productionTip = false;

// ajax请求拦截器
axios.interceptors.request.use(function (config) {
  config.withCredentials = true;
  return config;
}, function (error) {
  return Promise.reject(error);
});

// ajax响应拦截器
axios.interceptors.response.use(function (response) {
  if (response.request.responseURL !== "http://localhost:8080/admin/isLogin") {
    if (response.data.code === 401) {
      ElementUI.MessageBox.alert('使用系统前请先登录！', '请登录', {
        confirmButtonText: '确定',
      });
    }
  }
  return response;
}, function (error) {
  return Promise.reject(error);
});

// 全局路由守卫
router.beforeEach((to, from, next) => {
  if (to.fullPath === "/search") {
    next({
      path: '/search/knowledgeSearch'
    })
  } else {
    if (to.meta.needLogin && !store.state.isLogin) {
      next({
        path: '/index'
      })
    } else {
      next();
    }
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  store: store
})
