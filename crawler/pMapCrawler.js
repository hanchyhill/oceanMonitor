/**
 *  TODO
 * config抽离
 * axios 实例分离
 * stream模式导致文件写入文件时间过长
 */
const schedule = require('node-schedule');// import * as schedule from 'node-schedule';
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const pMap = require('p-map');
// const cheerio = require('cheerio');
// const http = require('http');

const dirConfig ={
  base:'../static/remote-img/',
  dirArr:['env/', 'sat/', 'ascat/']
};

const config = {
  i20: [
    {urlBase:'https://www.tropicaltidbits.com/analysis/ocean/', name:'cdas-sflux_sst_wpac_1.png', lastModified:'', dir:'env/'},//'last-modified'
    {urlBase:'https://www.tropicaltidbits.com/analysis/ocean/', name:'cdas-sflux_ssta_wpac_1.png', lastModified:'', dir:'env/'},
    {urlBase:'https://www.tropicaltidbits.com/analysis/ocean/', name:'cdas-sflux_ssta_global_1.png', lastModified:'', dir:'env/'},
    {urlBase:'http://www.oceanweather.com/data/South-China-Sea/', name:'WAVE000.GIF', lastModified:'', dir:'env/'},
    {urlBase:'http://www.oceanweather.com/data/NPAC-Western/', name:'WAVE000.GIF', lastModified:'', dir:'env/west-'},
    {urlBase:'http://tropic.ssec.wisc.edu/real-time/westpac/winds/', name:'wgmsvor.GIF' , lastModified:'', dir:'env/'},
    {urlBase:'http://tropic.ssec.wisc.edu/real-time/westpac/winds/', name:'wgmsconv.GIF', lastModified:'', dir:'env/'},
    {urlBase:'http://tropic.ssec.wisc.edu/real-time/westpac/winds/', name:'wgmsdvg.GIF' , lastModified:'', dir:'env/'},
    {urlBase:'http://tropic.ssec.wisc.edu/real-time/westpac/winds/', name:'wgmsshr.GIF' , lastModified:'', dir:'env/'},
    {urlBase:'http://tropic.ssec.wisc.edu/real-time/westpac/winds/', name:'wgmssht.GIF' , lastModified:'', dir:'env/'},
    {urlBase:'http://tropic.ssec.wisc.edu/real-time/westpac/winds/', name:'wgmswv.GIF'  , lastModified:'', dir:'env/'},
    {urlBase:'http://tropic.ssec.wisc.edu/real-time/westpac/winds/', name:'wgmsir.GIF'  , lastModified:'', dir:'env/'},
    {urlBase:'http://www.ssd.noaa.gov/PS/TROP/TCFP/data/current/', name:'wp_rCUMP_048.gif', lastModified:'', dir:'env/'},
    {urlBase:'http://www.ssd.noaa.gov/PS/TROP/TCFP/data/current/', name:'wp_rTCFP_024.gif', lastModified:'', dir:'env/'},
    {urlBase:'http://www.ssd.noaa.gov/PS/TROP/TCFP/data/current/', name:'wp_rTCFP_048.gif', lastModified:'', dir:'env/'},
    {urlBase:'http://wxmaps.org/pix/'                            , name:'wpacpot.png'     , lastModified:'', dir:'env/'},
    {urlBase:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/', name:'WMBds230.png' , lastModified:'', dir:'ascat/'},
    {urlBase:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/', name:'WMBds242.png' , lastModified:'', dir:'ascat/'},
    {urlBase:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/', name:'WMBds254.png' , lastModified:'', dir:'ascat/'},
    {urlBase:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/', name:'WMBds231.png' , lastModified:'', dir:'ascat/'},
    {urlBase:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/', name:'WMBds243.png' , lastModified:'', dir:'ascat/'},
    {urlBase:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/', name:'WMBds255.png' , lastModified:'', dir:'ascat/'},
    {urlBase:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/', name:'WMBds232.png' , lastModified:'', dir:'ascat/'},
    {urlBase:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/', name:'WMBds244.png' , lastModified:'', dir:'ascat/'},
    {urlBase:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/', name:'WMBds256.png' , lastModified:'', dir:'ascat/'},
    {urlBase:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/', name:'WMBds233.png' , lastModified:'', dir:'ascat/'},
    {urlBase:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/', name:'WMBds245.png' , lastModified:'', dir:'ascat/'},
    {urlBase:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/', name:'WMBds257.png' , lastModified:'', dir:'ascat/'},
    {urlBase:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/', name:'WMBas230.png' , lastModified:'', dir:'ascat/'},
    {urlBase:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/', name:'WMBas242.png' , lastModified:'', dir:'ascat/'},
    {urlBase:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/', name:'WMBas254.png' , lastModified:'', dir:'ascat/'},
    {urlBase:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/', name:'WMBas231.png' , lastModified:'', dir:'ascat/'},
    {urlBase:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/', name:'WMBas243.png' , lastModified:'', dir:'ascat/'},
    {urlBase:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/', name:'WMBas255.png' , lastModified:'', dir:'ascat/'},
    {urlBase:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/', name:'WMBas232.png' , lastModified:'', dir:'ascat/'},
    {urlBase:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/', name:'WMBas244.png' , lastModified:'', dir:'ascat/'},
    {urlBase:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/', name:'WMBas256.png' , lastModified:'', dir:'ascat/'},
    {urlBase:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/', name:'WMBas233.png' , lastModified:'', dir:'ascat/'},
    {urlBase:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/', name:'WMBas245.png' , lastModified:'', dir:'ascat/'},
    {urlBase:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/', name:'WMBas257.png' , lastModified:'', dir:'ascat/'},
  ],
  i6:[
    {urlBase:'http://tropic.ssec.wisc.edu/real-time/westpac/images/kml/', name:'irbdgmskml.GIF', lastModified:'', dir:'sat/'},// 这个是不是有问题?
    {urlBase:'http://tropic.ssec.wisc.edu/real-time/westpac/images/kml/', name:'yyirgms5.GIF'  , lastModified:'', dir:'sat/'},
    {urlBase:'http://tropic.ssec.wisc.edu/real-time/westpac/images/kml/', name:'yyirgms5n.GIF' , lastModified:'', dir:'sat/'},
    {urlBase:'http://tropic.ssec.wisc.edu/real-time/westpac/images/kml/', name:'yywvgms5.GIF'  , lastModified:'', dir:'sat/'},
    {urlBase:'http://www.ssd.noaa.gov/jma/twpac/', name:'vis-l.gif', lastModified:'', dir:'sat/'},
    {urlBase:'http://www.ssd.noaa.gov/jma/twpac/', name:'ir2-l.gif', lastModified:'', dir:'sat/'},
    {urlBase:'http://www.ssd.noaa.gov/jma/twpac/', name:'wv-l.gif' , lastModified:'', dir:'sat/'},
    {urlBase:'http://www.ssd.noaa.gov/jma/twpac/', name:'ir4-l.gif', lastModified:'', dir:'sat/'},
    {urlBase:'http://www.ssd.noaa.gov/jma/twpac/', name:'bd-l.gif' , lastModified:'', dir:'sat/'},
    {urlBase:'http://www.ssd.noaa.gov/jma/twpac/', name:'rb-l.gif' , lastModified:'', dir:'sat/'},
    {urlBase:'http://www.ssd.noaa.gov/jma/twpac/', name:'avn-l.gif', lastModified:'', dir:'sat/'},
    {urlBase:'http://www.ssd.noaa.gov/jma/twpac/', name:'rgb-l.jpg', lastModified:'', dir:'sat/'},
    {urlBase:'http://www.ssd.noaa.gov/poes/twpac/', name:'ss85-l.jpg', dir:'sat/'},
    {urlBase:'http://www.ssd.noaa.gov/poes/twpac/', name:'sswd-l.jpg', dir:'sat/'},
    {urlBase:'http://www.ssd.noaa.gov/poes/twpac/', name:'am89-l.jpg', dir:'sat/'},
  ],
};

function getImgPromise(item){
  return new Promise((resolve,reject)=>{
    getImg(item,resolve,reject);// this
  });
}

function getImg(item,resolve,reject){
  const [urlBase, fileName] = [item.urlBase, item.name]
  // console.log(urlBase + fileName);
  axios({
    method: 'get',
    url: urlBase + fileName,
    responseType: 'stream',
    timeout: 20000,// 20秒
  })
  .then(function(res) {
    let lastModified = res.headers['last-modified'];
    if(lastModified === item.lastModified){
      // console.log('图片未改变: '+ fileName);
      resolve('图片未改变');
    }
    else{
      item.lastModified = lastModified;// 先写入lastModified，防止同时写入相同文件
      res.data.pipe(fs.createWriteStream('../static/remote-img/' + item.dir + fileName));
      res.data.on('end',function(){
        console.log(fileName + '图片已写入');
        resolve(fileName + '图片已写入');
      });
      res.data.on('error',err=>{
        console.log('写入错误');
        resolve('写入错误');
      })
    }
    
  })
  .catch(error=>{
    console.log('连接错误: ' + urlBase + fileName);
    console.log('Error: ', error.message);
    console.log('Error code: ', error.code);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      
      // console.log(error.response.data);
      console.log('状态码: ' + error.response.status);
      console.log('头部信息: ' + error.response.headers);
      resolve('捕获错误响应');
    } else if (error.request) {// 超时
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      // console.log(error.request);
      console.log('捕获错误请求');
      // console.log(error.request);
      resolve('捕获错误请求');
    } else {
      // Something happened in setting up the request that triggered an Error
      // console.log('Error', error.message);
      resolve('捕获错误message');
    }
    // console.log(error.config);
  });
}

/**
 * 可控并发事件
 * @param {array} list -需要轮询的列表
 * @param {Date} now -轮询开始时间
 * @param {string} note -extra info
 */
async function startScheme(list=[], now=(new Date()), note='' ){
  console.log(`----${note}轮询开始: ${now.toString()}---`);
  try{
    let reuslt = await pMap(list, getImgPromise, {concurrency: 8})
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
let ruleI6 = new schedule.RecurrenceRule();
ruleI6.minute = [new schedule.Range(0, 59, 6)];// 6分钟轮询

let ruleI20 = new schedule.RecurrenceRule();
ruleI20.minute = [new schedule.Range(0, 59, 20)];// 20分钟轮询

job6 = schedule.scheduleJob(ruleI6, (fireDate)=>startScheme(config.i6, fireDate, '6分钟'));
job20 = schedule.scheduleJob(ruleI20, (fireDate)=>startScheme(config.i20, fireDate, '20分钟'));
// job20 = schedule.scheduleJob(ruleI20, startScheme(config.i20));
startScheme(config.i6, new Date(), '6分钟');
startScheme(config.i20, new Date(),'20分钟');
// 创建目录


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

/**
 * Host: www.baidu.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:61.0) Gecko/20100101 Firefox/61.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,;q=0.8
Accept-Language: zh-CN,en-US;q=0.7,en;q=0.3
Accept-Encoding: gzip, deflate, br
Cookie: BDUSS=1d-aHI2VFNJYXhqU1VzLW0ya3ZXLW5sRTkyV3RQdFJzS1VMT0JIalRjTVV5WUphQVFBQUFBJCQAAAAAAAAAAAEAAADJkAgCbHJycTM2OQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQ8W1oUPFtac; BD_UPN=1352; BAIDUID=0C8E757668952766BBBEF287E518B207:FG=1; BIDUPSID=FB448E477143B9EF9E75677B640F91B0; PSTM=1522585929; ISSW=1; H_PS_PSSID=1428_21120_20881_20929; H_PS_645EC=cfb7BRpzUiUoxBGpG2Cw5R5CRfyCj%2BMQvliho%2FKmy6U4KS6ekgq4H34X6Vo; BD_CK_SAM=1; PSINO=6; sug=3; sugstore=1; ORIGIN=2; bdime=0; BDSVRTM=0
DNT: 1
Connection: keep-alive
Upgrade-Insecure-Requests: 1
If-Modified-Since: Wed, 22 Jun 2011 06:40:43 GMT
If-None-Match: "2c1-4a6473f6030c0"
Cache-Control: max-age=0
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */