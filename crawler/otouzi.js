const {requestMeothods, myLogger} = require('./lib/util.js');
const cheerio = require('cheerio');

const config = {
  nmcTyExpress:{
    name:'中央气象台台风快讯',
    url:'http://www.nmc.cn/publish/typhoon/typhoon_new.html',
    filter(html){
      const $ = cheerio.load(html,{decodeEntities: false});
      const mainBlock = $('#maincontent #text');
      const episode = mainBlock.find('.number').text().replace(/\n| /g,'');
      const publishDate = mainBlock.find('.ctitle span:last-of-type').text();
      const content = mainBlock.find('.writing').html();
      return {
        episode,
        publishDate,
        content,
      }
    },
  },
  tropicaltidbits:{
    name:'tropicaltidbits',
    url:'https://www.tropicaltidbits.com/storminfo/',
    filter(html){
      
      const $ = cheerio.load(html,{decodeEntities: false});
      const mainBlocks = $('.stormWrapper');
//      console.log(mainBlocks.length);
      let stroms = [];
      if(mainBlocks.length){
        mainBlocks.each((i, elem)=>{
          let nameRaw = $(elem).find('.storm-name').text();
          let timestamp = $(elem).find('.timestamp').text();
          let infoRaw = $(elem).find('.storm-info').text();
          let jtwc = $(elem).find('img[alt~=JTWC]').attr('src');
          let gefs = $(elem).find('img[alt~=GEFS]').attr('src');
          stroms[i]={
            nameRaw, timestamp, infoRaw, jtwc,gefs
          };
        })
      }else{
        throw new Error('no storms info');
      };
      
      return stroms;
    },
  },
  otouzi:{
    name:'otouzi',
    url:'https://www.otouzi.com/p2p',
    filter(html){
      
      const $ = cheerio.load(html,{decodeEntities: false});
      const mainBlocks = $('.list-detail');
      console.log(mainBlocks.length);
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
      
      return listArr;
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

queryData(config. otouzi.url, config. otouzi.filter)
  .then(data=>{
    console.log(data);
  })
  .catch(err=>{console.log(err)});

