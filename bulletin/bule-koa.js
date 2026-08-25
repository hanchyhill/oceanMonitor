// TODO 设置机构
process.env.NODE_ENV = 'production';
const Koa = require('koa');
const logger = require('koa-logger');
// const {resolve} = require('path');
const Router = require('koa-router');
// const mongoose = require('mongoose');
// const {connect,initSchemas} = require('./database/initDB.js');
const {connectBL,connectTC} = require('./database/initMultiDB.js')
const router = new Router();
const koaBody   = require('koa-body');
const moment = require('moment');
const webPush = require('web-push');
var cors = require('koa2-cors');
const {webPushConfig} = require('./config/private.push.config.js');

webPush.setVapidDetails(
  webPushConfig.eMail,
  webPushConfig.key1,
  webPushConfig.key2,
);
proxyOptions = {
  proxy: 'http://127.0.0.1:1070',
  gcmAPIKey: webPushConfig.gcmAPIKey,
}

let Bulletin = undefined;
let Subscribe = undefined;
let Cyclone = undefined;
const MAX_BULLETIN_RANGE_DAYS = 31;
const MAX_TC_ENS_RANGE_DAYS = 14;

function memorySnapshot() {
  const memory = process.memoryUsage();
  return {
    rssMiB: (memory.rss / 1024 / 1024).toFixed(1),
    heapUsedMiB: (memory.heapUsed / 1024 / 1024).toFixed(1),
    heapTotalMiB: (memory.heapTotal / 1024 / 1024).toFixed(1),
    externalMiB: (memory.external / 1024 / 1024).toFixed(1),
  };
}

function logApiMetric(ctx, interface, event, details) {
  console.log('[api-metric]', JSON.stringify(Object.assign({
    interface,
    event,
    method: ctx.method,
    url: ctx.originalUrl,
    memory: memorySnapshot(),
  }, details)));
}

// '/api/:type/'
router.get('/api/',async(ctx,next)=>{
  // let type = ctx.params.type;
  // console.log(type);
  // console.log(ctx.query);
  let interface = ctx.query.interface;
  const startedAt = Date.now();
  logApiMetric(ctx, interface || 'unknown', 'request-start', {});
  if(interface == "bulletin"){
    let [minTime,maxTime] = [NaN,NaN];
    const ins = ctx.query.ins?ctx.query.ins.split(','):['BABJ','PGTW','RJTD','VHHH'];
    minTime = ctx.query.dateFormat?moment(ctx.query.gt,ctx.query.dateFormat):moment(ctx.query.gt);
    maxTime = ctx.query.dateFormat?moment(ctx.query.lt,ctx.query.dateFormat):moment(ctx.query.lt);
    if(minTime.isValid()&&maxTime.isValid()&&minTime.isBefore(maxTime)){
      const rangeDays = maxTime.diff(minTime, 'days', true);
      if(rangeDays > MAX_BULLETIN_RANGE_DAYS){
        ctx.status = 400;
        ctx.body = {
          error: `查询时间范围不能超过 ${MAX_BULLETIN_RANGE_DAYS} 天`,
          success: false,
        };
        logApiMetric(ctx, interface, 'request-rejected', {
          durationMs: Date.now() - startedAt,
          rangeDays,
        });
      }else{
        try{
          const bulletins = await Bulletin.find({}).
                            where('date').gt(minTime.toDate()).lt(maxTime.toDate()).
                            where('ins').in(ins).
                            select('content name cn date fulltime title ins').
                            lean().
                            exec();

          ctx.body = {
            data: bulletins,
            success: true
          };
          logApiMetric(ctx, interface, 'request-complete', {
            durationMs: Date.now() - startedAt,
            rangeDays,
            resultCount: bulletins.length,
          });
        }catch(error){
          console.error('[api-error]', interface, ctx.originalUrl, error);
          ctx.status = 500;
          ctx.body = {
            error: '查询公告数据失败',
            success: false,
          };
          logApiMetric(ctx, interface, 'request-failed', {
            durationMs: Date.now() - startedAt,
            error: error.message,
          });
        }
      }
      await next();
    }
    else{
      ctx.body = {
        error:'日期参数错误',
        success: false,
      };
      ctx.status = 400;
      logApiMetric(ctx, interface, 'request-rejected', {
        durationMs: Date.now() - startedAt,
        reason: 'invalid-date-range',
      });
      await next();
    }
  }else if(interface == 'tc-ens'){
    let minTime,maxTime;
    const ins = ctx.query.ins?ctx.query.ins.split(','):['NCEP','ecmwf'];
    const basin = ctx.query.basin;
    let basinList = [];
    if(basin==='WPAC') basinList = [{ basinShort2: 'WP' }, { basinShort: 'W' }]
    minTime = ctx.query.dateFormat?moment(ctx.query.gt,ctx.query.dateFormat):moment(ctx.query.gt);
    maxTime = ctx.query.dateFormat?moment(ctx.query.lt,ctx.query.dateFormat):moment(ctx.query.lt);
    if(minTime.isValid()&&maxTime.isValid()&&minTime.isBefore(maxTime)){
      const rangeDays = maxTime.diff(minTime, 'days', true);
      if(rangeDays > MAX_TC_ENS_RANGE_DAYS){
        ctx.status = 400;
        ctx.body = {
          error: `查询时间范围不能超过 ${MAX_TC_ENS_RANGE_DAYS} 天`,
          success: false,
        };
        logApiMetric(ctx, interface, 'request-rejected', {
          durationMs: Date.now() - startedAt,
          rangeDays,
        });
      }else{
        try{
          let query = Cyclone.find({}).
          where('initTime').gt(minTime.toDate()).lt(maxTime.toDate()).
          where('ins').in(ins).      // where('controlIndex').ne(-1).
          select('initTime cycloneNumber cycloneName ins tcID tracks detTrack basinShort basinShort2')
          if(basinList.length!=0){
            query = query.or(basinList);
          }
          const cyclones = await query.lean().exec();
          ctx.body = {
            data: cyclones,
            success: true
          };
          logApiMetric(ctx, interface, 'request-complete', {
            durationMs: Date.now() - startedAt,
            rangeDays,
            resultCount: cyclones.length,
          });
        }catch(error){
          console.error('[api-error]', interface, ctx.originalUrl, error);
          ctx.status = 500;
          ctx.body = {
            error: '查询台风集合预报数据失败',
            success: false,
          };
          logApiMetric(ctx, interface, 'request-failed', {
            durationMs: Date.now() - startedAt,
            error: error.message,
          });
        }
      }
      await next();
    }
    else{
      ctx.body = {
        error:'日期参数错误',
        success: false,
      };
      ctx.status = 400;
      logApiMetric(ctx, interface, 'request-rejected', {
        durationMs: Date.now() - startedAt,
        reason: 'invalid-date-range',
      });
      await next();
    }
  }else{
    ctx.body = {
      error:'参数错误',
      success: false,
    };
    ctx.status = 400;
    logApiMetric(ctx, interface || 'unknown', 'request-rejected', {
      durationMs: Date.now() - startedAt,
      reason: 'invalid-interface',
    });
    await next();
  }
});

router.post('/register', koaBody(), async (ctx,next) => {
  let  body = ctx.request.body;
  let endpoint = body.endpoint;
  // const subscription = body.subscription;
  if(!endpoint){
    ctx.status = 401;
    ctx.body = '未发送有效参数'
    return await next();
  } 
  const subscribes = await Subscribe.findOne({endpoint:endpoint})
                             .exec();
  console.log('注册');
  // console.log(body);
  try{
    if(subscribes){
      console.log('已注册');
    }else{
      console.log('导入新订阅');
      sub = new Subscribe({endpoint:endpoint,keys:body.keys,uniqueid:new Date()});
      await sub.save()
      .catch(err=>{
        console.log('储存错误');
        console.error(err);
      });
    };
    if(endpoint.indexOf('google')>-1){
      await webPush.sendNotification(body,'订阅成功',proxyOptions)
    .catch(err=>{
      console.log('错误code:'+err.code);
      if (err.statusCode === 410 || err.statusCode === 404) {
        console.log('订阅已失效失效');
        throw err;
      }else if(err.code=='ETIMEDOUT'){
        console.log('超时错误');
        throw new Error('连接push服务器超时')
      }
      else{
        console.log(err.statusCode);
        throw err;
      }
      
    });
    console.log('推送完成');
      ctx.status = 201;
      await next();
    }else{
      await webPush.sendNotification(body,'订阅成功')
      .catch(err=>{
        console.log('错误code:'+err.code);
        if (err.statusCode === 410 || err.statusCode === 404) {
          console.log('订阅已失效失效');
          throw err;
        }else if(err.code=='ETIMEDOUT'||err.code == 'ECONNRESET'){
          console.log('超时错误');
          ctx.status = 408;
          ctx.body = '连接push服务器超时';
          throw new Error('连接push服务器超时')
        }
        else{
          console.log(err.statusCode);
          throw err;
        }
      });
      console.log('推送完成');
      ctx.status = 201;
      await next();

    }
  }
  catch(error){
    console.log(error);
    console.log('推送错误');
    ctx.status = 401;
    await next();
  }
});

router.post('/unregister', koaBody(), async (ctx,next) => {
  // TODO body出错时的解决方案
  let body = ctx.request.body;
  console.log('取消注册');
  console.log(body);
  const endpoint = body.endpoint;
  
  const subscribes = await Subscribe.find({endpoint:endpoint})
                     .exec();
  if(subscribes.length!==0){
    await Subscribe.deleteOne({endpoint:endpoint})
          .then(()=>console.log('删除成功'))
          .catch(err=>{
            console.log(err);
          });
  }else{
    console.log('数据库中无此订阅信息');
  }
  ctx.status = 201;
  await next();
});

main = async (ctx,next)=>{
  ctx.set('Access-Control-Allow-Origin', '*');
  // console.log('main');
  await next();
};

(async()=>{
  const app = new Koa();
  app.keys = ['some secret hurr'];
  // await connect();
  // initSchemas();
  let dbBL = await connectBL();
  let dbTC = await connectTC();
  Bulletin = dbBL.model('Bulletin');
  Subscribe = dbBL.model('Subscribe');
  // 连接台风集合预报
  Cyclone = dbTC.model('Cyclone');

  app.use(logger());
  // 
  app.use(cors({
    origin: function(ctx) {
      if (ctx.url === '/test') {
        return false;
      }
      return '*';
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
  }));

  app.use(main);
  app.use(router.routes())
     .use(router.allowedMethods());
  
  app.listen(10074);
  console.log('监听端口 10074');
})()


