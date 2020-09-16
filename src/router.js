const routers = [
  {
    path: '/',
    meta: {
        title: '台风监测'
    },
    redirect:'/env',
    },
  {
    path:'/env',
    meta: {
      title: '环境分析'
    },
    name:'env',
    component: () => import('./views/env.vue'),
  },
  {
    path:'/current',
    meta: {
      title: '当前台风'
    },
    name:'current',
    component: () => import('./views/current.vue'),
  },
  {
    path:'/nwp',
    meta: {
      title: '数值/路径'
    },
    name:'nwp',
    component: () => import('./views/nwp.vue'),
  },
  {
    path:'/bullet',
    meta: {
      title: '报文'
    },
    name:'bullet',
    component: () => import('./views/bulletin.vue'),
  },
  {
    path:'/satellite',
    meta: {
      title: '卫星'
    },
    name:'satellite',
    component:() => import('./views/satellite.vue'),
  },
  {
    path:'/ref',
    meta: {
      title: '相关链接'
    },
    name:'ref',
    component: () => import('./views/ref.vue'),
  },
];
export default routers;