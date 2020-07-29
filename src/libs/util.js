import axios from 'axios';
import env from '../config/env';

let util = {

};
util.title = function(title) {
    title = title ? title + ' - 海洋监测' : '海洋监测';
    window.document.title = title;
};

const protocol = location.protocol;
const isLocal = location.host.search(/8080/)===-1?false:true;
const ajaxUrl = isLocal ?
    'http://127.0.0.1:10074' :
    // 'https://trident.gdmo.gq' :
    env === 'production' ?
    protocol + '//trident.gdmo.gq' :
    protocol + '//trident.gdmo.gq';

util.ajax = axios.create({
    baseURL: ajaxUrl,
    timeout: 30000
});

function calDistance(point={x:0,y:0}, endpoint0={x:0,y:0}, endpoint1={x:0,y:0}){
  // B->endpoint0, A->endpoint0, C->point 由于检测站点一般位于台风西侧，端点反转降低计算量
  const x = point.x, y = point.y, x1 = endpoint1.x, y1 = endpoint1.y, x2 =endpoint0.x, y2 = endpoint0.y;
  let distance;
  const cross = (x2 - x1) * (x - x1) + (y2 - y1) * (y - y1); // |AB| * |AC|*cos(x)
  // `|AB| * |AC|*cos(x) = ${cross}`
  if (cross <= 0) {
    //积小于等于0，说明 角BAC 是直角或钝角
    // `最小距离为AC`
    distance = Math.sqrt((x - x1) * (x - x1) + (y - y1) * (y - y1));
  }else{
    const d2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1); // |AB|
    // `|AB| = ${d2}`
    if (cross >= d2){
      // `最小距离为BC`
      //角ABC是直角或钝角
      distance = Math.sqrt((x - x2) * (x - x2) + (y - y2) * (y - y2)+0.0);
    }else{
      //锐角三角形
      // `计算垂足`
      // `最小距离为CD`
      const r = cross / d2;
      const px = x1 + (x2 - x1) * r;  // C在 AB上的垂足点（px，py）
      const py = y1 + (y2 - y1) * r;
      distance = Math.sqrt((x - px) * (x - px) + (y - py) * (y - py)+0.0); //两点间距离公式
    }
  }
  // console.log(distance);
  return distance;
}

function isHit(point={x:0,y:0}, endpoint0={x:0,y:0}, endpoint1={x:0,y:0}){
  const distance = calDistance(point, endpoint0, endpoint1);
  // console.log(distance);
  if(distance<=1){
    // console.log(distance);
    // console.log(point, endpoint0, endpoint1);
  }
  return distance<=1? true : false;
}

function calTChitProbility(targetPoint, trackList, totalMembers = 51){
  
  // let trackList = rpRaw.data[0].tracks;

  let catArr = trackList
    .map(member => member.track)
    .map(track => {
      let twoPointLineArr = [];
      for (let i = 0; i < track.length - 1; i++) {
        let point0 = track[i][1];
        let point1 = track[i + 1][1];
        let time0 = track[i][0];
        let time1 = track[i+1][0];
        if(time1 - time0 > 6) continue;
        const distance = Math.sqrt(Math.pow(point1[0]-point0[0],2) + Math.pow(point1[1]-point0[1],2));
        if(distance>9) continue; // 如果大于6个经纬度则断线
        twoPointLineArr.push({
          line: { type: "LineString", coordinates: [point0, point1] }
        });
      }
      return twoPointLineArr;
    })
  
  let countHit = 0
  for(let trackLineList of catArr){
    for(let iLineWarp of trackLineList){
      let coord = iLineWarp.line.coordinates;
      let endpoint0 = {x: coord[0][0], y: coord[0][1]};
      let endpoint1 = {x: coord[1][0], y: coord[1][1]};
      let iHit = isHit(targetPoint, endpoint0, endpoint1);
      if(iHit){
        // 如果路径任意一段击中，则此路径袭击
        // console.log(targetPoint, endpoint0, endpoint1)
        // console.log(iHit);
        countHit++;
        break
      }
    }
  }
  // console.log(countHit);
  const hitProbility = countHit / totalMembers;
  return hitProbility;
}

export default util;
export {calTChitProbility};
