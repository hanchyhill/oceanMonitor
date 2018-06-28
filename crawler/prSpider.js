/**
 *  TODO
 * stream模式导致文件写入文件时间过长
 * 写入文件夹需要先执行
 * p-any 出现竞争写入问题,使用isFullfill解决
 * 工具函数抽出util.js
 * 开始写入时备份文件
 * item的console.log收集成列表
 * switchRetry需要解构
 */
const {config, dirConfig} = require('./crawlerConfig.js');
const schedule = require('node-schedule');// import * as schedule from 'node-schedule';
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const pMap = require('p-map');
const pAny = require('p-any');

const {requestMeothods, myLogger, myDebug, pMakeDir} = require('./lib/util.js');

function RequsetFactory(item){
  let obj = {
    resolve:undefined,
    reject:undefined,
    isFullfill:undefined,
    item,
    promise(item){
      let that = this;
      return new Promise((resolve,reject)=>{
        that.resolve = resolve;
        that.reject = reject;
        that.switchRetry(item||that.item);
      });
    },
    switchRetry:switchRetry,
    retry:item.retry === 'any'? 'any' : 'sequence',//'any',//'sequence',// 竞赛模式，递归模式
    proxy:['normal','socks'],
  }
  return obj;
}



/**
 * 切换重试模式
 * @param {object} item 
 */
async function switchRetry(item){
  const that = this;
  let result = '';
  let proxyLength = that.proxy.length;
  ////////////////////
  if(that.retry !== 'any'){ // sequence递归模式
      for(let iProxy of that.proxy){
        try{
          result = await requestMeothods.promiseReqWrapper.bind(that)(that.item, iProxy);
          if(result instanceof Error){
            continue;
          }else{// 不是错误就停止请求
            break;
          }
        }catch(err){
          result = err;
          continue;
        }
      }
    that.resolve(result);
  }else{// 竞赛模式
    console.log('竞赛模式>>>>>>>>>')
    pAny(that.proxy.map(iProxy=>requestMeothods.promiseReqWrapper.bind(that)(that.item, iProxy)))
    .then(first => {
      that.resolve(myLogger.log(`first: ${first}<<<<<<<<<`));
    })
    .catch(err=>{
      that.resolve(myDebug('竞赛模式全都报错', true));
    });
  }
  ////////////////////
}

/**
 * 可控并发事件
 * @param {array} list -需要轮询的列表
 * @param {Date} now -轮询开始时间
 * @param {string} note -extra info
 */
async function startScheme(list=[], now=(new Date()), notes='' ){
  console.log(`----${notes}轮询开始: ${now.toString()}---`);
  try{
    let reuslt = await pMap(list, (item)=>RequsetFactory(item).promise(), {concurrency: 8});
    console.log(reuslt);
  }
  catch(err){
    console.log('pMap发生错误');
    console.log(err);
  }
  console.log(`本次${notes}轮询: ${now.toString()}`);
  console.log('的结束时间为:' + (new Date()).toString());
  console.log('-----------------------------');
}

////创建定时器
async function main(){
  // 创建所需目录
  for(let dir of dirConfig.dirArr){
    await pMakeDir(dirConfig.base+dir)
    .then(success=>{})
    .catch(err=>console.error(err));
  }
  let ruleI6 = new schedule.RecurrenceRule();
  ruleI6.minute = [new schedule.Range(0, 59, 6)];// 6分钟轮询
  
  let ruleI20 = new schedule.RecurrenceRule();
  ruleI20.minute = [new schedule.Range(0, 59, 20)];// 20分钟轮询
 
  let ruleH1 = new schedule.RecurrenceRule();
  ruleH1.minute = 3;// 1d 
 /*  let ruleITest = new schedule.RecurrenceRule();
  ruleITest.second = [new schedule.Range(0, 59, 30)];// Test

  let jobTest = schedule.scheduleJob(ruleITest, (fireDate)=>startScheme(config.iTest, fireDate, '30s')); */
  
  let job6 = schedule.scheduleJob(ruleI6, (fireDate)=>startScheme(config.i6, fireDate, '6分钟'));
  let job20 = schedule.scheduleJob(ruleI20, (fireDate)=>startScheme(config.i20, fireDate, '20分钟'));
  let jobH1 = schedule.scheduleJob(ruleH1, (fireDate)=>startScheme(config.h1, fireDate, '1 day'));
  startScheme(config.i6, new Date(), '6分钟');
  startScheme(config.i20, new Date(),'20分钟');
  startScheme(config.h1, new Date(),'1 day');

  // 创建目录
  //schedule.scheduleJob(ruleITest, (fireDate)=>startScheme(config.i20, fireDate, '30s'));
  // startScheme(config.i20, new Date(),'30s');
}

main()
.catch(err=>{
  console.error('主程序错误'+err);
});

/**
If-Modified-Since: Wed, 22 Jun 2011 06:40:43 GMT
If-None-Match: "2c1-4a6473f6030c0"
 * 
 * 
 */
