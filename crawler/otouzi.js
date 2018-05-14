const {requestMeothods, myLogger} = require('./lib/util.js');
const cheerio = require('cheerio');
const open = require('open');

let isOpen = [];

const config = {
  otouzi:{
    name:'otouzi',
    url:'https://www.otouzi.com/p2p',
    filter(html){
      
      const $ = cheerio.load(html,{decodeEntities: false});
      const mainBlocks = $('.list-detail');
      // console.log(mainBlocks.length);
      let listArr = [];
      if(mainBlocks.length){
        mainBlocks.each((i, elem)=>{
          let url = $(elem).find('h3 a[href*=product]').attr('href');
          let title = $(elem).find('h3 a[href*=product]').attr('title');
          let available = $(elem).find('.list-detail-balance span').text();
          let interestRate = $(elem).find('.list-detail-earnings span').text();
          let deadline = $(elem).find('.list-detail-deadline span').text();
          let method = $(elem).find('.list-detail-mess').eq(1).find('.list-detail-earnings').text();
          let duration = $(elem).find('.list-detail-mess').eq(1).find('.list-detail-deadline').text();
          listArr[i]={
            url, available, title, interestRate, deadline, method, duration,
          };
        })
      }else{
        throw new Error('no list');
      };
      
      /**
       * url 地址
       * available 可投资金额
       * deadline 最短投资时间
       * duration 投资期限
       * intersetRate 利率
       * method 是否等本, ture, false
       * title 标题
       */
      const investlist = listArr.map(ele=>{
        const url = 'https://www.otouzi.com/' + ele.url;
        const available = Number.parseFloat(ele.available);
        const deadline = Number.parseInt(ele.deadline);
        const regex1 = /\d+/;
        // const test = regex1.exec(ele.duration);
        const duration = Number.parseInt(regex1.exec(ele.duration)[0]);
        const interestRate = Number.parseFloat(ele.interestRate);
        const method = ele.method.includes('等本等息');
        const id = Number.parseInt(regex1.exec(ele.url)[0]);
        return {
          url, available, deadline, duration, interestRate, method, title:ele.title, id
        };
      })
      return investlist;
    },
  },
}

async function queryData(url, callback) {
  let options = {
    resolveWithFullResponse: true,
    url,
  };
  resolveWithFullResponse: true;
  let data = await requestMeothods.pResopne(options)
  .catch(err=>{
    console.error(err);
  });
  if(!data.response){
    return '没有响应体';
  }
  const html = data.response.body;
  return callback(html);
  // console.log(data.response.body);
}

function main(){
  queryData(config.otouzi.url, config.otouzi.filter)
  .then(data=>{
    data.forEach(elem => {
      if(elem.method && elem.duration==12 && elem.deadline>=6
      && !isOpen.includes(elem.id) ){//&& elem.available>0){
        open(elem.url,'iexplore');
        isOpen.push(elem.id);
        console.log('打开');
        console.log(elem);
      }else{
      };
    });
    console.log('完成搜索');
  })
  .catch(err=>{console.log(err)});

  setTimeout(main, 10000);
}

main();


