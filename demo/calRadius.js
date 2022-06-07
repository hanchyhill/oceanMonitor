const tcJson = require("./2021-12-14_Rai.json");
const _R = 6371009;  // 地球平均半径
const maxLatGridDis = 111320; // 最大纬距
const _MAXGRIDINTERVAL = 111320; // 最大纬距
const d3 = require("d3");
/**
 * 计算两点间的距离
 * @param {Array} point0 纬度,经度
 * @param {Array} point1 纬度,经度
 * @returns {Number} distance 距离, 单位: 米
 */
function cal2PointsDistance(point0 = [110.0, 20.0], point1 = [120.0, 25.0]) {

  const lambda0 = point0[0] / 180.0 * Math.PI;  // λ经度
  const phi0 = point0[1] / 180.0 * Math.PI;  // φ 纬度
  const lambda1 = point1[0] / 180.0 * Math.PI;  // λ经度
  const phi1 = point1[1] / 180.0 * Math.PI;  // φ 纬度
  const deltalambda = Math.abs(lambda1 - lambda0);
  const delSigma = Math.acos(Math.sin(phi0) * Math.sin(phi1) + Math.cos(phi0) * Math.cos(phi1) * Math.cos(deltalambda));
  const distance = _R * delSigma;
  return distance;
}

/**
 * 
 * @param {Array} latRange 纬度范围
 * @param {Array} lonRange 经度范围
 * @param {Number} interval 经纬度间隔
 * @returns {Array} [[经度, 纬度],]
 */
function createMesh(lonRange = [100, 150], latRange = [0, 45], interval = 0.25) {
  const n = parseInt((lonRange[1] - lonRange[0]) / interval);
  const m = parseInt((latRange[1] - latRange[0]) / interval);
  const initLon = lonRange[0];
  const initLat = latRange[0];
  const lonlat = new Array(n * m);
  for (let j = 0, k = 0; j < m; ++j) {
    for (let i = 0; i < n; ++i, ++k) {
      lonlat[k] = [initLon + i * interval, initLat + j * interval];
    }
  }
  return lonlat;
}

function getHitCount() {


  let mesh = createMesh();

  const arrLength = mesh.length;
  let hitArr = new Array(arrLength);
  // const ensLength = tcJson['tracks'].length;
  const whichWindR = 18;
  let windIndex;
  switch (whichWindR) {
    case 18:
      windIndex = 0;
      break;
    case 26:
      windIndex = 1;
      break;
    case 33:
      windIndex = 2;
      break;
    default:
      throw new Error('异常的风圈设定');
  }
  for (let i = 0; i < arrLength; ++i) {// 遍历每个格点
    let conut = 0;
    const grid = mesh[i];
    for (let iTrack of tcJson['tracks']) {// 遍历51条路径
      // const fcLength = iTrack.track;
      // let isHit = false;
      for (let iFc of iTrack.track) {// 遍历每个预报时效

        const trackLon = iFc[1][0];
        const trackLat = iFc[1][1];
        const infoR = iFc[5][windIndex];
        let radius;
        if (grid[0] >= trackLon && grid[1] >= trackLat) {
          radius = infoR[1]// 第1象限
        }
        else if (grid[0] >= trackLon && grid[1] < trackLat) {
          radius = infoR[2]// 第2象限
        }
        else if (grid[0] < trackLon && grid[1] < trackLat) {
          radius = infoR[3]// 第3象限
        }
        else if (grid[0] < trackLon && grid[1] >= trackLat) {
          radius = infoR[4]// 第4象限
        }
        else {
          throw new Error('异常的象限判断');
        }

        // 判断风圈是否在内
        if (radius === 0) {
          continue;// 直接下一个预报时效
        } else {
          const diffLon = Math.abs(grid[0] - trackLon);
          const diffLat = Math.abs(grid[1] - trackLat);
          if (maxLatGridDis * diffLon > radius || maxLatGridDis * diffLat > radius) {
            continue;// 粗算间隔过大，下一个预报时效
          }
          else {
            const distance = cal2PointsDistance([trackLon, trackLat], grid);
            if (distance <= radius) {
              conut += 1;
              // isHit = true;
              break;
            } else {
              continue;// 距离超出范围
            }
          }
        }

      }
    }
    hitArr[i] = conut;
  }

  // hitArr.forEach((hit, index)=>{
  //   if(hit>40) console.log(mesh[index]);
  // })

  return hitArr;
}

function getBound(tcRaw = tcJson) {
  const tacksLocArr = tcRaw.tracks.map(iTrack =>
    iTrack['track'].map(iTime => iTime[1])
  ).flat(1);
  const lonArr = tacksLocArr.map(v => v[0]);
  const latArr = tacksLocArr.map(v => v[1]);
  const maxLon = Math.max(...lonArr);
  const maxLat = Math.max(...latArr);
  const minLon = Math.min(...lonArr);
  const minLat = Math.min(...latArr);
  return [[minLon, minLat], [maxLon, maxLat]];
}
function main() {
  performance.mark("bound-start");
  let bound = getBound();
  performance.mark("bound-end");
  performance.measure(
    "bound",
    "bound-start",
    "bound-end"
  );
  var measures = performance.getEntriesByName("bound");
  var measure = measures[0];
  console.log("获取边界运行时间, 秒:", measure.duration / 1000.0);
  console.log(bound.toString());
  bound[0][0] -= 8.0;// 纬度
  bound[0][1] = bound[0][1] < 8.0 ? 0 : bound[0][1] - 8.0;// 是否会小于赤道0
  bound[1][0] = bound[1][0] > 172 ? 180 : bound[1][0] + 8;// 是否会大于180度
  bound[1][1] += bound[1][1] > 82 ? 89 : bound[1][1] + 8;
  console.log(bound.toString());
  // performance.mark("hit-start");
  // const hitArr = getHitCount();
  // performance.mark("hit-end");
  // performance.measure(
  //   "hit",
  //   "hit-start",
  //   "hit-end"
  // );
  // var measures = performance.getEntriesByName("hit");
  // var measure = measures[0];
  // console.log("计算袭击概率运行时间, 秒:", measure.duration / 1000.0);
}

// d3.geoBounds()
main();