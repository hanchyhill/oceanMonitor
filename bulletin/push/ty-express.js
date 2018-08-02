const rp = require('request-promise');
const cheerio = require('cheerio');
const moment = require('moment');
const webPush = require('web-push');
const mongoose = require('mongoose');
const {connect,initSchemas} = require('../database/initDB.js');
const schedule = require('node-schedule');
const MD5 = require('md5');
// TODO: 模块化
// TODO: 改成30秒轮询

webPush.setVapidDetails(
  'https://serviceworke.rs/',
  'BFqbp_L8wDhix6IIki9mxJGcJmOQAQ32euPT8NIvL4YPn-ahHuw6flgPVOvkgu2VTlHJ6cvcXy-BjKA7EWHrqFE',
  'kGeqK9MsnaI4PTOvMAD8w9dSV6sYBvsIeISGpx9NIEE'
);

config ={
  md5:''
}
proxyOptions = {
  proxy: 'http://127.0.0.1:1070'
}
let Subscribe = undefined;
async function getTyExpress(){
  const html = await rp('http://www.nmc.cn/publish/typhoon/typhoon_new.html');
  const $ = cheerio.load(html);
  const mainContent = $('#text');
  const content = mainContent.text();
  const number = mainContent.find('.number');
  
  const year = number.text().match(/(\d+)年/)[1];
  const ctitle = mainContent.find('.ctitle');
  const dateArr = ctitle.text().match(/(\d+)月(\d+)日(\d+)时(\d+)分/);
  const writing = mainContent.find('.writing').text();
  const data = {
    date:[year,dateArr[1],dateArr[2],dateArr[3],dateArr[4],],
    text:writing,
    update:new Date(),
  }
  // return data;
  // console.log(mainContent.text());
  const md5 = MD5(content);
  if(md5===config.md5) return console.log('与上次相同');
  config.md5 = md5;
  const subscribes = await Subscribe.find({}).exec();
  const options = {
    TTL: 10*60
  };
  if(subscribes){
    for(let sub of subscribes){
      console.log(sub);
      webPush.sendNotification({endpoint:sub.endpoint,keys:sub.keys}, JSON.stringify(data), options)
      .then(data => {
        console.log('push 完成'+sub.endpoint);
        return;
      })
      .catch(err => {
        // 判断状态码，404和410表示失效
        // console.log(err);
        if (err.statusCode === 410 || err.statusCode === 404) {
          console.log('已失效'+sub.endpoint);
          Subscribe.deleteOne({endpoint:sub.endpoint})
          .then(()=>console.log('删除成功'))
          .catch(err=>{
            console.log(err);
          });
        }
        else if(err.code== 'ETIMEDOUT'||err.code == 'ECONNRESET'){
          console.log('超时/重置错误')
          webPush.sendNotification({endpoint:sub.endpoint,keys:sub.keys}, JSON.stringify(data), proxyOptions)
          .then(data => {
            console.log('push 完成'+sub.endpoint);
            return;
          })
          .catch(err => {
            console.log('第二次发送失败');
            console.error(err);
          })
        }
        else {
          console.log('未知错误'+sub.endpoint);
          console.log(err);
          
/*           Subscribe.deleteOne({endpoint:sub.endpoint})
          .then(()=>console.log('删除异常节点'))
          .catch(err=>{
            console.log(err);
          }); */
        }
      })
    }
  }
  console.log('完成此次巡查');
}

async function main(){
  await connect();
  initSchemas();
  Subscribe = mongoose.model('Subscribe');
  let ruleI1 = new schedule.RecurrenceRule();
  ruleI1.minute = [new schedule.Range(0, 59, 1)];// 1分钟轮询
  let job1 = schedule.scheduleJob(ruleI1, (fireDate)=>{
    // TODO 检测是否连接上mongodb
    console.log('轮询开始'+fireDate.toString());
    getTyExpress()
    .catch(err=>{
    console.log(err);
    })
  });
  getTyExpress()
    .catch(err=>{
    console.log(err);
    })
}

main()
.catch(err=>{
  console.log(err);
})
