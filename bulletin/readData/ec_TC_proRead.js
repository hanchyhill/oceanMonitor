// TODO 并发执行rp
const rp = require('request-promise');
// const cheerio = require('cheerio');
const moment = require('moment');
const fs = require('fs');
const {pMakeDir, isExists} = require('../../crawler/lib/util.js');
const path = require('path');
const schedule = require('node-schedule');

// https://apps.ecmwf.int/plots/product-download/catalogue/medium-tc-genesis/?time=2019071200,72,2019071500&projection=classical_wnp&layer_name=genesis_ts&token=83a1eeb52164da924afe55b2d253517c&email=ql.li@siat.ac.cn
const config = {
  token:'83a1eeb52164da924afe55b2d253517c',
  urlExp:['https://apps.ecmwf.int/plots/product-download/catalogue/medium-tc-genesis/?time=',
          '&projection=classical_wnp&layer_name=genesis_ts&token=',
          '&email='],
  email:'ql.li@siat.ac.cn',
  timeList:[72,96,120,144,168,192,216,240,264,288,],
  leastFile : '2019.png',
}


function gen_TC_proUrl (initDate,fcHour,finalDate,token,email){
  return `https://apps.ecmwf.int/plots/product-download/catalogue/medium-tc-genesis/?time=${initDate},${fcHour},${finalDate}&projection=classical_wnp&layer_name=genesis_ts&token=${token}&email=${email}`;

}

function gen_TC_proList(initDate='2019071200'){
  let initT = moment.utc(initDate,'YYYYMMDDHH');
  let timeList = [];
  for(let fcHour of config.timeList){
    let fcTime = moment(initT).add(fcHour,'hours');
    let timeFormat = [initDate,fcHour,fcTime.format('YYYYMMDDHH')];
    timeList.push(timeFormat);
  }
  let urlList = timeList.map(vT=>gen_TC_proUrl(vT[0],vT[1],vT[2],config.token,config.email));
  return urlList;
}

async function getPro() {
  let now = moment.utc();
  let nHour = now.hour();
  let fitTime;
  let fitYear;
  if(nHour>8&&nHour<=20){
    fitTime = now.format('YYYYMMDD')+'00';
  }else if(nHour>20){
    fitTime = now.format('YYYYMMDD')+'12';
  }else{
    fitTime = moment(now).subtract(1,'days').format('YYYYMMDD')+'12';
  }
  fitYear = fitTime.slice(0,4);
  let dirPath = path.resolve(__dirname+'./../../../data/img/tc_ec_pro/',fitYear+'/'+fitTime);
  await pMakeDir(dirPath);//创建不存在的目录
  let urlList = gen_TC_proList(fitTime);

  // TODO 查找盘符中是否存在
  let downloadList = [];
  for(let url of urlList){
    let fileName = 'ecTcPro' + url.match(/time=(.*?)&/)[1]+'.png';
    const filePath = path.resolve(dirPath, fileName);
    let isFileExists = await isExists(filePath);// 判断文件是否存在
    if(!isFileExists){
      downloadList.push(url);
    }else{
      // myDebug(`文件已存在${RegArr[2]}`);
      continue;
    }
  }
  console.log(`需要下载${downloadList.length}个文件`);
  for(let url of downloadList){
    let fileName = 'ecTcPro' + url.match(/time=(.*?)&/)[1]+'.png';
    let opt = {
      uri:url,
      encoding: null,
    }
    try{
      
      let img = await rp(opt);
      fs.writeFile(path.resolve(dirPath,fileName),img,err=>{
        if(!err){
          config.leastFile = fileName;
          console.log('写入: '+fileName);
          // TODO 写一个latest的JSON进去
        }else{
          console.error(err)
        }
      });
    }catch(err){
      console.error(err)
    }
  }
  return moment().format('YYYY-MM-DD HH:mm:ss')
}



function tcProMainJob(){
  let ruleI10 = new schedule.RecurrenceRule();
  ruleI10.minute = [new schedule.Range(0, 59, 15)];// 15分钟轮询
  let job10 = schedule.scheduleJob(ruleI10, (fireDate)=>{
    console.log('轮询开始'+fireDate.toString());
    getPro()
      .then(data=>{
        console.log('完成本次下载 '+data);
      })
      .catch(err=>{
      console.log(err);
      });
  });
  return job10;
}

tcProMainJob();
getPro()
  .then(data=>{
    console.log('完成本次下载 '+data);
  })
  .catch(err=>{
  console.log(err);
  });