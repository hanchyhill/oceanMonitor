<template>
  <div id="app">
    <div class="button-container">
      <DatePicker
        type="daterange"
        split-panels
        placeholder="Select date"
        style="width: 200px"
        @on-change="timeChange"
        :value="timeRange"
      ></DatePicker>
      <i-select disabled v-model="selectedBasin" style="width:100px">
        <i-option  v-for="item in basinList" :value="item.value" :key="item.value">
          {{ item.label }}
        </i-option>
      </i-select>
      <i-select disabled v-model="tcFilter" style="width:150px">
        <i-option  value="removeNoControl" >
          剔除无控制场
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
          <div v-for="ins in item.ins" :key="ins.ins">
            <span class="tc-ins">{{ins.ins}}</span>
            <i-button v-for="tc in ins.tc" @click="showTC(tc)" :key="tc.tcID"
            type="success">
              {{showTCName(tc)}}
            </i-button>
          </div>
        </div>
      </div>
    </div>
    <div class="cyc-main" v-show="selectedTC">
      <div class="map-div">
        <div class="relative-container">
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
        </div>
        <div class="relative-container">
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
        </div>
      </div>
      <div class="bar-div">
        <div id="stacked-cat"></div>
        <div id="box-wind"></div>
        <div id="box-pressure"></div>
      </div>
    </div>
  </div>
</template>
<script>
// import privateConfig from "./config/private.config.js";
import * as d3 from "d3";
const topojson = require("topojson-client");
import * as Plotly from "plotly.js/dist/plotly";
import Util from '../../libs/util';
const axios = Util.ajax;
import * as moment from "moment";

let tcUtil = {
  worldGeo: null,
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
      timeRange() {
        return Array.from(new Array(40), (val, index) => index * 6);
      }
    },
    NCEP: {
      enNumber: 21,
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
        if(time1 - time0 > 6) continue;
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
    .style("stroke", d => d.nextColor);

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
    .attr("r", 1.5)
    .style("fill", d => d.color)
    // .on("mouseover", function() {
    //   console.log(this);
    //   d3.select(this).style("fill", () => "yellow");
    // });

// 确定性预报
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
        if(time1 - time0 > 6) continue;
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
    .attr("class", d => `track-line ${d.nextCat}`)
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
    .attr("r", 1.5)
    .style("fill", d => d.color)

    return projection;
}

/**
 * 按照时间填色
 */
async function d3Map2(tcRaw) {
  let center = calCenter(tcRaw);
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
        if(time1 - time0 > 6) continue; // 如果有跳点则断线
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
    .style("fill", d => d.timeColor)
}

/**
 * 绘制地图底图
 */
async function drawMap(container = "#map-container2",center=[140,21],worldGeo) {
  //请求china.geojson
  // console.log('drawMap');
  if(!worldGeo){// 没有参数则尝试加载util中的地图
    if(tcUtil.worldGeo){
      worldGeo = tcUtil.worldGeo;
    }else{// 都没有地图则自行加载
      let worldTopo = await d3.json("/source/110m.json")
      worldGeo = topojson.feature(worldTopo, worldTopo.objects.land);
    } 
  }
  //let root = await d3.json("http://localhost:8080/source/china.geojson");

  let width = 700,
    height = 450;

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
    .data(worldGeo.features)
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
    baseMap.attr("transform", d3.event.transform);
  }
  return projection;
}

async function drawPlotyBox(tcRaw, ins = "NCEP") {
  // let tcRaw = await d3.json("/source/2019022414_Wutip_02WP_GEFS.json");
  let tracks = tcRaw.tracks;
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

    let [TD, TS, STS, TY, STY, SuperTY] = [0, 0, 0, 0, 0, 0];
    for (let member of currentTimePoint) {
      let wind = member.point[3];
      if (wind >= 10.8 && wind < 17.2) {
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
    }
    let iTime = step2time(initTime,step);
    stackArr.push({
      time: moment(iTime).format('DD日HH时'),//step,
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
    TD: "rgb(105,163,74)"
  };
  let stackData = ["SuperTY", "STY", "TY", "STS", "TS", "TD"].map(type => {
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
export default {
  name: "d3-demo",
  data() {
    let now = moment(new Date());
    let endTime = now.format('YYYY-MM-DD');
    let startTime = moment(now).subtract(3,'days').format('YYYY-MM-DD');
    return {
      tcOpenPanel: "1",
      allTC:[],
      selectedTC:null,
      timeRange:[startTime, endTime],
      selectedTimeIndex: -1,
      selectedBasin: 'global',
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
      tcFilter:'removeNoControl',
    };
  },
  mounted() {
    this.timeChange(this.timeRange);
    d3.json("/source/110m.json")
      .then(worldTopo=>{
        let worldGeo = topojson.feature(worldTopo, worldTopo.objects.land);
        tcUtil.worldGeo = worldGeo;
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
      let sTime = date[0] + ' 00:00';
      let eTime = date[1] + ' 23:59';
      this.getTC([sTime, eTime]);
    },
    showTC(tcRaw){
      this.selectedTC = tcRaw;
      d3Map2(tcRaw);
      drawPlotyBox(tcRaw,tcRaw.ins);
      d3Map(tcRaw);
    },
    getTC(times=['20190407 00:00','2019-04-08 23:59']) {
        //.get("/source/2019032400_21S_VERONICA_ECEP.json")
      this.$Message.info('正在查询数据...');
      axios
        .get(`/api?interface=tc-ens&gt=${times[0]}&lt=${times[1]}&dateFormat=YYYY-MM-DD HH:mm&ins=ecmwf,NCEP`)
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
          }else{
            this.$Notice.info({
              title: 'Empty',
              desc:'所选条件没有数据',
            });
          }
          // d3Map2(raw);
          // drawPlotyBox(raw, "ecmwf");
          // d3Map(raw);
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
    }
  },
  computed: {
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

#map-container,
#map-container2,
#stacked-Bar,
#box-plot {
  height: 450px;
  width: 700px;
  border: 1px solid black;
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
/*
#stacked-cat .hovertext > path{
    opacity:0.6;
}

.axistext {
    z-index: 9999;
}*/

</style>
