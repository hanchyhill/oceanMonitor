const Koa = require('koa');
const logger = require('koa-logger');
const {resolve} = require('path');
const Router = require('koa-router');
const mongoose = require('mongoose');
const router = new Router();

const app = new Koa();
app.keys = ['some secret hurr'];

async function main(ctx,next){
  ctx.body = 'hello';
  ctx.set('Access-Control-Allow-Origin', '*');
  next()
};

app.use(logger());
app.use(main); 
// app.use(static(resolve(__dirname,'./')));
app.listen(10074);
console.log('监听端口 10074');

