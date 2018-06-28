// TODO 设置机构
// TODO 日期范围限制
// TODO 
const Koa = require('koa');
const logger = require('koa-logger');
const {resolve} = require('path');
const Router = require('koa-router');
const mongoose = require('mongoose');
const {connect,initSchemas} = require('./database/initDB.js');
const router = new Router();
const moment = require('moment');

let Bulletin = undefined;

router.get('/api',async(ctx,next)=>{

  // const minTime = ctx.query.gt?Number.parseInt(ctx.query.gt):NaN;
  // const maxTime = ctx.query.lt?Number.parseInt(ctx.query.lt):NaN;
  let [minTime,maxTime] = [NaN,NaN];
  const ins = ctx.query.ins?ctx.query.ins.split(','):['BABJ','PGTW','RJTD','VHHH'];
  minTime = ctx.query.dateFormat?moment(ctx.query.gt,ctx.query.dateFormat):moment(ctx.query.gt);
  maxTime = ctx.query.dateFormat?moment(ctx.query.lt,ctx.query.dateFormat):moment(ctx.query.lt);
  if(minTime.isValid()&&maxTime.isValid()&&minTime.isBefore(maxTime)){
    const bulletins = await Bulletin.find({}).
                      where('date').gt(new Date(minTime)).lt(new Date(maxTime)).
                      where('ins').in(ins).
                      select('content name cn date fulltime title ins').exec();
  
    ctx.body = {
      data: bulletins,
      success: true
    };
    await next();
  }
  else{
    ctx.body = {
      error:'日期参数错误',
      success: false,
    };
    ctx.status = 400;
    await next();
  }
});

main = async (ctx,next)=>{
  ctx.set('Access-Control-Allow-Origin', '*');
  // console.log('main');
  await next();
};

(async()=>{
  const app = new Koa();
  app.keys = ['some secret hurr'];
  await connect();
  initSchemas();
  Bulletin = mongoose.model('Bulletin');
  app.use(logger());
  // 
  app.use(main);
  app.use(router.routes())
     .use(router.allowedMethods);
  
  
// app.use(static(resolve(__dirname,'./')));
  app.listen(10074);
  console.log('监听端口 10074');
})()


