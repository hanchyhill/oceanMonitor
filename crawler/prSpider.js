/**
 *  TODO
 * stream模式导致文件写入文件时间过长
 * 写入文件夹需要先执行
 * p-any 出现竞争写入问题,使用isFullfill解决
 * 工具函数抽出util.js
 * 开始写入时备份文件
 * item的console.log收集成列表
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
const rp = require('request-promise');
// const cheerio = require('cheerio');
// const http = require('http');

function myDebug(message, isError){
  console.log(message);
  let status = {};
  if(isError){
    status = new Error(message);
    status.isError = true;
    return status;
  }else{
    status.message = message;
    return status;
  }
}

const myLogger = {
  debug(message, isError){
    console.log(message);
    let status = {};
    if(isError){
      status = new Error(message);
      status.isError = true;
      return status;
    }else{
      status.message = message;
      return status;
    }
  },
  note(notes, file, message){
    let info = `${notes?'['+notes+']':''}${file}:${message}`;
    console.log(info);
    return info;
  },
  bug(message){
    console.log(message);
    return new Error(message);
  },
  log(message){
    console.log(message);
    return message;
  }
}
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

const requestMeothods = {
  /**
   * promise 请求封装
   * @param {object} item 包含url的元数据
   * @param {string} proxy 是否使用代理
   * @param {string} retry 竞赛或者递归模式
   */
  promiseReqWrapper(item, proxy, retry){
    let that = this;
    return new Promise((resolve,reject)=>{
      requestMeothods.pGet.bind(that)(item, proxy, resolve, reject);
    });
  },

  /**
   * 获取图片并且写入磁盘
   * @param {object} iItem 需要获取的元数据
   * @param {string} proxy 是否使用代理
   * @param {function} iResolve resolve句柄
   * @param {function} iReject reject句柄
   */
  async pGet(iItem, proxy, iResolve, iReject){
    // console.log(proxy);
    const that = this;
    const item = iItem || that.item;
    const resolve = iResolve || that.resolve ;
    const reject = iReject || that.reject ;
    const [urlBase, fileName] = [item.urlBase, item.name];
    let options = undefined;
    const customOpt = {
      resolveWithFullResponse: true,
      encoding: null,
      url: urlBase + fileName,
      headers:{
        'If-Modified-Since': item.lastModified,
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1;) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36',
      },
    };

    let notes = ''; // 注释

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
    let preModified = item.lastModified;
    let requestStatus = {};
    try{
      let status  = await requestMeothods.pResopne(options);
      let res = status.response;
      if(res){
        let lastModified = res.headers['last-modified'];
        if(lastModified === preModified){
          resolve(myLogger.note(notes, fileName, '最后修改时间相同'));
        }
        else{
          const ws = fs.createWriteStream('../static/remote-img/' + item.dir + fileName);
          ws.write(res.body,'binary');
          ws.end();
          ws.on('finish', function() {
            resolve(myLogger.note(notes, fileName,'已写入'));
          });
          ws.on('error', function(){
            item.lastModified = preModified;
            reject(myLogger.bug(`${notes+fileName}写入错误`));
          });
        };
      }
      else{
        // 304
        resolve(myLogger.note(notes, fileName,status.message));
      }
    }catch(err){
      if(err.isError){
        reject(myLogger.note(notes, fileName, err.message));
      }else{
        reject(myLogger.note(notes, fileName, err.message));
      }
    }
  },

  /**
   * 异步获取数据，错误封装，并把符合条件的respone返回，
   * @param {object} options 请求选项
   */
  async pResopne(options){
    let res = undefined;
    let status = {};
    try{
      res = await rp(options);
      if(res.statusCode===200){
        status = myDebug('获得响应:200');
        status.response = res;
      }
      else{
        status = myDebug(`意外的响应状态码:${res.statusCode}`,true);
      }
    }catch(err){
      if (err.response){
        if(err.response.statusCode === 304){
          status= myDebug(`304未修改`);
        }else{
          status = myDebug(`捕获错误响应${err.response.status}`,true);
        }
      } else if (err.request){// 超时
        status = myDebug(`超时`,true);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('连接错误:' + options.url);
        if(err.error){
          console.log('Error code: ', err.error.code);
          status = myDebug(`捕获错误:${err.message}`,true);
        }else{
          console.log('内部错误: ', err);
          status = myDebug(`捕获错误:${err.message}`,true);
        }
      };
    };
    if(status instanceof Error){
      throw status;
    }else{
      return status;
    }
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
      timeout: 40000,// 60s
    }
  },
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
  let ruleI6 = new schedule.RecurrenceRule();
  ruleI6.minute = [new schedule.Range(0, 59, 6)];// 6分钟轮询
  
  let ruleI20 = new schedule.RecurrenceRule();
  ruleI20.minute = [new schedule.Range(0, 59, 20)];// 20分钟轮询
  
  let ruleITest = new schedule.RecurrenceRule();
  // ruleITest.second = [new schedule.Range(0, 59, 30)];// 20分钟轮询
  
  job6 = schedule.scheduleJob(ruleI6, (fireDate)=>startScheme(config.i6, fireDate, '6分钟'));
  job20 = schedule.scheduleJob(ruleI20, (fireDate)=>startScheme(config.i20, fireDate, '20分钟'));
  
  startScheme(config.i6, new Date(), '6分钟');
  startScheme(config.i20, new Date(),'20分钟');
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