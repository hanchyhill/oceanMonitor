<template>
  <div id="app">
    <h2>热带气旋集合预报</h2>
    <div class="button-container">
      <Button @click="searchTC" type="primary" icon="ios-search">检索TC集合预报</Button>
      选择日期<DatePicker
        type="daterange"
        split-panels
        placeholder="Select date"
        style="width: 200px"
        @on-change="timeChange"
        :value="timeRange"
      ></DatePicker>
      选择机构<i-select  multiple v-model="selectedModel" style="width:550px">
        <OptionGroup label="WMO数据源">
          <i-option  v-for="item in modelListOffice" :value="item.value" :key="item.value">
          {{ item.label }}
        </i-option>
        </OptionGroup>
        <OptionGroup label="RUC源">
          <i-option  v-for="item in modelListRuc" :value="item.value" :key="item.value">
          {{ item.label }}
          </i-option>
        </OptionGroup>
        <OptionGroup label="EMC源">
          <i-option  v-for="item in modelListEmc" :value="item.value" :key="item.value">
          {{ item.label }}
          </i-option>
        </OptionGroup>
      </i-select>
      选择海区<i-select v-model="selectedBasin" style="width:100px">
        <i-option  v-for="item in basinList" :value="item.value" :key="item.value">
          {{ item.label }}
        </i-option>
      </i-select>
      筛选设置<i-select disabled v-model="tcFilter" style="width:150px">
        <i-option  value="removeEcNoControl" >
          剔除EC冗余
        </i-option>
        <i-option  value="all" >
          无筛选
        </i-option>
      </i-select>
      
    </div>
    <div class="select-tc-wrap">
      <div class="time-row">
        <i-button v-for="(item,i) in allTC" 
        :key="item.time" :ghost="i!=selectedTimeIndex" @click="switchTimeTable(i)"
        type="success" >
          {{item.time.slice(0, 13)}} UTC
        </i-button>
      </div>
      <div class="tc-table" v-if="allTC.length">
        <div v-for="(item,i) in allTC" :key="item.time" v-show="i==selectedTimeIndex">
          <div v-for="ins in item.ins" :key="ins.ins" v-show="ins.tc.length">
            <span class="tc-ins">
              <i-button  @click="showAllTC(ins)" :ghost="i!=selectedInsIndex[0]||ins.ins!=selectedInsIndex[1]" type="success">
                {{ins.ins}}
              </i-button>
            </span>
            <i-button v-for="(tc, indexTc) in ins.tc" @click="showTC(tc)" :key="tc.tcID+indexTc"
            type="success" :ghost="!selectedTC||tc.tcID!=selectedTC.tcID">
              {{showTCName(tc)}}
            </i-button>
          </div>
        </div>
      </div>
    </div>
    <Tabs type="card" :animated="false" v-model="currentTCcard" class="tc-tabs-card">
      <TabPane label="全局概览" name="overviewTC">
        <div class="relative-container">
          <div id="map-container3"></div>
          <div class="legend">
            <div style="background-color:rgb(85,85,79)">LOW</div>
            <div style="background-color:rgb(105,163,74)">TD</div>
            <div style="background-color:rgb(0,0,255)">TS</div>
            <div style="background-color:rgb(255,128,0)">STS</div>
            <div style="background-color:rgb(255,0,0)">TY</div>
            <div style="background-color:rgb(153,20,8)">STY</div>
            <div style="background-color:rgb(128,0,255)">SuperTY</div>
          </div>
        </div>
      </TabPane>
      <TabPane label="TC详情" name="singleTC">
        <div class="cyc-main" v-show="selectedTC">
          <div class="map-div">
            <div class="typhoon-info" v-if="selectedTC">
              当前台风：{{selectedTC?selectedTC.cycloneNumber:''}} {{selectedTC?selectedTC.cycloneName:''}}<br>
              起报时间: {{selectedTC?selectedTC.initTime.slice(0,13):''}}<br>
              机构: {{selectedTC?selectedTC.ins:''}}<br>
              追踪成员:{{selectedTC.tracks.length}}/{{tcMeta[selectedTC.ins].enNumber}}
              <br>
              袭击概率:<br>
              <div class="hit-pro-panel">
                <div v-for="(city, index) in hitCityList" 
                  :key="city.name+index"
                  :style="'background-color:'+city.color"
                >
                  <span>{{city.name}}: {{city.hit.toFixed(1)}}%</span>
                </div>
              </div>
              
            </div>
            <div>
              <div class="relative-container map-container">
                <div id="map-container"></div>
                <div class="legend">
                  <div style="background-color:rgb(85,85,79)">LOW</div>
                  <div style="background-color:rgb(105,163,74)">TD</div>
                  <div style="background-color:rgb(0,0,255)">TS</div>
                  <div style="background-color:rgb(255,128,0)">STS</div>
                  <div style="background-color:rgb(255,0,0)">TY</div>
                  <div style="background-color:rgb(153,20,8)">STY</div>
                  <div style="background-color:rgb(128,0,255)">SuperTY</div>
                </div>
                <div class="lonlat">
                  <div>Lon:<span class="lon"></span></div>
                  <div>Lat:<span class="lat"></span></div>
                </div>
              </div>
              <div class="relative-container map-container2">
                <div id="map-container2"></div>
                <div class="legend hour">
                  <div style="color:rgb(0,0,0)">      {{timeLegend[0]}}</div>
                  <div style="color:rgb(255,0,0)">    {{timeLegend[1]}}</div>
                  <div style="color:rgb(0,140,48)">   {{timeLegend[2]}}</div>
                  <div style="color:rgb(255,128,0)">  {{timeLegend[3]}}</div>
                  <div style="color:rgb(0,0,102)">    {{timeLegend[4]}}</div>
                  <div style="color:rgb(0,255,0)">    {{timeLegend[5]}}</div>
                  <div style="color:rgb(153,20,8)">   {{timeLegend[6]}}</div>
                  <div style="color:rgb(0,255,255)">  {{timeLegend[7]}}</div>
                  <div style="color:rgb(255,0,255)">  {{timeLegend[8]}}</div>
                  <div style="color:rgb(178,178,178)">{{timeLegend[9]}}</div>
                </div>
                <div class="lonlat">
                  <div>Lon:<span class="lon"></span></div>
                  <div>Lat:<span class="lat"></span></div>
                </div>
              </div>
            </div>
            <div class="bar-div">
              <div id="stacked-cat"></div>
              <div id="box-wind"></div>
              <div id="box-pressure"></div>
            </div>
          </div>
          
        </div>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
// TODO: 强度分类增加TD以下
// TODO: 点击名称可显示总览
// TODO: 更改地图为更高分辨率
// TODO: 鼠标定经纬度防抖
// import privateConfig from "./config/private.config.js";
import * as d3 from "d3";
const topojson = require("topojson-client");
import * as Plotly from "plotly.js/dist/plotly";
import Util from '../../libs/util';
import {calTChitProbility} from '../../libs/util';
const axios = Util.ajax;
import * as moment from "moment";
import { async } from 'q';
import cityInfo from '../../config/coastalCity.json';

// if(!window.fetch){
//   console.log('IE');
//   window.fetch = (url)=>{
//   return new Promise((resolve, reject)=>{
//     console.log(url);
//     axios.get(url,{baseURL: location.host})
//       .then(res=>{
//         resolve(res);
//       })
//       .catch(err=>{
//         reject(err);
//       })
//     })
//   }
// }

let tcUtil = {
  worldGeo: null,
  geoMap: [],
  tcColor: {
    SuperTY: "rgb(128,0,255)",
    STY: "rgb(153,20,8)",
    TY: "rgb(255,0,0)",
    STS: "rgb(255,128,0)",
    TS: "rgb(0,0,255)",
    TD: "rgb(105,163,74)",
    LOW: "rgb(85,85,79)"
  },

  wind2cat(wind) {
    if (wind >= 10.8 && wind < 17.2) {
      return "TD";
    } else if (wind >= 17.2 && wind < 24.5) {
      return "TS";
    } else if (wind >= 24.5 && wind < 32.7) {
      return "STS";
    } else if (wind >= 32.7 && wind < 41.5) {
      return "TY";
    } else if (wind >= 41.5 && wind < 51.0) {
      return "STY";
    } else if (wind >= 51.0) {
      return "SuperTY";
    } else {
      return "LOW";
    }
  },
  timeColor: [
    { name: "H24", color: "rgb(0,0,0)" },
    { name: "H48", color: "rgb(255,0,0)" },
    { name: "H72", color: "rgb(0,140,48)" },
    { name: "H96", color: "rgb(255,128,0)" },
    { name: "H120", color: "rgb(0,0,102)" },
    { name: "H144", color: "rgb(0,255,0)" },
    { name: "H168", color: "rgb(153,20,8)" },
    { name: "H192", color: "rgb(0,255,255)" },
    { name: "H216", color: "rgb(255,0,255)" },
    { name: "H240", color: "rgb(178,178,178)" }
  ],
  matchTimeColor(time = 24) {
    let count = Math.ceil(time / 24) - 1;
    if (count === -1) count = 0; // 颜色下边界
    let colorLen = tcUtil.timeColor.length;
    if (count > colorLen - 1) count = colorLen - 1; //超过颜色上界
    return tcUtil.timeColor[count].color;
  },
  model: {
    ecmwf: {
      enNumber: 51,
      interval:6,
      timeRange() {
        return Array.from(new Array(40), (val, index) => index * 6);
      }
    },
    NCEP: {
      enNumber: 21,
      interval:6,
      timeRange() {
        return Array.from(new Array(40), (val, index) => index * 6);
      }
    },
    'TRAMS_TY': {
      enNumber: 30,
      interval:6,
      timeRange() {
        return Array.from(new Array(40), (val, index) => index * 6);
      }
    },
    "ncep-R":{
      enNumber: 21,
      interval:6,
      timeRange() {
        return Array.from(new Array(40), (val, index) => index * 6);
      }
    },
    "ukmo-R":{
      enNumber: 36,
      interval:6,
      timeRange() {
        return Array.from(new Array(40), (val, index) => index * 6);
      }
    },
    "ecmwf-R":{
      enNumber: 51,
      interval:6,
      timeRange() {
        return Array.from(new Array(40), (val, index) => index * 6);
      }
    },
    "fnmoc-R":{
      enNumber: 20,
      interval:6,
      timeRange() {
        return Array.from(new Array(40), (val, index) => index * 6);
      }
    },
    "cmc-R":{
      enNumber: 21,
      interval:6,
      timeRange() {
        return Array.from(new Array(40), (val, index) => index * 6);
      }
    },
    UKMO: {}
  }
};

/**
 * 按照强度填色
 */
async function d3Map(tcRaw) {
  let center = calCenter(tcRaw);
  let timeInterval = tcUtil.model[tcRaw.ins].interval;// 设置时间间隔
  center[1] += 5;
  // 清除全部
  d3.select("#map-container .map-svg").remove();
  // console.log('d3Map');
  let projection = await drawMap("#map-container",center);

  let baseMap = d3.select("#map-container .base-map");

  //定义地形路径生成器
  //projection.rotate([180,0,0]);
  let path = d3.geoPath().projection(projection);

  // 地理路径
  // let tcRaw = await d3.json("/source/2019022414_Wutip_02WP_GEFS.json");
  let catArr = tcRaw.tracks
    .map(member => member.track)
    .map(track => {
      let twoPointLineArr = [];
      for (let i = 0; i < track.length - 1; i++) {
        let point0 = track[i][1];
        let point1 = track[i + 1][1];
        let nextWind = track[i + 1][3];
        let nextCat = tcUtil.wind2cat(nextWind);
        let nextColor = tcUtil.tcColor[nextCat];
        let time0 = track[i][0];
        let time1 = track[i+1][0];
        if(time1 - time0 > timeInterval) continue;
        const distance = Math.sqrt(Math.pow(point1[0]-point0[0],2) + Math.pow(point1[1]-point0[1],2));
        if(distance>9) continue; // 如果大于9个经纬度则断线
        twoPointLineArr.push({
          line: { type: "LineString", coordinates: [point0, point1] },
          nextCat,
          nextColor,
          curCat: tcUtil.wind2cat(track[i][3])
        });
      }
      return twoPointLineArr;
    })
    .flat();
  // console.log(catArr);
  let tcSvg = baseMap.append("g").attr("class", "tc-svg");
  tcSvg
    .selectAll("path")
    .data(catArr)
    .enter()
    .append("path")
    .attr("d", d => path(d.line))
    .attr("class", d => `track-line ${d.nextCat}`)
    // .style("stroke", d => d.nextColor)
    .style("stroke", d =>'gray')
    .attr("opacity", 0.9);

  let pointArr = tcRaw.tracks
    .map(member => member.track)
    .map(track =>
      track.map(point => {
        let cat = tcUtil.wind2cat(point[3]);
        return {
          point: point[1],
          project: projection(point[1]),
          color: tcUtil.tcColor[cat],
          cat
        };
      })
    )
    .flat();


  let pointSvg = baseMap.append("g");
  pointSvg.attr("class", "point-g");
  pointSvg
    .selectAll("circle")
    .data(pointArr)
    .enter()
    .append("circle")
    .attr("class", "point")
    .attr("cx", d => d.project[0])
    .attr("cy", d => d.project[1])
    .attr("r", 3)
    .attr("opacity", 0.8)
    .style("stroke", d => d.color)
    .style("stroke-width", 1)
    .style("fill", 'none')
    // .style("fill", d => d.color)
    // .on("mouseover", function() {
    //   console.log(this);
    //   d3.select(this).style("fill", () => "yellow");
    // });

// 确定性预报
  if(!tcRaw.detTrack||!tcRaw.detTrack.track) return;//不存在退出
  let detArr = (()=>{
      let track = tcRaw.detTrack.track
      let twoPointLineArr = [];
      for (let i = 0; i < track.length - 1; i++) {
        let point0 = track[i][1];
        let point1 = track[i + 1][1];
        let nextWind = track[i + 1][3];
        let nextCat = tcUtil.wind2cat(nextWind);
        let nextColor = tcUtil.tcColor[nextCat];
        let time0 = track[i][0];
        let time1 = track[i+1][0];
        if(time1 - time0 > timeInterval) continue;// 大于时间间隔跳过连线
        const distance = Math.sqrt(Math.pow(point1[0]-point0[0],2) + Math.pow(point1[1]-point0[1],2));
        if(distance>9) continue; // 如果大于9个经纬度则断线
        twoPointLineArr.push({
          line: { type: "LineString", coordinates: [point0, point1] },
          nextCat,
          nextColor,
          curCat: tcUtil.wind2cat(track[i][3])
        });
      }
      return twoPointLineArr;
    })();

  const detPoints = tcRaw.detTrack.track
    .map(point => {
      let cat = tcUtil.wind2cat(point[3]);
      return {
        point: point[1],
        project: projection(point[1]),
        color: tcUtil.tcColor[cat],
        cat
      };
    });

  const detTrackSvg = baseMap.append("g").attr("class", "tc-svg");
  detTrackSvg
    .selectAll("path")
    .data(detArr)
    .enter()
    .append("path")
    .attr("d", d => path(d.line))
    .attr("class", d => `track-line-det ${d.nextCat}`)
    .style("stroke", d => d.nextColor);
  
  const detPointSvg = baseMap.append("g");
  detPointSvg.attr("class", "point-g");
  detPointSvg
    .selectAll("circle")
    .data(detPoints)
    .enter()
    .append("circle")
    .attr("class", "point")
    .attr("cx", d => d.project[0])
    .attr("cy", d => d.project[1])
    .attr("r", 3.5)
    .style("fill", d => d.color)
    .style("stroke", d => d.color)
    .style("stroke-width", 1.0)

    return projection;
}


/**
 * 按照时间填色
 */
async function d3Map2(tcRaw) {
  let center = calCenter(tcRaw);
  let timeInterval = tcUtil.model[tcRaw.ins].interval;
  center[1] += 5;
  // 清除全部
  d3.select("#map-container2 .map-svg").remove();
  let projection = await drawMap("#map-container2",center);

  let baseMap = d3.select("#map-container2 .base-map");

  //定义地形路径生成器
  let path = d3.geoPath().projection(projection);

  // 地理路径
  let catArr = tcRaw.tracks
    .map(member => member.track)
    .map(track => {
      let twoPointLineArr = [];
      for (let i = 0; i < track.length - 1; i++) {
        let point0 = track[i][1];
        let point1 = track[i + 1][1];
        let point1Step = track[i + 1][0];
        let nextWind = track[i + 1][3];
        let nextCat = tcUtil.wind2cat(nextWind);
        let nextColor = tcUtil.tcColor[nextCat];
        let timeColor = tcUtil.matchTimeColor(point1Step);
        let time0 = track[i][0];
        let time1 = track[i+1][0];
        if(time1 - time0 > timeInterval) continue; // 如果有跳点则断线
        const distance = Math.sqrt(Math.pow(point1[0]-point0[0],2) + Math.pow(point1[1]-point0[1],2));
        if(distance>9) continue; // 如果大于指定个经纬度则断线
        twoPointLineArr.push({
          line: { type: "LineString", coordinates: [point0, point1] },
          nextCat,
          nextColor,
          timeColor,
          curCat: tcUtil.wind2cat(track[i][3])
        });
      }
      return twoPointLineArr;
    })
    .flat();
  // console.log(catArr);
  let tcSvg = baseMap.append("g").attr("class", "tc-svg");
  tcSvg
    .selectAll("path")
    .data(catArr)
    .enter()
    .append("path")
    .attr("d", d => path(d.line))
    .attr("class", d => `track-line ${d.nextCat}`)
    .style("stroke", d => d.timeColor);

  let pointArr = tcRaw.tracks
    .map(member => member.track)
    .map(track =>
      track.map(point => {
        let cat = tcUtil.wind2cat(point[3]);
        let step = point[0];
        let timeColor = tcUtil.matchTimeColor(step);
        return {
          point: point[1],
          project: projection(point[1]),
          color: tcUtil.tcColor[cat],
          timeColor,
          step,
          cat
        };
      })
    )
    .flat();

  let pointSvg = baseMap.append("g");
  pointSvg.attr("class", "point-g");
  pointSvg
    .selectAll("circle")
    .data(pointArr)
    .enter()
    .append("circle")
    .attr("class", "point")
    .attr("cx", d => d.project[0])
    .attr("cy", d => d.project[1])
    .attr("r", 1.5)
    .style("fill", d => d.timeColor);
// TODO tcRaw.detTrack is undefined
  // 确定性预报
  if(!tcRaw.detTrack||!tcRaw.detTrack.track) return;
  let detArr = (()=>{
      let track = tcRaw.detTrack.track
      let twoPointLineArr = [];
      for (let i = 0; i < track.length - 1; i++) {
        let point0 = track[i][1];
        let point1 = track[i + 1][1];
        let nextWind = track[i + 1][3];
        let nextCat = tcUtil.wind2cat(nextWind);
        let nextColor = tcUtil.tcColor[nextCat];
        let time0 = track[i][0];
        let time1 = track[i+1][0];
        let point1Step = track[i + 1][0];
        let timeColor = tcUtil.matchTimeColor(point1Step);
        if(time1 - time0 > timeInterval) continue;
        const distance = Math.sqrt(Math.pow(point1[0]-point0[0],2) + Math.pow(point1[1]-point0[1],2));
        if(distance>9) continue; // 如果大于指定个经纬度则断线
        twoPointLineArr.push({
          line: { type: "LineString", coordinates: [point0, point1] },
          nextCat,
          nextColor,
          curCat: tcUtil.wind2cat(track[i][3]),
          timeColor
        });
      }
      return twoPointLineArr;
    })();

  const detPoints = tcRaw.detTrack.track
    .map(point => {
      let cat = tcUtil.wind2cat(point[3]);
      let step = point[0];
      let timeColor = tcUtil.matchTimeColor(step);
      return {
        point: point[1],
        project: projection(point[1]),
        color: tcUtil.tcColor[cat],
        cat,
        timeColor
      };
    });

  const detTrackSvg = baseMap.append("g").attr("class", "tc-svg");
  detTrackSvg
    .selectAll("path")
    .data(detArr)
    .enter()
    .append("path")
    .attr("d", d => path(d.line))
    .attr("class", d => `track-line-det ${d.nextCat}`)
    .style("stroke", d => d.timeColor);
  
  const detPointSvg = baseMap.append("g");
  detPointSvg.attr("class", "point-g");
  detPointSvg
    .selectAll("circle")
    .data(detPoints)
    .enter()
    .append("circle")
    .attr("class", "point")
    .attr("cx", d => d.project[0])
    .attr("cy", d => d.project[1])
    .attr("r", 3.5)
    .style("fill", d => d.timeColor)
}

/**
 * 绘制地图底图
 */
async function drawMap(container = "#map-container2",center=[140,21],geoMap) {
  //请求china.geojson
  // console.log('drawMap');
  if(!geoMap){// 没有参数则尝试加载util中的地图
    if(tcUtil.geoMap){
      geoMap = tcUtil.geoMap;
    }else{// 都没有地图则自行加载
      let worldTopo = await d3.json("/source/110m.json")
      geoMap = topojson.feature(worldTopo, worldTopo.objects.land).features;
    } 
  }
  //let root = await d3.json("http://localhost:8080/source/china.geojson");

  // let width = 700,
  //   height = 450;
  // 计算地图宽度和高度
  let containerDom = document.querySelector(container);
  let width = containerDom.offsetWidth,
      height = containerDom.offsetHeight;
  var mapSvg = d3
    .select(container)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "map-svg");
  // console.log(container,center);
  
  let newCenter = [center[0]-180, center[1]];
  if(newCenter[0]<-180) newCenter[0] += 360;
  //定义地图的投影
  // console.log(center,newCenter);
  const projection = d3
    .geoMercator()
    .scale(800)
    .translate([width / 2, height / 2])
    .rotate([180,0,0])
    .center([newCenter[0], newCenter[1]]);

  //定义地形路径生成器
  let path = d3.geoPath().projection(projection);
  // 经纬网格
  // let eps = 1e-4;
  // console.log(worldGeo);
  let baseMap = mapSvg.append("g").attr("class", "base-map");

  // 放大缩小
  let zoom = d3
    .zoom()
    .scaleExtent([0.5, 9])
    .on("zoom", zoomed);

  mapSvg
    .append("rect")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height);

  mapSvg.call(zoom);

  baseMap
    .append("g")
    .attr("class", "world-map")
    .selectAll("path")
    .data(geoMap)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("class", "graticule");
  /// worldGeo

  let graticule = d3
    .geoGraticule()
    .extent([[-180, -80], [180, 80]])
    .step([10, 5]);

  let grid = graticule();
  // console.log(grid);

  baseMap //let gridSvg =
    .append("path")
    .datum(grid)
    .attr("class", "graticule")
    .attr("d", path);
  
  
  function zoomed() {
    // console.log(d3.event.transform);
    var scale = d3.event.transform.k;
    console.log(scale);
    baseMap.attr("transform", d3.event.transform);
    baseMap.selectAll('circle')
      .attr("r", 3.5*1/scale);
    baseMap.selectAll('.track-line')
      .style("stroke-width", 1/scale);
      
  }
// TODO latlon error
// var transform = d3.event.transform
// transform.x = <width> * (1 - transform.k) / 2 // To keep center fixed.
// transform.y = <height> * (1 - transform.k) / 2 // To keep center fixed.
// var x = (d3.mouse(this)[0] - transform.x) / transform.k
// var y = (d3.mouse(this)[1] - transform.y) / transform.k
// var p = projection.invert([x, y])
  let latlonContainer = d3.select(`.${container.replace('#','')} .lonlat`);
  mapSvg.on("mousemove",function(){
    var transform = d3.zoomTransform(this);
    var xy = transform.invert(d3.mouse(this));
    let lonlat = projection.invert(xy);
    latlonContainer.select('.lon').text(lonlat[0].toFixed(2));
    latlonContainer.select('.lat').text(lonlat[1].toFixed(2));
    // console.log(projection.invert(d3.mouse(this)));
  })
  return projection;
}

async function drawPlotyBox(tcRaw, ins = "NCEP") {
  // let tcRaw = await d3.json("/source/2019022414_Wutip_02WP_GEFS.json");
  // ins = ins.replace('-','_');
  let tracks = tcRaw.tracks;
  // console.log(tcUtil.model);
  let timeRange = tcUtil.model[ins].timeRange(); //生成等差序列
  let initTime = moment(tcRaw.initTime);
  let traceArr = [];
  for (let step of timeRange) {
    let currentTimePoint = tracks
      .map(member => {
        let point = member.track.find(v => v[0] == step);
        return { point, ensembleNumber: member.ensembleNumber };
      })
      .filter(member => member.point); //去除空值
    let iTime = step2time(initTime,step);
    traceArr.push({
      timeStep: moment(iTime).format('DD日HH时'),
      wind: currentTimePoint.map(member => member.point[3]),
      meanWind: d3.mean(currentTimePoint.map(member => member.point[3])),
      pressure: currentTimePoint.map(member => member.point[2]),
      meanPressure: d3.mean(currentTimePoint.map(member => member.point[2]))
    });
  }
  let windData = traceArr.map(trace => {
    return {
      y: trace.wind,
      type: "box",
      name: trace.timeStep,
      marker: { color: "rgb(214,12,140)" }
    };
  });

  let meanWind = {
    x: traceArr.map(trace => trace.timeStep),
    y: traceArr.map(trace => trace.meanWind),
    type: "lines",
    name: "mean"
  };
  let windLayout = {
    title: "中心附近最大风力箱线图",
    yaxis: {
      title: "wind m/s",
      zeroline: false,
      showline: true,
      showticklabels: true,
      linecolor: "rgb(204,204,204)",
      linewidth: 2,
      ticks: "outside",
      tickcolor: "rgb(204,204,204)",
      tickwidth: 2,
      ticklen: 5
    },
    showlegend: false,
    margin: {
      l: 60,
      r: 20,
      t: 40,
      b: 40
    },
    xaxis: {
      showgrid: true,
      showline: true,
      showticklabels: true,
      linecolor: "rgb(204,204,204)",
      linewidth: 2,
      // autotick: false,
      ticks: "outside",
      tickcolor: "rgb(204,204,204)",
      tickwidth: 2,
      ticklen: 5,
      tickmode: "linear",
      dtick: 4,
    },
    height: 320
  };
  Plotly.newPlot("box-wind", [...windData, meanWind], windLayout, {
    displayModeBar: false
  });

  let pressureData = traceArr.map(trace => {
    return {
      y: trace.pressure,
      type: "box",
      name: trace.timeStep,
      marker: { color: "rgb(0,128,128)" }
    };
  });
  let meanPressure = {
    x: traceArr.map(trace => trace.timeStep),
    y: traceArr.map(trace => trace.meanPressure),
    type: "lines",
    line: {
      color: "rgb(55, 128, 191)",
      // width: 1,
      dash: "dot"
    },
    name: "mean"
  };
  let pressureLayout = {
    title: "中心气压箱线图",
    yaxis: {
      title: "pressure hPa",
      zeroline: false,
      showline: true,
      showticklabels: true,
      linecolor: "rgb(204,204,204)",
      linewidth: 2,
      ticks: "outside",
      tickcolor: "rgb(204,204,204)",
      tickwidth: 2,
      ticklen: 5
    },
    xaxis: {
      showgrid: true,
      showline: true,
      showticklabels: true,
      linecolor: "rgb(204,204,204)",
      linewidth: 2,
      // autotick: false,
      ticks: "outside",
      tickcolor: "rgb(204,204,204)",
      tickwidth: 2,
      ticklen: 5,
      tickmode: "linear",
      dtick: 4,
    },
    showlegend: false,
    margin: {
      l: 60,
      r: 20,
      t: 40,
      b: 40
    },
    height: 320
  };
  Plotly.newPlot(
    "box-pressure",
    [...pressureData, meanPressure],
    pressureLayout,
    { displayModeBar: false }
  );

  var stackLayout = {
    barmode: "stack",
    height: 300,
    margin: {
      l: 60,
      r: 20,
      t: 40,
      b: 0
    },
    xaxis: {
      showgrid: true,
      showline: true,
      showticklabels: true,
      linecolor: "rgb(204,204,204)",
      linewidth: 2,
      ticks: "outside",
      tickcolor: "rgb(204,204,204)",
      tickwidth: 2,
      ticklen: 5,
      tickmode: "linear",
      dtick: 4,
      side:"top",
    },
    // title: '',
    yaxis: {
      title: "强度分类 / 成员数",
      showline: true,
      showticklabels: true,
      linecolor: "rgb(204,204,204)",
      linewidth: 2,
      ticks: "outside",
      tickcolor: "rgb(204,204,204)",
      tickwidth: 2,
      ticklen: 5,
      range: [0, tcUtil.model[ins].enNumber] //范围为集合成员数
    },
    legend: {
      orientation: "h",
      // yanchor: "top",
      y: 0,
    }
  };

  let stackArr = [];
  for (let step of timeRange) {
    let currentTimePoint = tracks
      .map(member => {
        let point = member.track.find(v => v[0] == step);
        return { point, ensembleNumber: member.ensembleNumber };
      })
      .filter(member => member.point); //去除空值

    let [LOW, TD, TS, STS, TY, STY, SuperTY] = [0, 0, 0, 0, 0, 0, 0];
    for (let member of currentTimePoint) {
      let wind = member.point[3];
      if (wind < 10.8) {
        LOW += 1;
      }
      else if (wind >= 10.8 && wind < 17.2) {
        TD += 1;
      } else if (wind >= 17.2 && wind < 24.5) {
        TS += 1;
      } else if (wind >= 24.5 && wind < 32.7) {
        STS += 1;
      } else if (wind >= 32.7 && wind < 41.5) {
        TY += 1;
      } else if (wind >= 41.5 && wind < 51.0) {
        STY += 1;
      } else if (wind >= 51.0) {
        SuperTY += 1;
      }
    };
    let iTime = step2time(initTime,step);
    stackArr.push({
      time: moment(iTime).format('DD日HH时'),//step,
      LOW,
      TD,
      TS,
      STS,
      TY,
      STY,
      SuperTY
    });
  }
  let tcColor = {
    SuperTY: "rgb(128,0,255)",
    STY: "rgb(153,20,8)",
    TY: "rgb(255,0,0)",
    STS: "rgb(255,128,0)",
    TS: "rgb(0,0,255)",
    TD: "rgb(105,163,74)",
    LOW: "rgb(144,144,145)",
  };
  let stackData = ["SuperTY", "STY", "TY", "STS", "TS", "TD", "LOW"].map(type => {
    return {
      x: stackArr.map(tc => tc.time),
      y: stackArr.map(tc => tc[type]),
      name: type,
      type: "bar",
      marker: {
        color: tcColor[type]
      }
    };
  });

  Plotly.newPlot("stacked-cat", stackData, stackLayout,
    { displayModeBar: false });
}

/**
 * 计算中心
 */
function calCenter(tcRaw){
  let allPoint = tcRaw.tracks
    .map(member => member.track)
    .map(track =>track
      .map(point =>point[1])
    )
    .flat();
  let meanLon = d3.mean(allPoint.map(loc=>loc[0]));
  let meanLat = d3.mean(allPoint.map(loc=>loc[1]));
  return [meanLon, meanLat];
}

function step2time(initTime, step){
  return moment(initTime).add(step,'hours').toDate();
}

async function d3MapOverview(multiTC) {
  // let center = calCenter(tcRaw);
  // center[1] += 5;
  // 清除全部
  // console.log(multiTC);
  // multiTC = [multiTC[0]];
  d3.select("#map-container3 .map-svg").remove();
  let timeInterval = tcUtil.model[multiTC[0].ins].interval;
  let projection = await drawMap("#map-container3");

  let baseMap = d3.select("#map-container3 .base-map");
  // let width = 700,
  //   height = 450;

  //定义地图的投影
  // const projection = d3
  //   .geoMercator()
  //   .center([center[0], center[1]])
  //   .scale(800)
  //   .translate([width / 2, height / 2]);

  //定义地形路径生成器
  //projection.rotate([180,0,0]);
  let path = d3.geoPath().projection(projection);

  // 地理路径
  // let tcRaw = await d3.json("/source/2019022414_Wutip_02WP_GEFS.json");
  let allCatArr = new Array();
  for(let iTc=0; iTc<multiTC.length; iTc++){
    let tcRaw = multiTC[iTc];
    let catArr = tcRaw.tracks
      .map(member => member.track)
      .map(track => {
        let twoPointLineArr = [];
        for (let i = 0; i < track.length - 1; i++) {
          let point0 = track[i][1];
          let point1 = track[i + 1][1];
          let nextWind = track[i + 1][3];
          let nextCat = tcUtil.wind2cat(nextWind);
          let nextColor = tcUtil.tcColor[nextCat];
          let time0 = track[i][0];
          let time1 = track[i+1][0];
          if(time1 - time0 > timeInterval) continue;
          const distance = Math.sqrt(Math.pow(point1[0]-point0[0],2) + Math.pow(point1[1]-point0[1],2));
          if(distance>9) continue; // 如果大于9个经纬度则断线
          twoPointLineArr.push({
            line: { type: "LineString", coordinates: [point0, point1] },
            nextCat,
            nextColor,
            curCat: tcUtil.wind2cat(track[i][3])
          });
        }
        return twoPointLineArr;
      })
      .flat();
      // console.log(catArr);
    allCatArr.push(catArr);
  }

  allCatArr = allCatArr.flat();
  // console.log(allCatArr);
  let tcSvg = baseMap.append("g").attr("class", "tc-svg");
  tcSvg
    .selectAll("path")
    .data(allCatArr)
    .enter()
    .append("path")
    .attr("d", d => path(d.line))
    .attr("class", d => `track-line ${d.nextCat}`)
    .style("stroke", d => d.nextColor)
        // .attr("opacity", 0.9)
/*
  let allPointArr = new Array();
  for(let iTc=0; iTc<multiTC.length; iTc++){
    let tcRaw = multiTC[iTc];
    let pointArr = tcRaw.tracks
      .map(member => member.track)
      .map(track =>
        track.map(point => {
          let cat = tcUtil.wind2cat(point[3]);
          return {
            point: point[1],
            project: projection(point[1]),
            color: tcUtil.tcColor[cat],
            cat
          };
        })
      )
      .flat();
    // console.log(pointArr);
    allPointArr = allPointArr.concat(pointArr);
  }
  // console.log(allPointArr);

  let pointSvg = baseMap.append("g");
  pointSvg.attr("class", "point-g");
  pointSvg
    .selectAll("circle")
    .data(allPointArr)
    .enter()
    .append("circle")
    .attr("class", "point")
    .attr("cx", d => d.project[0])
    .attr("cy", d => d.project[1])
    .attr("r", 3)
    .attr("opacity", 0.8)
    .style("stroke", d => d.color)
    .style("stroke-width", 1.0)
    .style("fill", 'none');
*/
// 确定性预报
  let allDetCatArr = new Array();
  for(let iTc=0; iTc<multiTC.length; iTc++){
    let tcRaw = multiTC[iTc];
    if(!tcRaw.detTrack||!tcRaw.detTrack.track) continue;//不存在退出
    let detArr = (()=>{
      let track = tcRaw.detTrack.track
      let twoPointLineArr = [];
      for (let i = 0; i < track.length - 1; i++) {
        let point0 = track[i][1];
        let point1 = track[i + 1][1];
        let nextWind = track[i + 1][3];
        let nextCat = tcUtil.wind2cat(nextWind);
        let nextColor = tcUtil.tcColor[nextCat];
        let time0 = track[i][0];
        let time1 = track[i+1][0];
        if(time1 - time0 > timeInterval) continue;// 大于时间间隔跳过连线
        const distance = Math.sqrt(Math.pow(point1[0]-point0[0],2) + Math.pow(point1[1]-point0[1],2));
        if(distance>9) continue; // 如果大于9个经纬度则断线
        twoPointLineArr.push({
          line: { type: "LineString", coordinates: [point0, point1] },
          nextCat,
          nextColor,
          curCat: tcUtil.wind2cat(track[i][3])
        });
      }
      return twoPointLineArr;
    })();
    allDetCatArr.push(detArr);
  }
  allDetCatArr = allDetCatArr.flat();

  let allDetPointArr = new Array();
  for(let iTc=0; iTc<multiTC.length; iTc++){
    let tcRaw = multiTC[iTc];
    if(!tcRaw.detTrack||!tcRaw.detTrack.track) continue;//不存在退出
    const detPoints = tcRaw.detTrack.track
      .map(point => {
        let cat = tcUtil.wind2cat(point[3]);
        return {
          point: point[1],
          project: projection(point[1]),
          color: tcUtil.tcColor[cat],
          cat
        };
      });
    allDetPointArr = allDetPointArr.concat(detPoints);
  }

  const detTrackSvg = baseMap.append("g").attr("class", "tc-svg");
  detTrackSvg
    .selectAll("path")
    .data(allDetCatArr)
    .enter()
    .append("path")
    .attr("d", d => path(d.line))
    .attr("class", d => `track-line-det ${d.nextCat}`)
    .style("stroke", d => d.nextColor);
  
  const detPointSvg = baseMap.append("g");
  detPointSvg.attr("class", "point-g");
  detPointSvg
    .selectAll("circle")
    .data(allDetPointArr)
    .enter()
    .append("circle")
    .attr("class", "point")
    .attr("cx", d => d.project[0])
    .attr("cy", d => d.project[1])
    .attr("r", 3)
    .style("fill", d => d.color)
    // .style("stroke", d => d.color)
    // .style("stroke-width", 1.0)

  return projection;
}

export default {
  name: "d3-tc-ens",
  data() {
    let now = moment(new Date());
    let endTime = now.format('YYYY-MM-DD');
    let startTime = moment(now).subtract(1,'days').format('YYYY-MM-DD');
    return {
      tcOpenPanel: "1",
      allTC:[],
      hitCityList2:[
        {lon:1,name:123},
        {lon:2,name:122}
      ],
      currentTCcard:'singleTC',
      selectedTC:null,
      // overViewTC:null,
      selectedInsIndex: [-1, -1],
      selectedDateModelList:[],
      selectedOverView:[null,null],
      timeRange:[startTime, endTime],
      selectedTimeIndex: -1,
      selectedBasin: 'WPAC',
      selectedModel: ['ecmwf','ncep-R','ukmo-R','fnmoc-R','cmc-R'],
      tcMeta:tcUtil.model,
      cityInfo:cityInfo,
      basinList:[
        {
          value:'global',
          label:'全球'
        },
        {
          value:'WPAC',
          label:'西北太平洋'
        },
      ],
      modelListOffice:[
        {value:'ecmwf',label:'ECMWF'},
        {value:'TRAMS_TY',label:'华南台风模式'},
        {value:'NCEP',label:'NCEP'},
      ],
      modelListRuc:[
        {value:'ncep-R',label:'NCEP-R'},
        {value:'ecmwf-R',label:'ECMWF-R'},
        {value:'ukmo-R',label:'UKMO'},
        {value:'fnmoc-R',label:'FNMOC'},
        {value:'cmc-R',label:'CMC'},
      ],
      modelListEmc:[
        {value:'ncep-N',label:'NCEP-EMC'},
      ],
      tcFilter:'all',
    };
  },
  mounted() {
    this.timeChange(this.timeRange);
    d3.json("/source/110m.json")
      .then(worldTopo=>{
        let worldGeo = topojson.feature(worldTopo, worldTopo.objects.land);
        tcUtil.geoMap = tcUtil.geoMap.concat(worldGeo.features);
      });
      
    d3.json("/source/bou2_4l.topo.simplify.json")
      .then(chinaTopo=>{
        let chinaGeo = topojson.feature(chinaTopo, chinaTopo.objects.bou2_4l);
        tcUtil.geoMap = tcUtil.geoMap.concat(chinaGeo.features);
        // console.log(chinaGeo);
      });
  // console.log(worldTopo);
  
  },
  methods: {
    setBoxPlot() {
      drawPlotyBox().catch(err => {
        console.error(err);
        throw err;
      });
    },
    timeChange(date) {
      // console.log(date);
      this.timeRange[0] = date[0];
      this.timeRange[1] = date[1];
      return this.searchTC();
    },
    searchTC(){
      let sTime = this.timeRange[0] + ' 00:00';
      let eTime = this.timeRange[1] + ' 23:59';
      return this.getTC([sTime, eTime]);
    },
    showTC(tcRaw){
      this.currentTCcard = 'singleTC';
      this.selectedTC = tcRaw;
      this.$nextTick(()=>{
        d3Map2(tcRaw);
        drawPlotyBox(tcRaw,tcRaw.ins);
        d3Map(tcRaw);
        this.jump('.tc-tabs-card', 75);
      });
      // d3OverViewMap(tcRaw);
    },
    showAllTC(insMultiTC){
      let multiTC = insMultiTC.tc;
      this.currentTCcard = 'overviewTC';
      this.selectedInsIndex = [this.selectedTimeIndex, insMultiTC.ins];
      this.$nextTick(
        ()=>{
          d3MapOverview(multiTC);
          this.jump('.tc-tabs-card', 50);
        }
        
      );
      
    },
    getTC(times=['20190407 00:00','2019-04-08 23:59']) {
        //.get("/source/2019032400_21S_VERONICA_ECEP.json")
      this.$Message.info('正在查询数据...');
      axios
        .get(`/api?interface=tc-ens&gt=${times[0]}&lt=${times[1]}&dateFormat=YYYY-MM-DD HH:mm&ins=${this.selectedModel.join(',')}&basin=${this.selectedBasin}&spe=${this.tcFilter}`)
        .then(response => {
          let raw = response.data;
          // console.log(raw);
          if(!raw.success) throw new Error(raw);
          let tcArr = raw.data;

          if(tcArr.length){
            // this.tcList = tcList;
            this.$Message.info('查询完成...');
            this.allTC = this.catTC(tcArr);
            this.selectedTimeIndex = this.allTC.length - 1;
            if(this.allTC.length){// 显示最新的TC概览
              let leastTimeTC = this.allTC[this.allTC.length - 1].ins;
              let ecLeastTimeTC = leastTimeTC.filter(ins=>ins.ins==='ecmwf');
              if(ecLeastTimeTC.length){
                this.showAllTC(ecLeastTimeTC[0]);
              }  
            }
          }else{
            this.$Notice.info({
              title: 'Empty',
              desc:'所选条件没有数据',
            });
          }

        })
        .catch((error)=> {
          this.$Notice.error({
              title: '查询TC出错',
              desc:error.message,
          });
          console.error(error);
        });
    },
    catTC(tcArr=[]){
      let timeSet = new Set(tcArr.map(tc=>tc.initTime)); //选出日期并去重
      let insSet = new Set(tcArr.map(tc=>tc.ins));
      let tcAll = []
      for(let iTime of timeSet){
        let timeWrap = {time:iTime,ins:[]};
        let sameTime = tcArr.filter(tc=>tc.initTime == iTime);
        for(let iIns of insSet){
          let insWrap = {ins:iIns,tc:[]}
          let sameIns = sameTime.filter(tc=>tc.ins == iIns);
          sameIns.sort((tc0, tc1)=>{
            let number0 = tc0.cycloneNumber;
            let number1 = tc1.cycloneNumber;
            if(number0[0] =='9') number0 = '6' + number0;
            if(number1[0] =='9') number1 = '6' + number1;
            if(number0<number1){
              return -1;
            }else{
              return 1;
            }
          });
          insWrap.tc = sameIns;
          timeWrap.ins.push(insWrap);
        }
        tcAll.push(timeWrap);
      }
      // console.log(tcAll);
      return tcAll;
      // this.tcOpenPanel = String(this.allTC.length);
    },
    switchTimeTable(i){
      this.selectedTimeIndex = i;
      // this.selectedInsIndex[0] = selectedTimeIndex;
    },
    showTCName(tc){
      let fullName = '';
      if(tc.cycloneName === tc.cycloneNumber){
        fullName += tc.cycloneName
      }else{
        fullName += tc.cycloneName + '-' + tc.cycloneNumber
      }
      let basin = tc.basinShort||tc.basinShort2;
      // console.log(fullName, )
      if(!tc.cycloneNumber.includes(basin)){
        fullName += ` ${basin}`;
      }
      return fullName;
    },
    jump(selector, offset = 0){
      let jump = document.querySelector(selector);
      let total = jump.offsetTop + offset;
      // console.log(total);
      document.documentElement.scrollTop = total;
    }
  },
  computed: {
    hitCityList(){
      if(!this.selectedTC) return;
      let info = this.cityInfo;
      // return cityInfo;
      let pointList = info.map(city=>{
        return {x:city.lon, y:city.lat}; 
      });

      let probilityList = pointList.map(point=>{
        return calTChitProbility(point, this.selectedTC.tracks, this.tcMeta[this.selectedTC.ins].enNumber)
      });
      // console.log(probilityList);
      info.forEach((city,i)=>{
        let iP = probilityList[i];
        city.hit = iP * 100;
        if(iP>0.75){
          city.color = 'rgb(199,50,104)';
        }else if(iP>=0.5){
          city.color = 'rgb(253,91,91)';
        }else if(iP>=0.25){
          city.color = 'rgb(253,253,104)';
        }else if(iP>=0.1){
          city.color = 'rgb(186,253,186)';
        }else{
          city.color = 'white';
        }
      });
      info = info
        .filter(city=>city.hit>0)
        .sort((pre, next)=>next.hit - pre.hit);
      return info;
    },
    timeLegend(){
      let legend = [
        '24h',
        '48h',
        '72h',
        '96h',
        '120h',
        '144h',
        '168h',
        '192h',
        '216h',
        '240h',
      ];
      
      if(this.selectedTC){
        let initTime = moment(this.selectedTC.initTime);
        let timeArr = Array.from(new Array(10), (val, index) => moment(initTime).add((index+1)*24,'hours').format('DD日HH时'));
        legend = timeArr;
      }
      return legend;
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
#app {
  display: flex;
  justify-content: center;
  align-items: left;
  flex-direction: column;
}
.cyc-main {
  display: flex;
  justify-content: center;
  align-items: center;
}

#map-overview{
  height: 700px;
  width: 90%;
  border: 1px solid black;
}

.map-div{
  display: flex;
  flex-wrap: wrap;
}

#map-container,
#map-container2,
#stacked-Bar,
#box-plot {
  height: 450px;
  width: 700px;
  border: 1px solid black;
}
#map-container3{
  height: 80vh;
  width: 80vw;
  border: 1px solid black;
}
.typhoon-info{
  width: 230px;
}

.route {
  stroke: black;
  stroke-width: 3px;
  fill: none;
}
svg circle {
  fill: blue;
}

.graticule {
  fill: none;
  stroke: #333;
  stroke-width: 1px;
}

.track-line {
  fill: none;
  stroke: #333;
  stroke-width: 1px;
}
.track-line-det{
  fill: none;
  stroke: #333;
  stroke-width: 3px;
}

.overlay {
  fill: none;
  /*pointer-events: all;*/
}
.point-g circle {
  cursor: pointer;
}
.g-gtitle {
  transform: translateY(40px);
}
.legend {
  display: flex;
  text-align: center;
  position: absolute;
  top:0px;
}
.legend div {
  min-width: 40px;
  margin: 0px 1px 0px 1px;
  padding: 0px 2px 0px 2px;
  color: white;
}
.legend.hour div {
  border: solid 1px;
  font-weight: bold;
  background-color: white;
  font-size: 14px;
}

.lonlat{
  position: absolute;
  bottom: 0px;
  background: white;
}
.lonlat > div {
    display: inline;
}
.relative-container{
  position: relative;
}
.time-row button, .tc-table button{
  margin: 0px 2px 0px 2px;
}
.tc-table .tc-ins {
    font-size: 20px;
    margin: 0px 8px 0px 2px;
    color: green;
}
.tc-table {
    background-color: rgb(240, 240, 250);
    border: solid green;
    padding: 3px;
    margin: 3px 2px;
}

/*袭击概率面板 */
.hit-pro-panel{
  width: 175px;
  max-height: 400px;
  overflow-y: auto;
}
.hit-pro-panel div{
  padding-left: 5px;
  padding-right: 5px;
  text-align: center;
}
.hit-pro-panel div span{
  color:white;
  mix-blend-mode: difference;
}
/*
#stacked-cat .hovertext > path{
    opacity:0.6;
}

.axistext {
    z-index: 9999;
}*/

</style>
