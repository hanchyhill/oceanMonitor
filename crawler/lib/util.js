// TODO 304归入错误类
const AgentHttp = require('socks5-http-client/lib/Agent');
const AgentHttps = require('socks5-https-client/lib/Agent');
const rp = require('request-promise');
const fs = require('fs');
const path = require('path');
const {promisify} = require('util');


/**
 * 递归创建目录
 * @param {string} dirname - 路径名
 * @param {function} callback - 回调函数
 */
function mkdirsCall(dirname, callback) {
  fs.exists(dirname, function (exists) {  
    if (exists) {
      callback();
    } else {  
      // console.log(path.dirname(dirname));  
      mkdirsCall(path.dirname(dirname), function () {  
          fs.mkdir(dirname, callback);  
          console.log('在' + path.dirname(dirname) + '目录创建好' + dirname  +'目录');
      });  
    }
  });
}

const pMakeDir = (dirname)=>{
  return new Promise((resolve,reject)=>{
    mkdirsCall(dirname,(err)=>err instanceof Error?reject(err):resolve('success'));
  });
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
        // console.log(res.headers['content-type']); // 'image/png'
        // console.log('pre:'+preModified);
        // console.log('now:'+lastModified);
        if(lastModified === preModified){
          resolve(myLogger.note(notes, fileName, '最后修改时间相同'));
        }
        else{
          item.lastModified = lastModified;
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
   * 响应 200 返回所有响应体
   * 响应 304 返回status.is304 true
   * 其他响应抛出错误
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
          status.is304 = true;
        }else{
          status = myDebug(`捕获错误响应${err.response.statusCode}`,true);
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
};

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

function myDebug(message, isError){
  if (process.env.NODE_ENV === 'production') {
    // just for production code
  }else{
    console.log(message);
  }
  
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

const isExists = (path='')=>{
  return new Promise((resolve,reject)=>{
    fs.exists(path,(isExists)=>{
      resolve(isExists);
    })
  });
}

module.exports = {
  requestMeothods, myLogger, myDebug, pMakeDir, isExists
};