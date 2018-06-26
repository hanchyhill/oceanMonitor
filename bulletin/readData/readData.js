/* TODO 
        fulltime 日期由Date 对象来转化
*/
const {promisify} = require('util');
const fs = require('fs');
const readFile = promisify(fs.readFile);
const path = require('path');
const MD5 = require('md5');
const mongoose = require('mongoose');
let Bulletin = mongoose.model('Bulletin');
const {config} = require('./bulletinConfig.js');
// console.log(typeof readFile);

const util = {
  number2str(num,digit){
    return (Array(digit).join('0') + num).slice(-1 * digit);
  },
}

/**
 * 
 * @param {string} chunk 报文
 */
const headFilter = (chunk='')=>{
  return config.regArr.some(item=>item.reg.test(chunk));
}

const scanMeta = (bulletin='')=>{
  const number2str = util.number2str;
  let reg = undefined;
  let time = '';
  let date = undefined;
  let name = undefined;
  let cn = undefined;
  let title = undefined;
  let timeStamp = '';
  let today = new Date();
  let utc = [today.getUTCFullYear() ,today.getUTCMonth(), today.getUTCDate()];
  let fulltime = undefined;
  let data = undefined;
  for(let iReg of config.regArr){
    reg = iReg.reg;
    let result = reg.exec(bulletin);
    if(result){
      
      let iTime = result[1];
      let iDay = Number(iTime.slice(0,2));
      let iHour = Number(iTime.slice(2,4));
      let iMinute = Number(iTime.slice(4,6));
      let initTime = new Date(Date.UTC(utc[0],utc[1],iDay,iHour,iMinute));
      let md5 = MD5(bulletin.replace(/ZCZC.*?\d{3}/,'').replace(/\s/g,'').replace(/NNNN/g,''));//去除ZCZC开头，去除所有空白字符
      if(initTime.getTime()-today.getTime()>0){
        initTime = new Date(Date.UTC(utc[0],utc[1]-1,iDay,iHour,iMinute));
        //fulltime = utc[0].toString() + number2(utc[1]) + number2(iDay) + number2(iHour) + number2(iMinute);
      }// OR today.date<iDay?today.date -1 
      else{
        //fulltime = utc[0].toString() + number2(utc[1]+1) + number2(iDay) + number2(iHour) + number2(iMinute);
      }
      fulltime = initTime.getUTCFullYear().toString() + 
                 number2str(initTime.getUTCMonth()+1,2)  + 
                 number2str(initTime.getUTCDate(),2) + 
                 number2str(initTime.getUTCHours(),2) + 
                 number2str(initTime.getUTCMinutes(),2);
      name = iReg.name;
      cn = iReg.cn;
      date = initTime;
      timeStamp = initTime.toUTCString();
      title = result[0] + ' ' + fulltime;
      data = {content:bulletin,name,cn,date,timeStamp,fulltime, title,md5:md5,ins:iReg.ins}
      break;
    }
  }
  return data;
}

/**
 * 主执行文件
 */
const readDataFromFile = async ()=>{
  const raw = await readFile(path.join(__dirname,'93080200.ABJ'),'ascii');
  resolveData(raw);
}

const resolveData = async (raw)=>{
  const rawArr = raw.split('NNNN');
  const catchArr = rawArr.filter(chunk=>headFilter(chunk));
  const dataArr = catchArr.map(scanMeta);
  if(dataArr.length===0){
    // console.log('没有匹配数据');
    return '没有匹配数据';
  }
  else{
    dataArr.forEach(saveBulletin);
  }
}

async function saveBulletin(item){
  let bulletin = await Bulletin.findOne({
    title:item.title
  })
  if(!bulletin){// 不存在直接插入
    let transItem = Object.assign({},item,{content:[item.content],md5:[item.md5]});
    bulletin = new Bulletin(transItem);
    await bulletin.save()
      .catch(err=>{
        console.log('储存错误');
        console.error(err);
      });
  }
  else{// 存在判断md5是否一致
    if(!bulletin.md5.includes(item.md5)){
      bulletin.content.push(item.content);
      bulletin.md5.push(item.md5);
      await bulletin.save()
        .catch(err=>{
          console.log('储存错误');
          console.error(err);
        });
    }
    else{
      console.log(item.title+'已存在');
      return '数据已存在';
    };
  }
}

exports.readDataFromFile = readDataFromFile;
exports.resolveData = resolveData;
exports.saveBulletin = saveBulletin;
// main()
// .then(v=>{})
// .catch(err=>console.log(err));
