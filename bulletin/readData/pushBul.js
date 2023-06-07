const mongoose = require('mongoose');
let Subscribe = mongoose.model('Subscribe');
const {pushData} = require('./../push/util.push.js');

const JTWC = {
  head:'WTPN3-PGTW',
  regTCFA : 'TROPICAL CYCLONE FORMATION ALERT',// WTPN
  icon:'/static/thumbnails/JTWC_LogoFront.gif',
  title:'JTWC台风生成警报',
  url:'https://pzal.ndbc.noaa.gov/collab/jtwc/',
};
//'WTPN3-PGTW'
const RJTD = {
  head:'WTPQ5-RJTD',
  testStr : 'UPGRADED FROM',
  icon:'/static/thumbnails/Japan_Meteorological_Agency_logo2.jpg',
  title:'JMA台风预报',
  url:'http://www.jma.go.jp/jp/typh/',
};//WTPQ20 RJTD

const pushBulletin = async function(bulletin={}){
  // console.log('推送报文=======================================================');
  if(bulletin.name===JTWC.head&&bulletin.content.indexOf(JTWC.regTCFA)!==-1){
  //if(bulletin.name===JTWC.head){
    data = {
      text:bulletin.content.substring(0,500),
      update:new Date(),
      type:'TCFA',
      title:JTWC.title,
      icon:JTWC.icon,
      url:JTWC.url,
    }
    console.log('=========推送JTWC======');
    pushData(data,Subscribe);
  }else if(bulletin.name===RJTD.head){
    console.log('=========推送JMA========');
    data = {
      text:bulletin.content.substring(0,500),
      update:new Date(),
      type:'RJTD',
      title:RJTD.title,
      icon:RJTD.icon,
      url:RJTD.url,
    }
    pushData(data,Subscribe);
  }
}
exports.pushBulletin = pushBulletin;