/**
 *  TODO
 * stream模式导致文件写入文件时间过长
 * 写入文件夹需要先执行
 * p-any 出现竞争写入问题
 */
const {config, dirConfig} = require('./crawlerConfig.js');
const schedule = require('node-schedule');// import * as schedule from 'node-schedule';
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const pMap = require('p-map');
const pAny = require('p-any');
const AgentHttp = require('socks5-http-client/lib/Agent');
const request = require('request');
const AgentHttps = require('socks5-https-client/lib/Agent');
// const cheerio = require('cheerio');
// const http = require('http');

/**
 * 递归创建目录
 * @param {string} dirname - 路径名
 * @param {function} callback - 回调函数
 */
function mkdirs(dirname, callback) {
  fs.exists(dirname, function (exists) {  
    if (exists) {
      callback();
    } else {  
      // console.log(path.dirname(dirname));  
      mkdirs(path.dirname(dirname), function () {  
          fs.mkdir(dirname, callback);  
          console.log('在' + path.dirname(dirname) + '目录创建好' + dirname  +'目录');
      });  
    }  
  });
}

for(let dir of dirConfig.dirArr){
  mkdirs(dirConfig.base + dir, ()=>{});
}


function RequsetFactory(item){
  let obj = {
    resolve:undefined,
    reject:undefined,
    item,
    promise(item){
      let that = this;
      return new Promise((resolve,reject)=>{
        that.resolve = resolve;
        that.reject = reject;
        that.getImg(item||that.item);
      });
    },
    getImg:getImg,
    retry:item.retry === 'any'? 'any' : 'sequence',//'any',//'sequence',// 竞赛模式，递归模式
    proxy:['normal','socks'],
  }
  return obj;
}

const requestMeothods = {
  promiseRequest(iItem, proxy, iResolve, iReject){
    // console.log(proxy);
    const that = this;
    const item = iItem || that.item;
    const resolve = iResolve || that.resolve ;
    const reject = iReject || that.reject ;
    const [urlBase, fileName] = [item.urlBase, item.name];
    let options = undefined;
    const customOpt = {
      url: urlBase + fileName,
      headers:{
        'If-Modified-Since': item.lastModified,
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1;) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36',
      },
    };

    let notes = '';

    if(proxy === 'socks'){
      notes = 'socks';
      if(urlBase.startsWith('https')){
        options = Object.assign({}, requestMeothods.options.common, requestMeothods.options.https2Socks,customOpt);
      }else{
        options = Object.assign({}, requestMeothods.options.common, requestMeothods.options.http2Socks,customOpt);
      }
    }else{
      options = Object.assign({}, requestMeothods.options.common, customOpt);
      // console.log(options);
    }
    // console.log(options);
    let preModified = item.lastModified;
    request(options)
    .on('error',(err)=>{
      item.lastModified = preModified;// 发生错误时回退
      console.log(`${notes}错误: ${urlBase + fileName}`);
      console.log('Error message: '+err.message) //
      let newError = new Error(`${notes}错误: ${err.message}`);
      reject(newError);
    })
    .on('response',(response)=>{
      // console.log(`${notes}获取响应${response.statusCode}：${fileName}`);
      if(response.statusCode === 304){// 数据未修改
        console.log(`${notes}地址304: ${fileName}`);
        resolve(`${notes}地址304: ${fileName}`);
      }
      else if(response.statusCode === 200){
        let lastModified = response.headers['last-modified'];
        
        if(lastModified === preModified){
          console.log(`${notes}图片未改变:  ${fileName}`);
          resolve(`${notes}图片未改变:  ${fileName}`);
        }
        else{
          response.on('error',err=>{
            item.lastModified = preModified;// 发生错误时回退
            console.log(`${notes}写入错误`);
            let newError = new Error(`${notes}写入错误`);
            reject(newError);
          });
          let ws = fs.createWriteStream('../static/remote-img/' + item.dir + fileName);
          ws.on('pipe',()=>{
            item.lastModified = lastModified;// 写入lastModified，防止同时写入相同文件
            console.log(`${fileName}正在写入`);
          });

          response.pipe(ws);

          ws.on('finish',()=>{
            console.log(`${notes}已写入${fileName}`);
            resolve(`${notes}已写入${fileName}`);
          });
        }
      }
      else{
        item.lastModified = preModified;
        let newError = new Error('意外的响应状态码:' + response.statusCode);
        console.log(newError.message);
        reject(newError);
      }
    });
  },
  options:{
    http2Socks:{
      timeout: 60000,//60s
      agentClass: AgentHttp,
      agentOptions: {
        socksHost: 'localhost', // Defaults to 'localhost'.
        socksPort: 1080 // Defaults to 1080.
      },
    },
    https2Socks:{
      timeout: 60000,//60s
      strictSSL: true,
      agentClass: AgentHttps,
      agentOptions: {
      socksHost: 'localhost', // Defaults to 'localhost'.
      socksPort: 1080 // Defaults to 1080.
      }
    },
    common:{
      timeout: 60000,// 60s
    }
  },
  promiseReqWrapper(item, proxy, retry){
    return new Promise((resolve,reject)=>{
      requestMeothods.promiseRequest(item, proxy, resolve, reject);
    });
  }
}

async function getImg(item){
  const that = this;
  // that.axiosGet();
  let result = '';
  let proxyLength = that.proxy.length;
  if(that.retry !== 'any'){ // sequence递归模式, any竞赛模式 retry
    
      for(let iProxy of that.proxy){
        try{
          // console.log(iProxy);
          result = await requestMeothods.promiseReqWrapper(that.item, iProxy);
          // console.log(result);
          if(result instanceof Error){
            continue;
          }else{// 不是错误就停止请求
            break;
          }
        }catch(err){
          // console.log(err);
          continue;
          // that.resolve(err);
        }
      }
    that.resolve(result);
  }else{// 竞赛模式
    console.log('竞赛模式>>>>>>>>>')
    pAny(that.proxy.map(iProxy=>requestMeothods.promiseReqWrapper(that.item, iProxy)))
    .then(first => {
      console.log(`first: ${first}<<<<<<<<<`);
      that.resolve(first);
      //=> 'google'
    })
    .catch(err=>{
      let newError = new Error('竞赛模式全都报错');
      that.resolve(newError);
    });
  }
}

/**
 * 可控并发事件
 * @param {array} list -需要轮询的列表
 * @param {Date} now -轮询开始时间
 * @param {string} note -extra info
 */
async function startScheme(list=[], now=(new Date()), note='' ){
  console.log(`----${note}轮询开始: ${now.toString()}---`);
  // let newRequest = RequsetFactory();
  try{
    // let reuslt = await newRequest.promise(list);
    ///let reuslt = await pMap(list.slice(14,17), (item)=>RequsetFactory(item).promise(), {concurrency: 8});
    
    // let reuslt = await pMap(list, (item)=>newRequest.promise.call(newRequest,item), {concurrency: 8})
    // let reuslt = await pMap(list, getImgPromise, {concurrency: 8})
    let reuslt = await pMap(list, (item)=>RequsetFactory(item).promise(), {concurrency: 8});
    console.log(reuslt);
  }
  catch(err){
    console.log('pMap发生错误');
    console.log(err);
  }
  console.log(`本次${note}轮询: ${now.toString()}`);
  console.log('的结束时间为:' + (new Date()).toString());
  console.log('-----------------------------');
}

////创建定时器
async function main(){
  let ruleI6 = new schedule.RecurrenceRule();
  ruleI6.minute = [new schedule.Range(0, 59, 6)];// 6分钟轮询
  
  let ruleI20 = new schedule.RecurrenceRule();
  ruleI20.minute = [new schedule.Range(0, 59, 20)];// 20分钟轮询
  
  let ruleITest = new schedule.RecurrenceRule();
  ruleITest.second = [new schedule.Range(0, 59, 30)];// 20分钟轮询
  
  job6 = schedule.scheduleJob(ruleI6, (fireDate)=>startScheme(config.i20, fireDate, '6分钟'));
  // job20 = schedule.scheduleJob(ruleI20, (fireDate)=>startScheme(config.i20, fireDate, '20分钟'));
  
  startScheme(config.i20, new Date(), '6分钟');
  // startScheme(config.i20, new Date(),'20分钟');
  // 创建目录
  //schedule.scheduleJob(ruleITest, (fireDate)=>startScheme(config.i20, fireDate, '30s'));
  // startScheme(config.i20, new Date(),'30s');
}

main();

/**
If-Modified-Since: Wed, 22 Jun 2011 06:40:43 GMT
If-None-Match: "2c1-4a6473f6030c0"
 * 
 * 
 */