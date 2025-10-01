// 递归函数exec()
const rp = require('request-promise');
const cheerio = require('cheerio');
const moment = require('moment');

config = {
  abpw:{
    url:'https://pzal.ndbc.noaa.gov/collab/jtwc/products/abpwweb.txt',
    lastModified:'',
    steps:[{
      url:'https://pzal.ndbc.noaa.gov/collab/jtwc/products/abpwweb.txt',
      exec:(data)=>{
        return data;
      },
    }],
  },
  jtwc:{
    url:'https://mirror.mesovortices.com/jtwc/rss/jtwc.rss',
    steps:[
      {exec:(data)=>{

      }}
    ]
  }
}

const getBullet = async ()=>{
  // let rawData = await rp(config.abpw.url);
  const rawData = await rp(config.jtwc.url);
  const $ = cheerio.load(rawData, {
    normalizeWhitespace: true,
    xmlMode: true
  });
  // const item = $('item').first();
  const item = $('item').eq(1);
  // let pubDate = item.find('pubDate').text();
  const desc = item.find('description').text();
  // console.log(desc.search('No Current Tropical Cyclone Warnings') == -1);
  if(desc.search('No Current Tropical Cyclone Warnings') < 0){// 查看是否有热带气旋
    const links = $(desc).find('a');
    console.log(links);
  }else{
    console.log('没有热带气旋');
    return;
  }
};

getBullet()
  .catch(err=>{
    console.log('发生错误');
    console.err(err);
  })