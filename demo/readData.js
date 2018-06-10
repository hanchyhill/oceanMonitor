//const fs = require('fs');
const {promisify} = require('util');
const fs = require('fs');
const readFile = promisify(fs.readFile);
const path = require('path');
const MD5 = require('md5');
// console.log(typeof readFile);
const config = {
  regArr : [
    {name:'WTPQ2-RJTD',cn:'JMA台风预报',reg:/"WTPQ2\s*?RJTD(\d{6})/i,ins:'RJTD',},
    {name:'WTPQ5-RJTD',cn:'JMA台风预报5天',reg:/WTPQ5\s*?RJTD(\d{6})/i,ins:'RJTD',},
    {name:'WTPQ3-RJTD',cn:'JMA分析报',reg:/WTPQ3.*?RJTD\s*?(\d{6})/i,ins:'RJTD',},
    {name:'FXPQ8-RJTD',cn:'JMA数值指导预报',reg:/FXPQ.*?RJTD\s*?(\d{6})/i,ins:'RJTD',},
    {name:'WTPN3-PGTW',cn:'JTWC台风预报',reg:/WTPN3.*?PGTW\s*?(\d{6})/i,ins:'PGTW',},
    {name:'WTPN5-PGTW',cn:'JTWC台风预报长remark',reg:/WTPN5.*?PGTW\s*?(\d{6})/i,ins:'PGTW',},
    {name:'WTPN2-PGTW',cn:'JTWC理由分析',reg:/WTPN2.*?PGTW\s*?(\d{6})/i,ins:'PGTW',},
    {name:'ABPW-PGTW',cn:'JTWC当前台风通报',reg:/ABPW.*?PGTW\s*?(\d{6})/i,ins:'PGTW',},
    {name:'TPPN-PGTW',cn:'JTWC台风定位报',reg:/TPPN.*?PGTW\s*?(\d{6})/i,ins:'PGTW',},
    {name:'WDPN-PGTW',cn:'JTWC诊断分析报',reg:/WDPN.*?PGTW\s*?(\d{6})/i,ins:'PGTW',},
    {name:'WTSS-VHHH',cn:'HKO台风警报',reg:/WTSS.*?VHHH\s*?(\d{6})/i,ins:'VHHH',},
    {name:'FXSS2-VHHH',cn:'HKO主观预报',reg:/FXSS2.*?VHHH\s*?(\d{6})/i,ins:'VHHH',},
    {name:'FXSS0-VHHH',cn:'HKO模式指导预报',reg:/FXSS0.*?VHHH\s*?(\d{6})/i,ins:'VHHH',},
    {name:'WTPH-RPMM',cn:'PAGASA警报',reg:/WTPH.*?RPMM\s*?(\d{6})/i,ins:'RPMM',},
    {name:'WTPQ2-BABJ',cn:'北京台风警报',reg:/WTPQ2.*?BABJ\s*?(\d{6})/i,extra:{warning:'sameFileName'},ins:'BABJ',},
    {name:'TCPQ4-BABJ',cn:'北京卫星定位报',reg:/TCPQ4.*?BABJ\s*?(\d{6})/i,ins:'BABJ',},
    {name:'SBHK-VHHH',cn:'HKO卫星定位报',reg:/SBHK.*?VHHH\s*?(\d{6})/i,ins:'VHHH',},
    {name:'SBCI-BCGZ',cn:'广州卫星定位报',reg:/SBCI.*?BCGZ\s*?(\d{6})/i,ins:'BCGZ',},
    {name:'SDTH20-VTBB',cn:'曼谷卫星定位报',reg:/SDTH20.*?VTBB\s*?(\d{6})/i,ins:'VTBB',},
    {name:'SDPH-RPMM',cn:'PAGASA卫星定位报',reg:/SDPH.*?RPMM\s*?(\d{6})/i,ins:'RPMM',},
  ]
}

const util = {
  number2(num){
    return (Array(2).join('0') + num).slice(-2);
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
  const number2 = util.number2;
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
      let initTime = new Date(utc[0],utc[1],iDay,iHour,iMinute);
      let md5 = MD5(bulletin.replace(/ZCZC.*?\d{3}/,'').replace(/\s/g,''));//去除ZCZC开头，去除所有空白字符
      if(initTime.getTime()-today.getTime()>0){
        initTime = new Date(utc[0],utc[1]-1,iDay,iHour,iMinute);
        fulltime = utc[0].toString() + number2(utc[1]) + number2(iDay) + number2(iHour) + number2(iMinute);
      }// OR today.date<iDay?today.date -1 
      else{
        fulltime = utc[0].toString() + number2(utc[1]+1) + number2(iDay) + number2(iHour) + number2(iMinute);
      }
      name = iReg.name;
      cn = iReg.cn;
      date = initTime;
      timeStamp = initTime.toUTCString();
      title = result[0] + ' ' + fulltime;
      data = {content:bulletin,name,cn,date,timeStamp,fulltime, title,md5,}
      break;
    }
  }
  return data;
}

/**
 * 主执行文件
 */
const main = async ()=>{
  const raw = await readFile(path.join(__dirname,'93080200.ABJ'),'ascii');
  const rawArr = raw.split('NNNN');
  const catchArr = rawArr.filter(chunk=>headFilter(chunk));
  const metaArr = catchArr.map(scanMeta);
  console.log(metaArr);
}

main()
.then(v=>{})
.catch(err=>console.log(err));
