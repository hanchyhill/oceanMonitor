// TODO 增加确定性预报
// TODO 增加0时刻数据
process.env.NODE_ENV = 'production';
// console.log(process.env.NODE_ENV);
const axios = require('axios');
const {IDEA_config} = require('../config/private.IDEA.token.js');
const moment = require('moment');
const {connect,initSchemas} = require('../database/initDBCyclone.js');
let save2DB;
const schedule = require('node-schedule');

let config = {
  lastDataList: [],
  insList:['TRAMS_TY01','TRAMS_TY02','TRAMS_TY03','TRAMS_TY04', 'TRAMS_TY05', 'TRAMS_TY06',
  'TRAMS_TY07','TRAMS_TY08','TRAMS_TY09','TRAMS_TY10','TRAMS_TY11','TRAMS_TY12','TRAMS_TY13',
  'TRAMS_TY14','TRAMS_TY15','TRAMS_TY16','TRAMS_TY17','TRAMS_TY18','TRAMS_TY19','TRAMS_TY20',
  'TRAMS_TY21','TRAMS_TY22','TRAMS_TY23','TRAMS_TY24','TRAMS_TY25','TRAMS_TY26','TRAMS_TY27',
  'TRAMS_TY28','TRAMS_TY29','TRAMS_TY30'],
  runningList:[],
}

async function getCurrentTYlist(){
  let cTyUrl = `http://172.22.1.175/di/http.action?userId=${IDEA_config.userId}&pwd=${IDEA_config.pwd}&interfaceId=getSevpNewestTyphoonInfo&dataFormat=json`;
  let rp = await axios.get(cTyUrl)
    .catch(err=>{throw err});
  let tyList = rp.data.DATA;
  tyList = tyList.map(ty=>{
    return {
      INTLID: ty.INTLID,
      TSCNAME: ty.TSCNAME,
      TSENAME: ty.TSENAME,
      TSID: ty.TSID, 
    }
  });
  return tyList;
}

async function main(){
  let currentTYlist = await getCurrentTYlist()
    .catch(err=>{throw err});
  // console.log(currentTYlist);
  for(let tc of currentTYlist){
    let obsUrlList = config.insList.map(ins=>{
      return `http://172.22.1.175/di/http.action?userId=${IDEA_config.userId}&pwd=${IDEA_config.pwd}&interfaceId=getRACTyphoonObs4Tsid&dataFormat=json&tsid=${tc.TSID}&fcid=${ins}`;
    });
    let allObsList = await Promise.all(obsUrlList.map(url=>getTyObs(url)));
    let leastData = allObsList.reduce((acc,cv)=>{
      if(cv.empty){
        return acc;
      }else{
        if(acc.empty){
          return {
            CRTTIME: cv.CRTTIME,
            DDATETIME: cv.DDATETIME,
            FCID: cv.FCID,
            TSID: cv.TSID,
          }
        }else{
          let cvDDATETIME = moment(cv.DDATETIME);
          let cvCRTTIME = moment(cv.DDATETIME);
          let accDDATETIME = moment(acc.DDATETIME);
          let accCRTTIME = moment(acc.DDATETIME);
          if(accDDATETIME.isBefore(cvDDATETIME)){
            return {
              CRTTIME: cv.CRTTIME,
              DDATETIME: cv.DDATETIME,
              FCID: cv.FCID,
              TSID: cv.TSID,
            }
          }else if(accDDATETIME.isSame(cvDDATETIME)){
            if(accCRTTIME.isBefore(cvCRTTIME)){
              return {
                CRTTIME: cv.CRTTIME,
                DDATETIME: cv.DDATETIME,
                FCID: cv.FCID,
                TSID: cv.TSID,
              }
            }else{
              return acc;
            }
          }else{
            return acc;
          }
        }
      }
    },{empty:true});
    // TODO 比较config.lastList的数据，有更新则进行数据下载。
    if(leastData.empty) continue; //空值则返回
    let sameIndex = config.lastDataList.findIndex((ele)=>{//找相同元素
      const isTheSame =  ele.TSID == leastData.TSID &&
            ele.CRTTIME == leastData.CRTTIME &&
            ele.DDATETIME == leastData.DDATETIME;
      return isTheSame;
    })
    if(sameIndex>-1) continue;
    
    let fcUrlList = config.insList.map(ins=>{
      return `http://172.22.1.175/di/http.action?userId=${IDEA_config.userId}&pwd=${IDEA_config.pwd}&interfaceId=getRACTyphoonFst4Tsid&dataFormat=json&tsid=${tc.TSID}&fcid=${ins}&ymdhms=${moment(leastData.DDATETIME).format('YYYYMMDDHHmmss')}`;
    });
    let cycloneNumber = tc.INTLID.replace(/\*/g,'');
    let cycloneName = tc.TSENAME;
    let initTime = moment.utc(leastData.DDATETIME);

    let tcInfo = {
      "cycloneNumber": cycloneNumber,
      "cycloneName": cycloneName,
      "ins": "TRAMS_TY",
      "tcID": `${initTime.format('YYYYMMDDHH')}_${cycloneNumber?cycloneNumber:tc.TSID+'W'}_${cycloneName?cycloneName:cycloneNumber?cycloneNumber:tc.TSID+'W'}_TRAMS`,
      initTime:initTime.toDate(),
      "basinShort": "W",
      tracks:[]
    }
    let allForecaseList = await Promise.all(fcUrlList.map(url=>getTyForecast(url))).catch(err=>{throw err});
    for(let index = 0; index<config.insList.length; index++){
      let member = {
        "ensembleNumber": parseInt(config.insList[index].slice(-2)),
        track: allForecaseList[index],
      }
      tcInfo.tracks.push(member);
    }
    save2DB(tcInfo)
      .catch(err=>{
        console.error(err);
      })
    config.runningList.push(leastData);
  }
  if(config.runningList.length>0){
    config.lastDataList = config.runningList;
    config.runningList = [];
  }
}
// GZRD
async function getTyForecast(url){
  let rp = await axios.get(url).catch(err=>{throw err});
  let fcList = rp.data.DATA;
  
  let tracks = fcList.map(track=>{
    return {
      hour: track.LEADTIME,
      lat: track.LATITUDE,
      lon: track.LONGITUDE,
      pres: track.PRESSURE,
      wind: track.WINDSPEED,
    }
  });
  tracks = tracks.map(track=>[parseInt(track.hour), [parseFloat(track.lon),parseFloat(track.lat)],parseFloat(track.pres), parseFloat(track.wind)]);
  return tracks;
}

async function getTyObs(url){
  let rp = await axios.get(url).catch(err=>{throw err});
  let obsList = rp.data.DATA;
  let obsMeta;
  if(obsList.length>0){
    let nearestData = obsList[0];
    obsMeta = {
        CRTTIME: nearestData.CRTTIME,
        DDATETIME: nearestData.DDATETIME,
        FCID: nearestData.FCID,
        TSID: nearestData.TSID,
        lat: nearestData.LATITUDE,
        lon: nearestData.LONGITUDE,
        pres: nearestData.PRESSURE,
        wind: nearestData.WINDSPEED,
      };
    
  }else{
    obsMeta = {
      empty: true,
    }
  }
  return obsMeta;
}
/**
 * 整数补0
 * @param {Number} num 
 * @param {Number} length 
 */
function PrefixInteger(num, length) {
  return (Array(length).join('0') + num).slice(-length);
}



async function init(){
  await connect();
  initSchemas();
  save2DB = require('../database/util.db.js').save2DB;
  let ruleI6 = new schedule.RecurrenceRule();
  ruleI6.minute = [new schedule.Range(0, 59, 6)];// 1分钟轮询
  let job1 = schedule.scheduleJob(ruleI6, (fireDate)=>{
    // TODO 检测数据是否存在，存在则替换
    console.log('轮询开始'+fireDate.toString());
    main()
    .catch(err=>{
      console.error(err);
      return nextTime();
    });
  });
  main()
    .catch(err=>{
      console.error(err);
      return nextTime();
    });
}

init ()
.catch(err=>{
  console.error(err);
});