const rp = require('request-promise');
const cheerio = require('cheerio');
const moment = require('moment');
const webPush = require('web-push');

webPush.setVapidDetails(
  'mailto:lrrq369@gmail.com',
  'BFqbp_L8wDhix6IIki9mxJGcJmOQAQ32euPT8NIvL4YPn-ahHuw6flgPVOvkgu2VTlHJ6cvcXy-BjKA7EWHrqFE',
  'kGeqK9MsnaI4PTOvMAD8w9dSV6sYBvsIeISGpx9NIEE'
);

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
    year,
    month:dateArr[1],
    day:dateArr[2],
    hour:dateArr[3],
    min:dateArr[4],
    content,
    writing,
  }
  return data;
  // console.log(mainContent.text());
}

const pushMessage = ()=>{
  const subscription = req.body.subscription;
    const payload = null;
    const options = {
      TTL: req.body.ttl
  };
  webPush.sendNotification(subscription, payload, options)
  .then(function() {
    console.log('推送完成');
  })
  .catch(function(error) {
    console.log(error);
    console.log('推送错误');
  });
}

getTyExpress()
.catch(err=>{
  console.log(err);
})