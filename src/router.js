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
    component:(resolve) => require(['./views/env.vue'], resolve)
  },
  {
    path:'/current',
    meta: {
      title: '当前台风'
    },
    name:'current',
    component:(resolve) => require(['./views/current.vue'], resolve)
  },
  {
    path:'/nwp',
    meta: {
      title: '数值/路径'
    },
    name:'nwp',
    component:(resolve) => require(['./views/nwp.vue'], resolve)
  },
  {
    path:'/bullet',
    meta: {
      title: '报文'
    },
    name:'bullet',
    component:(resolve) => require(['./views/bulletin.vue'], resolve)
  },
  {
    path:'/satellite',
    meta: {
      title: '卫星'
    },
    name:'satellite',
    component:(resolve) => require(['./views/satellite.vue'], resolve)
  },
  {
    path:'/ref',
    meta: {
      title: '相关链接'
    },
    name:'ref',
    component:(resolve) => require(['./views/ref.vue'], resolve)
  },
];
export default routers;