//const fs = require('fs');
const {promisify} = require('util');
const fs = require('fs');
const readFile = promisify(fs.readFile);
const path = require('path');
// console.log(typeof readFile);
const config = {
  regArr : [
    {name:'WTPQ2-RJTD',cn:'JMA台风预报',reg:/"WTPQ2\s*?RJTD(\d{6})/i,},
    {name:'WTPQ5-RJTD',cn:'JMA台风预报5天',reg:/WTPQ5\s*?RJTD(\d{6})/i,},
    {name:'WTPQ3-RJTD',cn:'JMA分析报',reg:/WTPQ3.*?RJTD\s*?(\d{6})/i,},
    {name:'FXPQ8-RJTD',cn:'JMA数值指导预报',reg:/FXPQ.*?RJTD\s*?(\d{6})/i,},
    {name:'WTPN3-PGTW',cn:'JTWC台风预报',reg:/WTPN3.*?PGTW\s*?(\d{6})/i,},
    {name:'WTPN5-PGTW',cn:'JTWC台风预报长remark',reg:/WTPN5.*?PGTW\s*?(\d{6})/i,},
    {name:'WTPN2-PGTW',cn:'JTWC理由分析',reg:/WTPN2.*?PGTW\s*?(\d{6})/i,},
    {name:'ABPW-PGTW',cn:'JTWC当前台风通报',reg:/ABPW.*?PGTW\s*?(\d{6})/i,},
    {name:'TPPN-PGTW',cn:'JTWC台风定位报',reg:/TPPN.*?PGTW\s*?(\d{6})/i,},
    {name:'WDPN-PGTW',cn:'JTWC诊断分析报',reg:/WDPN.*?PGTW\s*?(\d{6})/i,},
    {name:'WTSS-VHHH',cn:'HKO台风警报',reg:/WTSS.*?VHHH\s*?(\d{6})/i,},
    {name:'FXSS2-VHHH',cn:'HKO主观预报',reg:/FXSS2.*?VHHH\s*?(\d{6})/i,},
    {name:'FXSS0-VHHH',cn:'HKO模式指导预报',reg:/FXSS0.*?VHHH\s*?(\d{6})/i,},
    {name:'WTPH-RPMM',cn:'PAGASA警报',reg:/WTPH.*?RPMM\s*?(\d{6})/i,},
    {name:'WTPQ2-BABJ',cn:'北京台风警报',reg:/WTPQ2.*?BABJ\s*?(\d{6})/i,extra:{warning:'sameFileName'}},
    {name:'TCPQ4-BABJ',cn:'北京卫星定位报',reg:/TCPQ4.*?BABJ\s*?(\d{6})/i,},
    {name:'SBHK-VHHH',cn:'HKO卫星定位报',reg:/SBHK.*?VHHH\s*?(\d{6})/i,},
    {name:'SBCI-BCGZ',cn:'GZ卫星定位报',reg:/SBCI.*?BCGZ\s*?(\d{6})/i,},
    {name:'SDTH20-VTBB',cn:'bankok卫星定位报',reg:/SDTH20.*?VTBB\s*?(\d{6})/i,},
    {name:'SDPH-RPMM',cn:'PAGASA卫星定位报',reg:/SDPH.*?RPMM\s*?(\d{6})/i,},
  ]
}

/**
 * 
 * @param {string} chunk 报文
 */
const headFilter = (chunk='')=>{
  return config.regArr.some(item=>item.reg.test(chunk));
}

const scanMeta = (bulletin='')=>{
  let reg = undefined;
  let time = '';
  let date = undefined;
  let name = undefined;
  let cn = undefined;
  let timeStamp = '';
  let today = new Date();
  let utc = [today.getUTCFullYear() ,today.getUTCMonth(), today.getUTCDate()];
  for(let iReg of config.regArr){
    reg = iReg.reg;
    let result = reg.exec(bulletin);
    if(result){
      let iTime = result[1];
      let iDay = Number(iTime.slice(0,2));
      let iHour = Number(iTime.slice(2,4));
      let iMinute = Number(iTime.slice(4,6));
      let initTime = new Date(utc[0],utc[1],iDay,iHour,iMinute);
      if(initTime.getTime()-today.getTime()>0){
        initTime = new Date(utc[0],utc[1]-1,iDay,iHour,iMinute);
      }// OR today.date<iDay?today.date -1 
      name = iReg.name;
      cn = iReg.cn;
      date = initTime;
      timeStamp = initTime.toUTCString();
      break;
    }
    
  }
}

/**
 * 主执行文件
 */
const main = async ()=>{
  const raw = await readFile(path.join(__dirname,'93080200.ABJ'),'ascii');
  const rawArr = raw.split('NNNN');
  const catchArr = rawArr.filter(chunk=>headFilter(chunk));
  const metaArr = catchArr.map(scanMeta);
  // console.log(catchArr);
}

main()
.then(v=>{})
.catch(err=>console.log(err));
