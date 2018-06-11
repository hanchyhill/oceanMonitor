const Koa = require('koa');
const app = new Koa();
const logger = require('koa-logger');
const session = require('koa-session');
const static = require('koa-static');
const {resolve} = require('path');
app.keys = ['some secret hurr'];
 
async function main(ctx,next){
  if(ctx.path === '/favicon.ico') return;
  let n = ctx.session.views || 0;
  ctx.session.views = ++n;
  ctx.body = n + 'views';
  next()
};

/* app.use(logger());
app.use(session(app));
app.use(main); */
app.use(static(resolve(__dirname,'./')));
app.listen(2333);

