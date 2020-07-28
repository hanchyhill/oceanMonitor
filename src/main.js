import Vue from 'vue';
import iView from 'iview';
import VueRouter from 'vue-router';
import Routers from './router';
import Vuex from 'vuex';
import Util from './libs/util';
import App from './app.vue';
import {registerSW,testPush,subscribePush,isSubscribe} from './libs/push.js';
import polify from './libs/polify.js';
import 'iview/dist/styles/iview.css';
// import urlBase64ToUint8Array from './libs/base64util';
// import runtime from 'serviceworker-webpack-plugin/lib/runtime';

polify();// 兼容性poly注入
Vue.use(iView);
Vue.use(VueRouter);
Vue.use(Vuex);
const axios = Util.ajax;
// 路由配置
const RouterConfig = {
    mode: 'history',
    routes: Routers
};
const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    Util.title(to.meta.title);
    next();
});

router.afterEach(() => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});

const store = new Vuex.Store({
    state: {

    },
    getters: {

    },
    mutations: {

    },
    actions: {

    }
});

var app = new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App)
});

registerSW();


if(testPush()&&localStorage.getItem('isPush')=='true'){
  isSubscribe()
  .then(isSub=>{
    if(!isSub){
      return subscribePush()
      .then(subscription=>{
        return axios.post('/register',subscription)
      })
      .then(()=>{
        app.$Notice.success({
          title: '成功',
          desc:  '已订阅实时消息'
        });
      })
      .catch(err=>{
        app.$Notice.error({
          title: '服务器注册时发生错误',
          desc:  err.message,
        });
      })
    }else{
      console.log('订阅状态与历史记录相同');
    }
  })
  .catch(err=>{
    console.log(err);
  })
  
}