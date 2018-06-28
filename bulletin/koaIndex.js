
const Koa = require('koa');
const logger = require('koa-logger');
const session = require('koa-session');
const static = require('koa-static');
const {resolve} = require('path');
const Router = require('koa-router');
const mongoose = require('mongoose');
const router = new Router();

router.get('/movies/all',async(ctx,next)=>{
  const Movie = mongoose.model('Movie');
  const movies = await Movie.find().sort({
    'meta.createdAt':-1
  });
  ctx.body = {
    movies
  }
});

router.get('/movies/detail/:id',async(ctx,next)=>{
  const Movie = mongoose.model('Movie');
  // ctx.query
  const id = ctx.params.id;
  const movies = await Movie.findOne({_id:id});
  ctx.body = {
    movies
  }
});

const app = new Koa();
app.keys = ['some secret hurr'];

app
  .use(router.routes())
  .use(router.allowedMethods)
/* async function main(ctx,next){
  if(ctx.path === '/favicon.ico') return;
  let n = ctx.session.views || 0;
  ctx.session.views = ++n;
  ctx.body = n + 'views';
  next()
}; */

/* app.use(logger());
app.use(session(app));
app.use(main); */
// app.use(static(resolve(__dirname,'./')));
app.listen(2333);

