import Vue from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';

//axios 请求拦截器
//设置统一的请求头，把 token 放里面
axios.interceptors.request.use(
  config => {
    let token = localStorage.getItem('JWT_TOKEN');
    if (token) {
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  },
  error => Promise.reject(error)
);
axios.defaults.baseURL = 'http://localhost:8080';

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
