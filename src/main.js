import Vue from 'vue';
import iView from 'iview';
import VueRouter from 'vue-router';
import Routers from './router';
import Vuex from 'vuex';
import Util from './libs/util';
import App from './app.vue';
import {registerSW} from './libs/push.js';
import 'iview/dist/styles/iview.css';
// import urlBase64ToUint8Array from './libs/base64util';
// import runtime from 'serviceworker-webpack-plugin/lib/runtime';

// polify();// 兼容性poly注入
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

new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App)
});

registerSW();