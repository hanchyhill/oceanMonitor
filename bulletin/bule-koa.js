const Koa = require('koa');
const logger = require('koa-logger');
const {resolve} = require('path');
const Router = require('koa-router');
const mongoose = require('mongoose');
const {connect,initSchemas} = require('./database/initDB.js');
const router = new Router();

let Bulletin = undefined;

router.get('/api',async(ctx,next)=>{
/*   const Movie = mongoose.model('Movie');
  const movies = await Movie.find().sort({
    'meta.createdAt':-1
  });
  ctx.body = {
    movies
  } */
  const minTime = ctx.query.gt?Number.parseInt(ctx.query.gt):NaN;
  const maxTime = ctx.query.lt?Number.parseInt(ctx.query.lt):NaN;
  const ins = ctx.query.ins;
  console.log(maxTime, minTime, ins);
  const bulletins = await Bulletin.find({}).
                    where('date').gt(new Date(minTime)).lt(new Date(maxTime)).
                    where('ins').in(['BABJ', 'RJTD', 'PGTW',]).
                    select('content name cn date fulltime title ins').exec();
  // console.log(bulletins);
  ctx.body = {
    data: bulletins,
    success: true
  };
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


