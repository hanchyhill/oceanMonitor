const rp = require('request-promise');
const cheerio = require('cheerio');
// const moment = require('moment');
const MD5 = require('md5');

md5Config ={
  buletBJ:'',
  tyExpress:'',
}

async function getBJbulet(){
  const html = await rp('http://www.nmc.cn/publish/typhoon/message.html');
  const $ = cheerio.load(html);
  const mainContent = $('#text > p');
  const content = mainContent.html().replace(/<br>/g,'\n');
  const md5 = MD5(content);
  if(md5!==md5Config.buletBJ){
    md5Config.buletBJ = md5;
    return {
      text:content,
      url:'http://www.nmc.cn/publish/typhoon/message.html',
      update:new Date(),
      type:'bulletin',
      title:'北京报文',
    };
  }else{
    return {error:true,message:'报文数据重复'};
  }
}

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
    type:'tyExpress',
    title:'台风快讯',
    url:'http://www.nmc.cn/publish/typhoon/typhoon_new.html',
  }

  const md5 = MD5(content);
  if(md5===md5Config.tyExpress){
    return {error:true,message:'快讯数据重复'};
  }else{
    md5Config.tyExpress = md5;
    return data;
  }
}

exports.getBJbulet = getBJbulet;
exports.getTyExpress = getTyExpress;
// async function main(){
//   getBJbulet()
//     .catch(err=>{
//     console.log(err);
//     })
// }

// main()
// .catch(err=>{
//   console.log(err);
// })
