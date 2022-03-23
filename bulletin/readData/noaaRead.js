// TODO 并发执行rp
const rp = require('request-promise');
const cheerio = require('cheerio');
const moment = require('moment');
const {resolveData} = require('./readData');
// const url = 'http://tgftp.nws.noaa.gov/data/raw/wt/?C=M;O=D';
// http://tgftp.nws.noaa.gov/data/raw/ab/?C=M;O=D
// http://tgftp.nws.noaa.gov/data/raw/tp/?C=M;O=D
// http://tgftp.nws.noaa.gov/data/raw/wd/?C=M;O=D

const config = {
  wt:{
    url:'http://tgftp.nws.noaa.gov/data/raw/wt/?C=M;O=D',
    base:'http://tgftp.nws.noaa.gov/data/raw/wt/',
    lastDate : Date.now() - 1000*60*60*24*30,
    rules:[
      {reg:/wtpq2.*?rjtd/,name:'WTPQ2-RJTD',},
      {reg:/wtpq3.*?rjtd/,name:'WTPQ3-RJTD',},
      {reg:/wtpq5.*?rjtd/,name:'WTPQ5-RJTD',},
      {reg:/wtjp2.*?rjtd/,name:'WTJP2-RJTD',},//JMA WARNING
      {reg:/wtjp3.*?rjtd/,name:'WTJP3-RJTD',},//JMA STORM WARNING
      {reg:/wtpn2.*?pgtw/,name:'WTPQ2-PGTW',},
      {reg:/wtpn3.*?pgtw/,name:'WTPQ3-PGTW',},
      {reg:/wtpn5.*?pgtw/,name:'WTPQ5-PGTW',},
      {reg:/wtss.*?vhhh/,name:'WTSS-VHHH',},
      {reg:/wtko.*?rksl/,name:'WTKO-RKSL',},
      {reg:/wtph0.*?rpmm/,name:'WTPH0-RPMM',},// PAGASA 警报
      // {reg:/wtph2.*?rpmm/,name:'WTPH2-RPMM',},// PAGASA 台风预报
    ],
  },
  ab:{
    url:'http://tgftp.nws.noaa.gov/data/raw/ab/?C=M;O=D',
    base:'http://tgftp.nws.noaa.gov/data/raw/ab/',
    lastDate : Date.now() - 1000*60*60*24*30, // 30 days before
    rules:[
      {reg:/abpw.*?pgtw/,name:'ABPW-PGTW',},
    ],
  },
  tp:{
    url:'http://tgftp.nws.noaa.gov/data/raw/tp/?C=M;O=D',
    base:'http://tgftp.nws.noaa.gov/data/raw/tp/',
    lastDate : Date.now() - 1000*60*60*24*30,
    rules:[
      {reg:/tppn.*?pgtw/,name:'TPPN-PGTW',},
    ],
  },
  wd:{
    url:'http://tgftp.nws.noaa.gov/data/raw/wd/?C=M;O=D',
    base:'http://tgftp.nws.noaa.gov/data/raw/wd/',
    lastDate : Date.now() - 1000*60*60*24*30,
    rules:[
      {reg:/wdpn.*?pgtw/,name:'WDPN-PGTW',},
    ],
  },
  jtwc:{
    hasImg:true,
    url:'https://pzal.ndbc.noaa.gov/collab/jtwc/products/?C=M;O=D',
    base:'https://pzal.ndbc.noaa.gov/collab/jtwc/products/',
    lastDate : Date.now() - 1000*60*60*24*30,
    rules:[
      // {reg:/abpwweb/,name:'ABPW-PGTW',},
      {reg:/\.txt/,name:'PGTW',},
    ],
  }
}

async function getFileList(opt){
  let options = {
    uri: opt.url,
  };
  let html = null;
  try {
    html = await rp(options);
    
  } catch (error) {
    throw error;
  }
  const $ = cheerio.load(html);
  const trs = $('tr').slice(3,-1);// 去除头尾
  const initTd = opt.hasImg?1:0;// 兼容noaa jtwc镜像
  let fileArr = [];
  trs.each((i,item)=>{
    const tds = $(item).find('td');
    const fileName = $(tds[initTd+0]).text();
    const url = $(tds[initTd+0]).find('a').attr('href');
    const dateString = $(tds[initTd+1]).text();
    const date = moment(dateString.trim(), "DD-MMM-YYYY HH:mm")
    fileArr.push({fileName,url,date,});
  });

  const filterArr = fileArr.filter(v=>{// 筛查文件和日期
    let isInclude = false;
    let rules = opt.rules;
    for(let rule of rules){
      let result = rule.reg.exec(v.fileName);
      if(result && (v.date.valueOf() - opt.lastDate>0) ){// 限制日期
        isInclude = true;
        break;
      }
    };
    return isInclude;
  });
  
  return filterArr;
}

async function getNoaa(){
  let configKey = Object.keys(config);
  try{
    for (let iConfig of configKey){
      const list = await getFileList(config[iConfig]);
      if(list.length!=0){
        console.log(list);
        config[iConfig].lastDate = list[0].date.valueOf();// 记录最后更新时间，其实也可以记录lastModified
      }
      else{
        console.log(iConfig + ' noaa 没有更新');
      }

      for(let file of list){
        let bulletin = await rp(config[iConfig].base+file.url);
        resolveData(bulletin)
          .catch(err=>{console.log('解析储存时发生错误'+err.message)});
      }
    }
  }
  catch(err){
    throw err;
  }
}

// getNoaa()
//   .catch(err=>{
//     console.log(err);
//   });

exports.getNoaa = getNoaa;