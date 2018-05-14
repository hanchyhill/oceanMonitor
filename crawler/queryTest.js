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

queryData(config.tropicaltidbits.url, config.tropicaltidbits.filter)
  .then(data=>{
    console.log(data);
  })
  .catch(err=>{console.log(err)});

