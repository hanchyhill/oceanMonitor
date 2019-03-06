const webPush = require('web-push');

webPush.setVapidDetails(
  'mailto:lrrq369@gmail.com',
  'BFqbp_L8wDhix6IIki9mxJGcJmOQAQ32euPT8NIvL4YPn-ahHuw6flgPVOvkgu2VTlHJ6cvcXy-BjKA7EWHrqFE',
  'kGeqK9MsnaI4PTOvMAD8w9dSV6sYBvsIeISGpx9NIEE'
);

config ={
  md5:'',
  lastPush:0,
}
proxyOptions = {
  proxy: 'http://127.0.0.1:1070',
  gcmAPIKey:"AIzaSyBOVsyCvlwjaBLTZyzR14t6Mgt9yLTWJjo"
}

async function pushData(res,Subscribe){
  if(res.error){
    return console.log(res.message);
  }
  let now = Date.now();
  if(now-config.lastPush<5*1000){
    return setTimeout(function(){
      pushData(res,Subscribe);
    },5000);
  }else{
    config.lastPush = now;
  }
  const type = res.type;
  console.log('收到'+type);
  const subscribes = await Subscribe.find({}).exec();
  const options = {
    TTL: 10*60
  };

  if(subscribes){
    for(let sub of subscribes){
      console.log(sub);
      // webPush.sendNotification({endpoint:sub.endpoint,keys:sub.keys}, JSON.stringify(res), options)
      webPush.sendNotification({endpoint:sub.endpoint,keys:sub.keys}, JSON.stringify(res))
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
          webPush.sendNotification({endpoint:sub.endpoint,keys:sub.keys}, JSON.stringify(res), proxyOptions)
          .then(data => {
            console.log('push 完成'+sub.endpoint);
            return;
          })
          .catch(err => {
            console.log('第二次发送失败'+sub.endpoint);
            console.error(err);
          })
        }
        else {
          console.log('未知错误'+sub.endpoint);
          console.log(err);
        }
      })
    }
  }
}

exports.pushData = pushData;
