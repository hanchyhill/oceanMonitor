<template>
  <div id="app">
    <h2>热带气旋集合预报</h2>
    <div class="button-container">
      <Button @click="searchTC" type="primary" icon="ios-search"
        >检索TC集合预报</Button
      >
      选择日期<DatePicker
        type="daterange"
        split-panels
        placeholder="Select date"
        style="width: 200px"
        @on-change="timeChange"
        :value="timeRange"
      ></DatePicker>
      选择机构<i-select multiple v-model="selectedModel" style="width: 600px">
        <OptionGroup label="WMO数据源">
          <i-option
            v-for="item in modelListOffice"
            :value="item.value"
            :key="item.value"
          >
            {{ item.label }}
          </i-option>
        </OptionGroup>
        <OptionGroup label="RUC源">
          <i-option
            v-for="item in modelListRuc"
            :value="item.value"
            :key="item.value"
          >
            {{ item.label }}
          </i-option>
        </OptionGroup>
        <OptionGroup label="EMC源">
          <i-option
            v-for="item in modelListEmc"
            :value="item.value"
            :key="item.value"
          >
            {{ item.label }}
          </i-option>
        </OptionGroup>
      </i-select>
      选择海区<i-select v-model="selectedBasin" style="width: 100px">
        <i-option
          v-for="item in basinList"
          :value="item.value"
          :key="item.value"
        >
          {{ item.label }}
        </i-option>
      </i-select>
      筛选设置<i-select disabled v-model="tcFilter" style="width: 150px">
        <i-option value="removeEcNoControl"> 剔除EC冗余 </i-option>
        <i-option value="all"> 无筛选 </i-option>
      </i-select>
    </div>
    <div class="select-tc-wrap">
      <div class="time-row">
        <i-button
          v-for="(item, i) in allTC"
          :key="item.time"
          :ghost="i != selectedTimeIndex"
          @click="switchTimeTable(i)"
          type="success"
        >
          {{ item.time.slice(0, 13) }} UTC
        </i-button>
      </div>
      <div class="tc-table" v-if="allTC.length">
        <div
          class="tc-table-time-wrap"
          v-for="(item, i) in allTC"
          :key="item.time"
          v-show="i == selectedTimeIndex"
        >
          <div
            class="tc-table-ins-wrap"
            v-for="ins in item.ins"
            :key="ins.ins"
            v-show="ins.tc.length"
          >
            <span class="tc-ins">
              <i-button
                @click="showAllTC(ins)"
                :ghost="
                  i != selectedInsIndex[0] || ins.ins != selectedInsIndex[1]
                "
                type="primary"
              >
                {{ ins.ins }}
              </i-button>
            </span>
            <i-button
              v-for="(tc, indexTc) in ins.tc"
              @click="showTC(tc)"
              :key="tc.tcID + indexTc"
              type="success"
              :ghost="!selectedTC || tc.tcID != selectedTC.tcID"
            >
              {{ showTCName(tc) }}
            </i-button>
          </div>
        </div>
      </div>
    </div>
    <Tabs
      type="card"
      :animated="false"
      v-model="currentTCcard"
      class="tc-tabs-card"
    >
      <TabPane label="全局概览" name="overviewTC">
        <div
          class="overview-typhoon-info"
          v-if="selectedIns && selectedIns.tc[0]"
        >
          起报时间:
          {{
            selectedIns && selectedIns.tc[0]
              ? selectedIns.tc[0].initTime.slice(0, 13)
              : ""
          }}
          机构: {{ selectedIns ? selectedIns.ins : "" }}
          <Button type="info" @click="calAllTcHitCityList">计算袭击概率</Button>
        </div>
        <div class="map-div">
          <div class="typhoon-info" v-show="showAllTcHit">
            袭击概率:<br />
            <div class="hit-pro-panel">
              <div
                v-for="(cityA, indexA) in allTcHitCityList"
                :key="cityA.name + indexA"
                :style="{ backgroundColor: cityA.color, color: cityA.textColor }"
                @click="showAllTcHitProSeries(cityA)"
              >
                <span>{{ cityA.name }}: {{ cityA.hit.toFixed(1) }}%</span>
              </div>
            </div>
            <div class="hit-time-series-wrap" v-show="showAllHitTime">
              <div>
                <Button
                  icon="md-close"
                  type="error"
                  @click="showAllHitTime = false"
                  >关闭弹窗</Button
                ><span class="title">{{ AllHitTimeLocName }}</span>
              </div>
              <div id="alltc-hit-time-series"></div>
              <div class="annotation">
                说明:
                由于不同路径袭击时间不同，时序显示的最大袭击概率会小于总袭击概率
              </div>
            </div>
          </div>
          <div
            class="relative-container"
            v-show="selectedIns && selectedIns.tc[0]"
          >
            <div id="map-container3"></div>
            <div class="legend">
              <div style="background-color: rgb(85, 85, 79)">LOW</div>
              <div style="background-color: rgb(105, 163, 74)">TD</div>
              <div style="background-color: rgb(0, 0, 255)">TS</div>
              <div style="background-color: rgb(255, 128, 0)">STS</div>
              <div style="background-color: rgb(255, 0, 0)">TY</div>
              <div style="background-color: rgb(153, 20, 8)">STY</div>
              <div style="background-color: rgb(128, 0, 255)">SuperTY</div>
            </div>
          </div>
        </div>
      </TabPane>
      <TabPane label="TC详情" name="singleTC">
        <div v-show="selectedTC">
          <i-button
            :type="showEnsTrack ? 'success' : 'warning'"
            @click="triggerMapOpt('showEnsTrack')"
            >{{ showEnsTrack ? "隐藏集合路径" : "显示集合路径" }}</i-button
          >

          <i-button
            :type="showDetTrack ? 'success' : 'warning'"
            @click="triggerMapOpt('showDetTrack')"
            >{{ showDetTrack ? "隐藏确定性预报" : "显示确定性预报" }}</i-button
          >

          <i-button
            :type="showMeanTrack ? 'success' : 'warning'"
            @click="triggerMapOpt('showMeanTrack')"
            >{{ showMeanTrack ? "隐藏集合平均" : "显示集合平均" }}</i-button
          >

          <i-button
            :type="showKeyTimeNodes ? 'success' : 'warning'"
            @click="triggerMapOpt('showKeyTimeNodes')"
            >{{
              showKeyTimeNodes ? "隐藏关键时间节点" : "显示关键时间节点"
            }}</i-button
          >
          <span class="hit-pro-region-panel">
            <i-button
              :type="showHitPro ? 'success' : 'warning'"
              :ghost="showHitPro ? false : true"
              @click="triggerMapOpt('showHitPro')"
              >{{
                showHitPro ? "隐藏袭击概率填图" : "显示袭击概率填图"
              }}</i-button
            >
          </span>
          <span
            class="wind-radius-panel"
            v-show="selectedTC && tcMeta[selectedTC.ins] && tcMeta[selectedTC.ins].containWindRadius"
          >
            <template v-if="selectedTC && selectedTC.detTrack && selectedTC.detTrack.track">
              <i-button
                :type="showWindRadius ? 'success' : 'warning'"
                :ghost="showWindRadius ? false : true"
                @click="triggerMapOpt('showWindRadius')"
                >{{
                  showWindRadius ? "隐藏确定性预报风圈" : "显示确定性预报风圈"
                }}</i-button
              >
              风圈时间间隔<i-select
                :value="radiusTimeInterval"
                @on-change="(value) => triggerMapOpt('radiusTimeInterval', value)"
                style="width: 100px"
              >
                <i-option :value="6">6小时</i-option>
                <i-option :value="12">12小时</i-option>
                <i-option :value="24">24小时</i-option>
              </i-select>
            </template>

            <i-button
              :type="showWindPro ? 'success' : 'warning'"
              :ghost="showWindPro ? false : true"
              @click="triggerMapOpt('showWindPro')"
              >{{ showWindPro ? "隐藏大风概率" : "显示大风概率" }}</i-button
            >
            大风阈值<i-select
              :value="windProScale"
              @on-change="(value) => triggerMapOpt('windProScale', value)"
              style="width: 100px"
            >
              <i-option :value="18">8级风</i-option>
              <i-option :value="26">10级风</i-option>
              <i-option :value="33">12级风</i-option>
            </i-select>
          </span>
        </div>
        <div class="cyc-main" v-show="selectedTC">
          <div class="map-div">
            <div class="typhoon-info" v-if="selectedTC">
              当前台风：{{ selectedTC ? selectedTC.cycloneNumber : "" }}
              {{ selectedTC ? selectedTC.cycloneName : "" }}<br />
              起报时间: {{ selectedTC ? selectedTC.initTime.slice(0, 13) : ""
              }}<br />
              机构: {{ selectedTC ? selectedTC.ins : "" }}<br />
              追踪成员:{{ selectedTC.tracks.length }}/{{
                tcMeta[selectedTC.ins].enNumber
              }}
              <br />
              袭击概率:<br />
              <div class="hit-pro-panel">
                <div
                  v-for="(city, index) in hitCityList"
                  :key="city.name + index"
                  :style="{ backgroundColor: city.color, color: city.textColor }"
                  @click="showHitProSeries(city)"
                >
                  <span>{{ city.name }}: {{ city.hit.toFixed(1) }}%</span>
                </div>
              </div>
              <div class="hit-time-series-wrap" v-show="showHitTime">
                <div>
                  <Button
                    icon="md-close"
                    type="error"
                    @click="showHitTime = false"
                    >关闭弹窗</Button
                  ><span class="title">{{ hitTimeLocName }}</span>
                </div>
                <div id="hit-time-series"></div>
                <div class="annotation">
                  说明:
                  由于不同路径袭击时间不同，时序显示的最大袭击概率会小于总袭击概率
                </div>
              </div>
            </div>

            <div>
              <div class="relative-container map-container">
                <div id="map-container"></div>
                <div class="legend">
                  <div style="background-color: rgb(85, 85, 79)">LOW</div>
                  <div style="background-color: rgb(105, 163, 74)">TD</div>
                  <div style="background-color: rgb(0, 0, 255)">TS</div>
                  <div style="background-color: rgb(255, 128, 0)">STS</div>
                  <div style="background-color: rgb(255, 0, 0)">TY</div>
                  <div style="background-color: rgb(153, 20, 8)">STY</div>
                  <div style="background-color: rgb(128, 0, 255)">SuperTY</div>
                </div>
                <div
                  class="legend legend-wind-pro"
                  v-show="showWindPro || showHitPro"
                >
                  <div style="background-color: #10ac00">5%</div>
                  <div style="background-color: #b2da00">10%</div>
                  <div style="background-color: #e8c52a">30%</div>
                  <div style="background-color: #fca46f">50%</div>
                  <div style="background-color: #f06948">70%</div>
                  <div style="background-color: #ce2619">90%</div>
                </div>
                <div class="lonlat">
                  <div>Lon:<span class="lon"></span></div>
                  <div>Lat:<span class="lat"></span></div>
                </div>
              </div>
              <div class="relative-container map-container2">
                <div id="map-container2"></div>
                <div class="legend hour">
                  <div style="color: rgb(0, 0, 0)">{{ timeLegend[0] }}</div>
                  <div style="color: rgb(255, 0, 0)">{{ timeLegend[1] }}</div>
                  <div style="color: rgb(0, 140, 48)">{{ timeLegend[2] }}</div>
                  <div style="color: rgb(255, 128, 0)">{{ timeLegend[3] }}</div>
                  <div style="color: rgb(0, 0, 102)">{{ timeLegend[4] }}</div>
                  <div style="color: rgb(0, 255, 0)">{{ timeLegend[5] }}</div>
                  <div style="color: rgb(153, 20, 8)">{{ timeLegend[6] }}</div>
                  <div style="color: rgb(0, 255, 255)">{{ timeLegend[7] }}</div>
                  <div style="color: rgb(255, 0, 255)">{{ timeLegend[8] }}</div>
                  <div style="color: rgb(178, 178, 178)">
                    {{ timeLegend[9] }}
                  </div>
                  <div style="color: rgb(255, 192, 203)">{{ timeLegend[10] }}</div>
                  <div style="color: rgb(255, 215, 0)">{{ timeLegend[11] }}</div>
                  <div style="color: rgb(0, 128, 128)">{{ timeLegend[12] }}</div>
                  <div style="color: rgb(128, 0, 128)">{{ timeLegend[13] }}</div>
                  <div style="color: rgb(128, 128, 128)">{{ timeLegend[14] }}</div>
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
              <div class="box-plot-wrap">
                <div class="box-switch">
                  <i-button
                    type="primary"
                    size="small"
                    @click="showPressureBox = !showPressureBox"
                    >{{
                      showPressureBox ? "切换移速箱线图" : "切换中心气压箱线图"
                    }}</i-button
                  >
                </div>
                <div id="box-speed" v-show="!showPressureBox"></div>
                <div id="box-pressure" v-show="showPressureBox"></div>
              </div>
            </div>
          </div>
        </div>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
// TODO: 更改地图为更高分辨率
// TODO: 鼠标定经纬度防抖
// import privateConfig from "./config/private.config.js";
// TODO 跨越180经度时断线
import * as d3 from "d3";
const topojson = require("topojson-client");
import * as Plotly from "plotly.js/dist/plotly";
import Util from "../../libs/util";
import {
  calTChitProbility,
  calRegionTChitProbility,
  calPointHitProbilityTimeSeries,
} from "../../libs/util.js";
import { calWindContour } from "../../libs/calRadius.js";
const axios = Util.ajax;
import * as moment from "moment";
import cityInfo from "../../config/coastalCity.json";

// const interpolateTerrain = (t)=>{
//   const i0 = d3.interpolateHsvLong(d3.hsv(120, 1, 0.65), d3.hsv(60, 1, 0.90));
//   const i1 = d3.interpolateHsvLong(d3.hsv(60, 1, 0.90), d3.hsv(0, 0, 0.95));
//   return t => t < 0.5 ? i0(t * 2) : i1((t - 0.5) * 2);
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
    LOW: "rgb(85,85,79)",
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
    { name: "H240", color: "rgb(178,178,178)" },
    { name: "H264", color: "rgb(255,192,203)" },   // 粉色
    { name: "H288", color: "rgb(255,215,0)" },     // 金色
    { name: "H312", color: "rgb(0,128,128)" },     // 青色
    { name: "H336", color: "rgb(128,0,128)" },     // 紫色
    { name: "H360", color: "rgb(128,128,128)" },   // 灰色
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
      interval: 6,
      timeRange() {
        return Array.from(new Array(40), (val, index) => index * 6);
      },
      containWindRadius: true,
    },
    NCEP: {
      enNumber: 21,
      interval: 6,
      timeRange() {
        return Array.from(new Array(40), (val, index) => index * 6);
      },
    },
    TRAMS_TY: {
      enNumber: 30,
      interval: 6,
      timeRange() {
        return Array.from(new Array(40), (val, index) => index * 6);
      },
    },
    "ncep-R": {
      enNumber: 21,
      interval: 6,
      timeRange() {
        return Array.from(new Array(40), (val, index) => index * 6);
      },
    },
    "ukmo-R": {
      enNumber: 36,
      interval: 6,
      timeRange() {
        return Array.from(new Array(40), (val, index) => index * 6);
      },
    },
    "ecmwf-R": {
      enNumber: 51,
      interval: 6,
      timeRange() {
        return Array.from(new Array(40), (val, index) => index * 6);
      },
    },
    "fnv3": {
      enNumber: 51,
      interval: 6,
      timeRange() {
        return Array.from(new Array(60), (val, index) => index * 6); // 15天，360小时
      },
      containWindRadius: true,
    },
    "fnv3-gen": {
      enNumber: 50,
      interval: 6,
      timeRange() {
        return Array.from(new Array(60), (val, index) => index * 6); // 15天，360小时
      },
      containWindRadius: true,
    },
    "aifs-cai": {
      enNumber: 51,
      interval: 6,
      timeRange() {
        return Array.from(new Array(60), (val, index) => index * 6); // 15天，360小时
      },
    },
    "fnmoc-R": {
      enNumber: 20,
      interval: 6,
      timeRange() {
        return Array.from(new Array(40), (val, index) => index * 6);
      },
    },
    "cmc-R": {
      enNumber: 21,
      interval: 6,
      timeRange() {
        return Array.from(new Array(40), (val, index) => index * 6);
      },
    },
    ncep_e: {
      enNumber: 31,
      interval: -1,// -1 表示忽略时间间隔的判断
      timeRange() {
        return Array.from(new Array(64), (val, index) => index * 6);
      },
    },
    ukmo_e: {
      enNumber: 36,
      interval: -1,
      timeRange() {
        return Array.from(new Array(40), (val, index) => index * 6);
      },
    },
    fnmoc_e: {
      enNumber: 20,
      interval: -1,
      timeRange() {
        return Array.from(new Array(40), (val, index) => index * 6);
      },
    },
    cmc_e: {
      enNumber: 21,
      interval: -1,
      timeRange() {
        return Array.from(new Array(40), (val, index) => index * 6);
      },
    },
    UKMO: {},
  },
};

/**
 * 根据袭击概率返回背景色和适配的文字色
 * 深底 → 白字，浅底 → 深灰字
 */
function hitProbColor(p) {
  if (p > 0.75) {
    return { color: "rgb(199,50,104)", textColor: "#ffffff" };
  } else if (p >= 0.5) {
    return { color: "rgb(253,91,91)", textColor: "#ffffff" };
  } else if (p >= 0.25) {
    return { color: "rgb(253,253,104)", textColor: "#333333" };
  } else if (p >= 0.1) {
    return { color: "rgb(186,253,186)", textColor: "#333333" };
  } else {
    return { color: "white", textColor: "#333333" };
  }
}

/**
 * 根据风圈半径计算风圈geojson数据
 */
function createWindRadiusPolygon(
  center = [120, 40],
  infoList = [0, 0, 0, 200000]
) {
  // console.log(`center${center}`);
  const _Perimeter = 40030199.0; // 地球平均周长
  let segInfoArr = infoList.map((r, index) => {
    return {
      r: r,
      segIndex: index,
      greaterThanLon: index < 2,
      greaterThanLat: index % 3 === 0,
      radius: (r / _Perimeter) * 360, // 球心角
      reverse: index === 2,
    };
  });
  const circleGen = d3.geoCircle().center(center).precision(0.5);

  let segList = segInfoArr.map((item, index) => {
    if (item.r == 0) {
      return [center]; // 半径为0返回圆心
    } else {
      let circle = circleGen.radius(item.radius)();
      let seg = circle.coordinates[0].filter((loc) => {
        let logic0 = item.greaterThanLon
          ? loc[0] >= center[0]
          : loc[0] <= center[0];
        let logic1 = item.greaterThanLat
          ? loc[1] >= center[1]
          : loc[1] <= center[1];
        return logic0 && logic1;
      });

      if (index == 2) {
        seg.sort((a, b) => {
          const vectorA = [a[0] - center[0], a[1] - center[1]];
          const vectorB = [b[0] - center[0], b[1] - center[1]];
          const vectorK = vectorA[0] * vectorB[1] - vectorA[1] * vectorB[0];
          return vectorK;
        });
      }
      return seg;
    }
  });

  //
  let radiusCoord = segList.reduce((pV, cV) => pV.concat(cV), []);
  radiusCoord.push(radiusCoord[0]); // 首尾相连
  let geojson = {
    type: "Polygon",
    coordinates: [radiusCoord],
  };
  return geojson;
}

/**
 * 按照强度填色
 */
async function d3Map(
  tcRaw,
  opt = {
    showEnsTrack: true,
    showDetTrack: true,
    showWindRadius: true,
    radiusTimeInterval: 24,
    showWindPro: false,
    showHitPro: false,
    windProScale: 18,
  }
) {
  let center = calCenter(tcRaw);
  let timeInterval = tcUtil.model[tcRaw.ins].interval; // 设置时间间隔
  center[1] += 5;
  // 清除全部
  d3.select("#map-container .map-svg").remove();
  // console.log('d3Map');
  let projection = await drawMap("#map-container", center);

  let baseMap = d3.select("#map-container .base-map");

  //定义地形路径生成器
  //projection.rotate([180,0,0]);
  let path = d3.geoPath().projection(projection);

  // 绘制风圈概率
  if (!opt.showWindPro || !tcUtil.model[tcRaw.ins].containWindRadius) {
    ("");
  } else {
    // const contourRange = d3.range(0.1, 1, 0.2);
    const contourRange = [0.05, 0.1, 0.3, 0.5, 0.7, 0.9];
    const colorRange = [
      "#10AC00",
      "#B2DA00",
      "#E8C52A",
      "#FCA46F",
      "#F06948",
      "#CE2619",
    ];
    const contourArr = calWindContour(tcRaw, opt.windProScale, contourRange);
    contourArr.map((contour, index) => (contour.color = colorRange[index]));
    const windProSvg = baseMap
      .insert("g", ":first-child")
      .attr("class", "windpro-svg");
    windProSvg
      .selectAll("g.wind-contour-group")
      .data(contourArr)
      .enter()
      .append("g")
      .attr("class", "wind-contour-group")
      .append("path")
      .attr("d", (contour) => path(contour))
      .attr("class", (contour) => `wind-contour-${contour.value}`)
      .style("stroke", (contour) => contour.color)
      .style("fill", (contour) => contour.color)
      .style("stroke-width", "1px");
    // 绘制风圈概率
  }

  /*start 绘制袭击概率图*/
  if (opt.showHitPro) {
    const contourRange = [0.05, 0.1, 0.3, 0.5, 0.7, 0.9];
    const colorRange = [
      "#10AC00",
      "#B2DA00",
      "#E8C52A",
      "#FCA46F",
      "#F06948",
      "#CE2619",
    ];
    const contourArr = calRegionTChitProbility(
      tcRaw,
      contourRange,
      tcUtil.model[tcRaw.ins].enNumber,
      tcUtil.model[tcRaw.ins].interval
    );
    contourArr.map((contour, index) => (contour.color = colorRange[index]));
    const hitProSvg = baseMap
      .insert("g", ":first-child")
      .attr("class", "hitpro-svg");
    hitProSvg
      .selectAll("g.hitpro-contour-group")
      .data(contourArr)
      .enter()
      .append("g")
      .attr("class", "hitpro-contour-group")
      .append("path")
      .attr("d", (contour) => path(contour))
      .attr("class", (contour) => `hitpro-contour-${contour.value}`)
      .style("stroke", (contour) => contour.color)
      .style("fill", (contour) => contour.color)
      .style("stroke-width", "1px");
  }
  /*end 绘制袭击概率图*/

  // 地理路径
  // let tcRaw = await d3.json("/source/2019022414_Wutip_02WP_GEFS.json");
  let catArr = tcRaw.tracks
    .map((member) => member.track)
    .map((track) => {
      let twoPointLineArr = [];
      for (let i = 0; i < track.length - 1; i++) {
        let point0 = track[i][1];
        let point1 = track[i + 1][1];
        let nextWind = track[i + 1][3];
        let nextCat = tcUtil.wind2cat(nextWind);
        let nextColor = tcUtil.tcColor[nextCat];
        let time0 = track[i][0];
        let time1 = track[i + 1][0];
        if (timeInterval>0 && time1 - time0 > timeInterval) continue;// 时间步长过长断线
        const distance = Math.sqrt(
          Math.pow(point1[0] - point0[0], 2) +
            Math.pow(point1[1] - point0[1], 2)
        );
        if (distance > 9) continue; // 如果大于9个经纬度则断线
        twoPointLineArr.push({
          line: { type: "LineString", coordinates: [point0, point1] },
          nextCat,
          nextColor,
          curCat: tcUtil.wind2cat(track[i][3]),
        });
      }
      return twoPointLineArr;
    })
    .flat();

  if (opt.showEnsTrack) {
    let tcSvg = baseMap.append("g").attr("class", "tc-svg");
    tcSvg
      .selectAll("path")
      .data(catArr)
      .enter()
      .append("path")
      .attr("d", (d) => path(d.line))
      .attr("class", (d) => `track-line ${d.nextCat}`)
      // .style("stroke", d => d.nextColor)
      .style("stroke", (d) => "gray")
      .attr("opacity", 0.5);

    let pointArr = tcRaw.tracks
      .map((member) => member.track)
      .map((track) =>
        track.map((point) => {
          let cat = tcUtil.wind2cat(point[3]);
          return {
            point: point[1],
            project: projection(point[1]),
            color: tcUtil.tcColor[cat],
            cat,
            windRadiusInfo: point[5] ? point[5] : [],
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
      .attr("cx", (d) => d.project[0])
      .attr("cy", (d) => d.project[1])
      .attr("r", 1.5)
      .attr("opacity", 0.5)
      .style("stroke", (d) => d.color)
      .style("stroke-width", 1)
      .style("fill", "none");
  }

  // 集合平均路径
  if (opt.showMeanTrack && tcRaw.tracks && tcRaw.tracks.length) {
    const stepMap = new Map();
    tcRaw.tracks.forEach((member) => {
      (member.track || []).forEach((point) => {
        const step = point[0];
        const loc = point[1];
        const wind = point[3];
        if (!loc || loc.length < 2) return;
        if (!stepMap.has(step)) stepMap.set(step, []);
        stepMap.get(step).push({ lon: loc[0], lat: loc[1], wind });
      });
    });
    const meanTrack = [...stepMap.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([step, arr]) => ({
        step,
        point: [d3.mean(arr, (v) => v.lon), d3.mean(arr, (v) => v.lat)],
        wind: d3.mean(arr, (v) => v.wind),
      }));

    let meanLineArr = [];
    for (let i = 0; i < meanTrack.length - 1; i++) {
      const cur = meanTrack[i];
      const nxt = meanTrack[i + 1];
      if (timeInterval > 0 && nxt.step - cur.step > timeInterval) continue;
      const distance = Math.sqrt(
        Math.pow(nxt.point[0] - cur.point[0], 2) +
          Math.pow(nxt.point[1] - cur.point[1], 2)
      );
      if (distance > 9) continue;
      meanLineArr.push({
        line: { type: "LineString", coordinates: [cur.point, nxt.point] },
        nextCat: tcUtil.wind2cat(nxt.wind),
      });
    }

    const meanTrackSvg = baseMap.append("g").attr("class", "tc-svg mean-track");
    meanTrackSvg
      .selectAll("path")
      .data(meanLineArr)
      .enter()
      .append("path")
      .attr("d", (d) => path(d.line))
      .attr("class", (d) => `track-line-mean ${d.nextCat}`)
      .style("stroke", "black")
      .style("stroke-width", "3px")
      .style("fill", "none");

    const initTimeMoment = tcRaw.initTime ? moment(tcRaw.initTime) : null;
    const meanPoints = meanTrack.map((item) => {
      const cat = tcUtil.wind2cat(item.wind);
      const fcTime = initTimeMoment
        ? moment(initTimeMoment).add(item.step, "hours").format("MM-DD HH时")
        : "";
      return {
        point: item.point,
        project: projection(item.point),
        color: tcUtil.tcColor[cat],
        cat,
        step: item.step,
        wind: item.wind,
        fcTime,
      };
    });
    const meanPointSvg = baseMap.append("g");
    meanPointSvg.attr("class", "point-g mean-point");
    const meanCircles = meanPointSvg
      .selectAll("circle")
      .data(meanPoints)
      .enter()
      .append("circle")
      .attr("class", "point")
      .attr("cx", (d) => d.project[0])
      .attr("cy", (d) => d.project[1])
      .attr("r", 3.5)
      .style("fill", (d) => d.color)
      .style("stroke", (d) => d.color)
      .style("stroke-width", 1.0);
    meanCircles
      .append("title")
      .text(
        (d) =>
          `预报时效: +${d.step}h${d.fcTime ? ` (${d.fcTime})` : ""}\n` +
          `强度: ${d.cat}\n` +
          `平均风速: ${d.wind.toFixed(1)} m/s\n` +
          `位置: ${d.point[0].toFixed(2)}, ${d.point[1].toFixed(2)}`
      );
  }

  // 确定性预报
  if (!tcRaw.detTrack || !tcRaw.detTrack.track || !opt.showDetTrack) return; //不存在退出
  let detArr = (() => {
    let track = tcRaw.detTrack.track;
    let twoPointLineArr = [];
    for (let i = 0; i < track.length - 1; i++) {
      let point0 = track[i][1];
      let point1 = track[i + 1][1];
      let nextWind = track[i + 1][3];
      let nextCat = tcUtil.wind2cat(nextWind);
      let nextColor = tcUtil.tcColor[nextCat];
      let time0 = track[i][0];
      let time1 = track[i + 1][0];
      if (timeInterval>0 && time1 - time0 > timeInterval) continue; // 大于时间间隔跳过连线
      const distance = Math.sqrt(
        Math.pow(point1[0] - point0[0], 2) + Math.pow(point1[1] - point0[1], 2)
      );
      if (distance > 9) continue; // 如果大于9个经纬度则断线
      twoPointLineArr.push({
        line: { type: "LineString", coordinates: [point0, point1] },
        nextCat,
        nextColor,
        curCat: tcUtil.wind2cat(track[i][3]),
      });
    }
    return twoPointLineArr;
  })();

  const detInitTimeMoment = tcRaw.initTime ? moment(tcRaw.initTime) : null;
  const detPoints = tcRaw.detTrack.track.map((point) => {
    let cat = tcUtil.wind2cat(point[3]);
    const fcTime = detInitTimeMoment
      ? moment(detInitTimeMoment).add(point[0], "hours").format("MM-DD HH时")
      : "";
    return {
      point: point[1],
      project: projection(point[1]),
      color: tcUtil.tcColor[cat],
      cat,
      windRadiusInfo: point[5] ? point[5] : [],
      timeStep: point[0],
      wind: point[3],
      pressure: point[2],
      fcTime,
    };
  });

  const detTrackSvg = baseMap.append("g").attr("class", "tc-svg");
  detTrackSvg
    .selectAll("path")
    .data(detArr)
    .enter()
    .append("path")
    .attr("d", (d) => path(d.line))
    .attr("class", (d) => `track-line-det ${d.nextCat}`)
    .style("stroke", (d) => d.nextColor);

  const detPointSvg = baseMap.append("g");
  detPointSvg.attr("class", "point-g");
  const detCircles = detPointSvg
    .selectAll("circle")
    .data(detPoints)
    .enter()
    .append("circle")
    .attr("class", "point")
    .attr("cx", (d) => d.project[0])
    .attr("cy", (d) => d.project[1])
    .attr("r", 3.5)
    .style("fill", (d) => d.color)
    .style("stroke", (d) => d.color)
    .style("stroke-width", 1.0);
  detCircles
    .append("title")
    .text(
      (d) =>
        `预报时效: +${d.timeStep}h${d.fcTime ? ` (${d.fcTime})` : ""}\n` +
        `强度: ${d.cat}\n` +
        `风速: ${d.wind != null ? d.wind.toFixed(1) : "-"} m/s\n` +
        `气压: ${d.pressure != null ? d.pressure.toFixed(0) : "-"} hPa\n` +
        `位置: ${d.point[0].toFixed(2)}, ${d.point[1].toFixed(2)}`
    );

  // 风圈绘制
  let testRadiusDataValid = detPoints.length
    ? detPoints[0].windRadiusInfo.length
      ? true
      : false
    : false;
  if (
    !opt.showWindRadius ||
    !tcUtil.model[tcRaw.ins].containWindRadius ||
    !testRadiusDataValid
  ) {
    return;
  }

  let detPointsRadiusList = detPoints.map((item) => {
    let windRadiusInfo = item.windRadiusInfo;
    let infoMeta = [
      { threshold: 18, color: "blue", name_CN: "8级风圈", label: "风速>18m/s" },
      { threshold: 26, color: "rgb(255, 128, 0)", name_CN: "10级风圈", label: "风速>26m/s" },
      { threshold: 33, color: "red", name_CN: "12级风圈", label: "风速>33m/s" },
    ];
    // 按阈值匹配对应等级风圈；FNV3等数据源某等级可能缺失
    let infoList = infoMeta.map((meta) => {
      let seg = Array.isArray(windRadiusInfo)
        ? windRadiusInfo.find((v) => Array.isArray(v) && v[0] === meta.threshold)
        : null;
      return { ...meta, rawValue: seg ? seg.slice(1) : [] };
    });
    infoList.forEach((info) => {
      let isEmpty =
        !info.rawValue.length ||
        info.rawValue.every((value) => !value || value == 100);
      info.isEmpty = isEmpty;
      if (!isEmpty) {
        info.geojson = createWindRadiusPolygon(item.point, info.rawValue);
      }
    });
    return {
      center: item.point,
      radiusArr: infoList,
      timeStep: item.timeStep,
    };
  });
  // console.log(opt.radiusTimeInterval);
  let radiusTimeInterval = opt.radiusTimeInterval || 24;
  detPointsRadiusList = detPointsRadiusList.filter(
    (item) => item.timeStep % radiusTimeInterval === 0
  );
  // console.log(detPointsRadiusList);
  const detRadiusSvg = baseMap.append("g").attr("class", "radius-svg-det");
  detRadiusSvg
    .selectAll("g.radius-group")
    .data(detPointsRadiusList)
    .enter()
    .append("g")
    .attr("class", "radius-group")
    .selectAll("path")
    .data((d) => d.radiusArr)
    .enter()
    .append("path")
    .attr("d", (d) => (d.geojson ? path(d.geojson) : ""))
    .attr("class", (d) => `radius-${d.threshold}`)
    .style("stroke", (d) => d.color)
    .style("fill", "none")
    .style("stroke-width", "1px");

  return projection;
}

/**
 * 计算关键时间节点的等时间线
 * 1. 每12小时取一组集合预报点位（时间点集合A）
 * 2. 计算集合A经/纬度跨度，取跨度较大的方向为主轴
 * 3. 按主轴从小到大排序，取10%~90%分位的点位（剔除离群成员）
 * 4. 返回用于3次贝塞尔曲线插值的点序列及时间标签
 */
function calKeyTimeIsochrones(tcRaw, interval = 12) {
  if (!tcRaw.tracks || !tcRaw.tracks.length) return [];
  const initTime = tcRaw.initTime ? moment(tcRaw.initTime) : null;
  // 集合成员总数：优先用模型定义的成员数，缺失则退回实际追踪成员数
  const insMeta = tcUtil.model[tcRaw.ins];
  const ensembleNumber =
    insMeta && insMeta.enNumber ? insMeta.enNumber : tcRaw.tracks.length;
  // 收集所有出现过的时效步长
  const stepSet = new Set();
  tcRaw.tracks.forEach((member) => {
    (member.track || []).forEach((point) => stepSet.add(point[0]));
  });
  // 每 interval 小时选取一组时间点
  const steps = [...stepSet]
    .filter((step) => step > 0 && step % interval === 0)
    .sort((a, b) => a - b);

  const isochrones = [];
  steps.forEach((step) => {
    // 集合A：该时效下所有成员的点位
    let groupA = tcRaw.tracks
      .map((member) => {
        let point = member.track.find((v) => v[0] === step);
        return point ? point[1] : null;
      })
      .filter((loc) => loc && loc.length >= 2);
    if (groupA.length < 4) return; // 成员过少无法可靠取分位
    // 数据点数少于集合成员数的50%时，样本不足以代表整体，跳过该时次
    if (groupA.length < ensembleNumber * 0.5) return;

    // 计算经纬度跨度
    const lons = groupA.map((loc) => loc[0]);
    const lats = groupA.map((loc) => loc[1]);
    const lonSpan = Math.max(...lons) - Math.min(...lons);
    const latSpan = Math.max(...lats) - Math.min(...lats);
    // 最大跨度超过20个经纬度时，分歧过大或存在异源路径误归类，跳过绘制
    if (Math.max(lonSpan, latSpan) > 20) return;
    // 跨度大的方向作为排序主轴
    const axis = lonSpan >= latSpan ? 0 : 1;
    groupA = groupA.slice().sort((a, b) => a[axis] - b[axis]);

    // 取 10%~90% 分位，剔除两端离群点
    const n = groupA.length;
    const lowIdx = Math.floor(n * 0.1);
    const highIdx = Math.ceil(n * 0.9);
    const selected = groupA.slice(lowIdx, highIdx);
    if (selected.length < 2) return;

    isochrones.push({
      step,
      points: selected,
      axis, // 0=以经度为主轴，1=以纬度为主轴
      fcTime: initTime
        ? moment(initTime).add(step, "hours").format("MM-DD HH")
        : `+${step}h`,
    });
  });
  return isochrones;
}

/**
 * 按照时间填色
 */
async function d3Map2(tcRaw, opt = { showKeyTimeNodes: false }) {
  let center = calCenter(tcRaw);
  let timeInterval = tcUtil.model[tcRaw.ins].interval;
  center[1] += 5;
  // 清除全部
  d3.select("#map-container2 .map-svg").remove();
  let projection = await drawMap("#map-container2", center);

  let baseMap = d3.select("#map-container2 .base-map");

  //定义地形路径生成器
  let path = d3.geoPath().projection(projection);

  // 地理路径
  if (tcRaw.tracks) {
    let catArr = tcRaw.tracks
      .map((member) => member.track)
      .map((track) => {
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
          let time1 = track[i + 1][0];
          if (timeInterval>0 && time1 - time0 > timeInterval) continue; // 如果有跳点则断线
          const distance = Math.sqrt(
            Math.pow(point1[0] - point0[0], 2) +
              Math.pow(point1[1] - point0[1], 2)
          );
          if (distance > 9) continue; // 如果大于指定个经纬度则断线
          twoPointLineArr.push({
            line: { type: "LineString", coordinates: [point0, point1] },
            nextCat,
            nextColor,
            timeColor,
            curCat: tcUtil.wind2cat(track[i][3]),
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
      .attr("d", (d) => path(d.line))
      .attr("class", (d) => `track-line ${d.nextCat}`)
      .style("stroke", (d) => d.timeColor)
      .attr("opacity", 0.5);

    let pointArr = tcRaw.tracks
      .map((member) => member.track)
      .map((track) =>
        track.map((point) => {
          let cat = tcUtil.wind2cat(point[3]);
          let step = point[0];
          let timeColor = tcUtil.matchTimeColor(step);
          return {
            point: point[1],
            project: projection(point[1]),
            color: tcUtil.tcColor[cat],
            timeColor,
            step,
            cat,
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
      .attr("cx", (d) => d.project[0])
      .attr("cy", (d) => d.project[1])
      .attr("r", 1.5)
      .style("fill", (d) => d.timeColor)
      .attr("opacity", 0.5);
  }

  // 关键时间节点等时间线（不依赖确定性预报，需在提前退出前绘制）
  if (opt && opt.showKeyTimeNodes) {
    drawKeyTimeIsochrones(baseMap, tcRaw, projection);
  }

  // TODO tcRaw.detTrack is undefined
  // 确定性预报
  if (!tcRaw.detTrack || !tcRaw.detTrack.track) return;
  let detArr = (() => {
    let track = tcRaw.detTrack.track;
    let twoPointLineArr = [];
    for (let i = 0; i < track.length - 1; i++) {
      let point0 = track[i][1];
      let point1 = track[i + 1][1];
      let nextWind = track[i + 1][3];
      let nextCat = tcUtil.wind2cat(nextWind);
      let nextColor = tcUtil.tcColor[nextCat];
      let time0 = track[i][0];
      let time1 = track[i + 1][0];
      let point1Step = track[i + 1][0];
      let timeColor = tcUtil.matchTimeColor(point1Step);
      if (timeInterval>0 && time1 - time0 > timeInterval) continue;
      const distance = Math.sqrt(
        Math.pow(point1[0] - point0[0], 2) + Math.pow(point1[1] - point0[1], 2)
      );
      if (distance > 9) continue; // 如果大于指定个经纬度则断线
      twoPointLineArr.push({
        line: { type: "LineString", coordinates: [point0, point1] },
        nextCat,
        nextColor,
        curCat: tcUtil.wind2cat(track[i][3]),
        timeColor,
      });
    }
    return twoPointLineArr;
  })();

  const detPoints = tcRaw.detTrack.track.map((point) => {
    let cat = tcUtil.wind2cat(point[3]);
    let step = point[0];
    let timeColor = tcUtil.matchTimeColor(step);
    return {
      point: point[1],
      project: projection(point[1]),
      color: tcUtil.tcColor[cat],
      cat,
      timeColor,
    };
  });

  const detTrackSvg = baseMap.append("g").attr("class", "tc-svg");
  detTrackSvg
    .selectAll("path")
    .data(detArr)
    .enter()
    .append("path")
    .attr("d", (d) => path(d.line))
    .attr("class", (d) => `track-line-det ${d.nextCat}`)
    .style("stroke", (d) => d.timeColor);

  const detPointSvg = baseMap.append("g");
  detPointSvg.attr("class", "point-g");
  detPointSvg
    .selectAll("circle")
    .data(detPoints)
    .enter()
    .append("circle")
    .attr("class", "point")
    .attr("cx", (d) => d.project[0])
    .attr("cy", (d) => d.project[1])
    .attr("r", 3.5)
    .style("fill", (d) => d.timeColor);
}

/**
 * 二次多项式最小二乘拟合 u = a·t² + b·t + c
 * 返回系数 [c, b, a]，样本不足则退化为一次/常数
 */
function quadraticLeastSquares(ts, us) {
  const n = ts.length;
  // 样本过少无法二次拟合，退化处理
  if (n < 3) {
    if (n === 2) {
      const b = (us[1] - us[0]) / (ts[1] - ts[0] || 1);
      return [us[0] - b * ts[0], b, 0];
    }
    return [us[0] || 0, 0, 0];
  }
  // 构造正规方程 (X^T X) β = X^T u，X 的列为 [1, t, t²]
  let S0 = n,
    S1 = 0,
    S2 = 0,
    S3 = 0,
    S4 = 0;
  let T0 = 0,
    T1 = 0,
    T2 = 0;
  for (let i = 0; i < n; i++) {
    const t = ts[i];
    const t2 = t * t;
    S1 += t;
    S2 += t2;
    S3 += t2 * t;
    S4 += t2 * t2;
    T0 += us[i];
    T1 += us[i] * t;
    T2 += us[i] * t2;
  }
  // 3x3 线性方程组，克莱姆法则求解
  const A = [
    [S0, S1, S2],
    [S1, S2, S3],
    [S2, S3, S4],
  ];
  const B = [T0, T1, T2];
  const det3 = (m) =>
    m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
    m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
    m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
  const D = det3(A);
  if (Math.abs(D) < 1e-9) {
    // 病态：退化为一次拟合
    const b = (S0 * T1 - S1 * T0) / (S0 * S2 - S1 * S1 || 1);
    const c = (T0 - b * S1) / S0;
    return [c, b, 0];
  }
  const replaceCol = (m, col, vec) =>
    m.map((row, i) => row.map((v, j) => (j === col ? vec[i] : v)));
  const c = det3(replaceCol(A, 0, B)) / D;
  const b = det3(replaceCol(A, 1, B)) / D;
  const a = det3(replaceCol(A, 2, B)) / D;
  return [c, b, a];
}

/**
 * 绘制关键时间节点等时间线并标注时间
 * 用二次多项式最小二乘拟合，得到平滑曲线（不强制穿过每个散点）
 */
function drawKeyTimeIsochrones(baseMap, tcRaw, projection) {
  const isochrones = calKeyTimeIsochrones(tcRaw, 12);
  if (!isochrones.length) return;

  const SAMPLE = 24; // 拟合曲线采样点数
  const isoGroup = baseMap.append("g").attr("class", "key-time-isochrone");

  const isoData = isochrones
    .map((iso) => {
      const projected = iso.points
        .map((loc) => projection(loc))
        .filter((p) => p && isFinite(p[0]) && isFinite(p[1]));
      if (projected.length < 2) return null;

      // 主轴对应屏幕坐标：墨卡托下经度→x(0)、纬度→y(1)
      const axisIdx = iso.axis; // 0=x, 1=y
      const ts = projected.map((p) => p[axisIdx]);
      const us = projected.map((p) => p[1 - axisIdx]);
      const [c, b, a] = quadraticLeastSquares(ts, us);

      // 沿主轴在样本范围内均匀采样，生成平滑曲线
      const tMin = Math.min(...ts);
      const tMax = Math.max(...ts);
      const curve = [];
      for (let i = 0; i <= SAMPLE; i++) {
        const t = tMin + ((tMax - tMin) * i) / SAMPLE;
        const u = a * t * t + b * t + c;
        curve.push(axisIdx === 0 ? [t, u] : [u, t]);
      }
      return { ...iso, curve };
    })
    .filter(Boolean);

  const lineGen = d3
    .line()
    .x((d) => d[0])
    .y((d) => d[1])
    .curve(d3.curveBasis); // 采样点已平滑，basis 仅做轻微顺滑

  // 奇偶时次分色，增强标签与曲线的对应区分度
  const evenColor = "#1565c0"; // 偶数时次：蓝
  const oddColor = "#e65100"; // 奇数时次：橙
  const colorOf = (i) => (i % 2 === 0 ? evenColor : oddColor);

  // 等时间线
  isoGroup
    .selectAll("path.isochrone-line")
    .data(isoData)
    .enter()
    .append("path")
    .attr("class", "isochrone-line")
    .attr("d", (d) => lineGen(d.curve))
    .style("fill", "none")
    .style("stroke", (d, i) => colorOf(i))
    .style("stroke-width", "1.5px")
    .style("stroke-dasharray", "5,3")
    .attr("opacity", 0.85);

  // 计算每条曲线的东西端点（按屏幕x：小=偏西/经度小，大=偏东/经度大）
  // 注意曲线是沿主轴采样的，端点顺序未必对应东西，需显式比较
  isoData.forEach((d) => {
    const head = d.curve[0];
    const tail = d.curve[d.curve.length - 1];
    if (head[0] <= tail[0]) {
      d.westPt = head;
      d.eastPt = tail;
    } else {
      d.westPt = tail;
      d.eastPt = head;
    }
  });

  // 时间标注：相邻时次交替放置，避免标签互相重叠
  // 偶数时次 → 西侧端点的西侧（右对齐）；奇数时次 → 东侧端点的东侧（左对齐）
  const GAP = 22; // 标签锚点与曲线端点的水平间距（留出引线长度）
  const labelGroup = isoGroup.append("g").attr("class", "isochrone-labels");

  // 引线：从曲线端点连到标签锚点
  labelGroup
    .selectAll("line.isochrone-leader")
    .data(isoData)
    .enter()
    .append("line")
    .attr("class", "isochrone-leader")
    .attr("x1", (d, i) => (i % 2 === 0 ? d.westPt[0] : d.eastPt[0]))
    .attr("y1", (d, i) => (i % 2 === 0 ? d.westPt[1] : d.eastPt[1]))
    .attr("x2", (d, i) =>
      i % 2 === 0 ? d.westPt[0] - GAP : d.eastPt[0] + GAP
    )
    .attr("y2", (d, i) => (i % 2 === 0 ? d.westPt[1] : d.eastPt[1]))
    .style("stroke", (d, i) => colorOf(i))
    .style("stroke-width", "1px")
    .attr("opacity", 0.9);

  // 端点小圆点，标示引线起点
  labelGroup
    .selectAll("circle.isochrone-anchor")
    .data(isoData)
    .enter()
    .append("circle")
    .attr("class", "isochrone-anchor")
    .attr("cx", (d, i) => (i % 2 === 0 ? d.westPt[0] : d.eastPt[0]))
    .attr("cy", (d, i) => (i % 2 === 0 ? d.westPt[1] : d.eastPt[1]))
    .attr("r", 2.5)
    .style("fill", (d, i) => colorOf(i))
    .style("stroke", "white")
    .style("stroke-width", "1px");

  const labels = labelGroup
    .selectAll("g.isochrone-label")
    .data(isoData)
    .enter()
    .append("g")
    .attr("class", "isochrone-label")
    .attr("transform", (d, i) => {
      const anchor = i % 2 === 0 ? d.westPt : d.eastPt;
      const x = i % 2 === 0 ? anchor[0] - GAP : anchor[0] + GAP;
      return `translate(${x},${anchor[1]})`;
    });
  labels
    .append("text")
    .attr("dy", "0.32em")
    .attr("dx", (d, i) => (i % 2 === 0 ? -3 : 3))
    .attr("text-anchor", (d, i) => (i % 2 === 0 ? "end" : "start"))
    .style("font-size", "11px")
    .style("font-weight", "bold")
    .style("fill", (d, i) => colorOf(i))
    .style("stroke", "white")
    .style("stroke-width", "3px")
    .style("paint-order", "stroke")
    .text((d) => d.fcTime);
}

/**
 * 绘制地图底图
 */
async function drawMap(
  container = "#map-container2",
  center = [140, 21],
  geoMap
) {
  //请求china.geojson
  // console.log('drawMap');
  if (!geoMap) {
    // 没有参数则尝试加载util中的地图
    if (tcUtil.geoMap) {
      geoMap = tcUtil.geoMap;
    } else {
      // 都没有地图则自行加载
      let worldTopo = await d3.json("/source/110m.json");
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

  let newCenter = [center[0] - 180, center[1]];
  if (newCenter[0] < -180) newCenter[0] += 360;
  //定义地图的投影
  // console.log(center,newCenter);
  const projection = d3
    .geoMercator()
    .scale(800)
    .translate([width / 2, height / 2])
    .rotate([180, 0, 0])
    .center([newCenter[0], newCenter[1]]);

  //定义地形路径生成器
  let path = d3.geoPath().projection(projection);
  // 经纬网格
  // let eps = 1e-4;
  // console.log(worldGeo);
  let baseMap = mapSvg.append("g").attr("class", "base-map");

  // 放大缩小
  let zoom = d3.zoom().scaleExtent([0.5, 9]).on("zoom", zoomed);

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
    .extent([
      [-180, -80],
      [180, 80],
    ])
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
    // console.log(container);
    let originR = 1.5;
    if (container == "#map-container2") {
      originR = 1.5;
    }
    var scale = d3.event.transform.k;
    // console.log(scale);
    baseMap.attr("transform", d3.event.transform);
    baseMap.selectAll("circle").attr("r", (originR * 1) / scale);
    baseMap.selectAll(".track-line").style("stroke-width", 1 / scale);
  }
  // TODO latlon error
  // var transform = d3.event.transform
  // transform.x = <width> * (1 - transform.k) / 2 // To keep center fixed.
  // transform.y = <height> * (1 - transform.k) / 2 // To keep center fixed.
  // var x = (d3.mouse(this)[0] - transform.x) / transform.k
  // var y = (d3.mouse(this)[1] - transform.y) / transform.k
  // var p = projection.invert([x, y])
  let latlonContainer = d3.select(`.${container.replace("#", "")} .lonlat`);
  mapSvg.on("mousemove", function () {
    var transform = d3.zoomTransform(this);
    var xy = transform.invert(d3.mouse(this));
    let lonlat = projection.invert(xy);
    latlonContainer.select(".lon").text(lonlat[0].toFixed(2));
    latlonContainer.select(".lat").text(lonlat[1].toFixed(2));
    // console.log(projection.invert(d3.mouse(this)));
  });
  return projection;
}

/**
 * 计算单个成员路径各时次的移动速度（km/h）
 * - 最前端：前插（前向差分）
 * - 最后端：后插（后向差分）
 * - 中间点：中央差分
 * 返回 Map: 时效step -> 移速(km/h)
 */
function calMoveSpeed(track) {
  const speedMap = new Map();
  if (!Array.isArray(track) || track.length < 2) return speedMap;
  // 按时效排序并过滤无效点，确保前后相邻关系正确
  const sorted = track
    .filter((p) => p && Array.isArray(p[1]) && p[1].length >= 2)
    .slice()
    .sort((a, b) => a[0] - b[0]);
  const n = sorted.length;
  if (n < 2) return speedMap;
  // 球面大圆距离（Haversine），返回 km
  const dist = (a, b) => {
    const R = 6371; // 地球平均半径 km
    const toRad = (d) => (d * Math.PI) / 180;
    const dLat = toRad(b[1] - a[1]);
    const dLon = toRad(b[0] - a[0]);
    const lat1 = toRad(a[1]);
    const lat2 = toRad(b[1]);
    const h =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  };
  for (let i = 0; i < n; i++) {
    let dt, d;
    if (i === 0) {
      // 最前端：前插
      dt = sorted[1][0] - sorted[0][0];
      d = dist(sorted[0][1], sorted[1][1]);
    } else if (i === n - 1) {
      // 最后端：后插
      dt = sorted[n - 1][0] - sorted[n - 2][0];
      d = dist(sorted[n - 2][1], sorted[n - 1][1]);
    } else {
      // 中间点：中央差
      dt = sorted[i + 1][0] - sorted[i - 1][0];
      d = dist(sorted[i - 1][1], sorted[i + 1][1]);
    }
    if (dt > 0) {
      speedMap.set(sorted[i][0], d / dt); // km / h
    }
  }
  return speedMap;
}

async function drawPlotyBox(tcRaw, ins = "NCEP") {
  // let tcRaw = await d3.json("/source/2019022414_Wutip_02WP_GEFS.json");
  // ins = ins.replace('-','_');
  let tracks = tcRaw.tracks;
  // console.log(tcUtil.model);
  let timeRange = tcUtil.model[ins].timeRange(); //生成等差序列
  let initTime = moment(tcRaw.initTime);
  let traceArr = [];
  let x_dtick = timeRange[timeRange.length-1]>240?8:4;
  // 预计算每个成员各时次的移速（km/h），键为时效step
  let speedMaps = tracks.map((member) => calMoveSpeed(member.track));
  for (let step of timeRange) {
    let currentTimePoint = tracks
      .map((member, mi) => {
        let point = member.track.find((v) => v[0] == step);
        return { point, mi, ensembleNumber: member.ensembleNumber };
      })
      .filter((member) => member.point); //去除空值
    let iTime = step2time(initTime, step);
    // 该时次各成员的移速，剔除无对应值的成员
    let speedList = currentTimePoint
      .map((member) => speedMaps[member.mi].get(step))
      .filter((v) => v != null && isFinite(v));
    traceArr.push({
      timeStep: moment(iTime).format("DD日HH时"),
      wind: currentTimePoint.map((member) => member.point[3]),
      meanWind: d3.mean(currentTimePoint.map((member) => member.point[3])),
      pressure: currentTimePoint.map((member) => member.point[2]),
      meanPressure: d3.mean(currentTimePoint.map((member) => member.point[2])),
      speed: speedList,
      meanSpeed: speedList.length ? d3.mean(speedList) : null,
    });
  }
  let windData = traceArr.map((trace) => {
    return {
      y: trace.wind,
      type: "box",
      name: trace.timeStep,
      marker: { color: "rgb(214,12,140)" },
    };
  });

  let meanWind = {
    x: traceArr.map((trace) => trace.timeStep),
    y: traceArr.map((trace) => trace.meanWind),
    type: "lines",
    name: "mean",
  };
  let windLayout = {
    // 标题改为绘图区内左上角标注，回收顶部 margin，坐标轴顶部贴近 SVG 顶部
    annotations: [
      {
        text: "中心附近最大风力箱线图",
        showarrow: false,
        xref: "paper",
        yref: "paper",
        x: 0,
        y: 1,
        xanchor: "left",
        yanchor: "top",
        font: { size: 13, color: "#333" },
        bgcolor: "rgba(255,255,255,0.6)",
      },
    ],
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
      ticklen: 5,
    },
    showlegend: false,
    margin: {
      l: 60,
      r: 20,
      t: 10,
      b: 40,
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
      dtick: x_dtick,
    },
    height: 310,
  };
  Plotly.newPlot("box-wind", [...windData, meanWind], windLayout, {
    displayModeBar: false,
  });

  let pressureData = traceArr.map((trace) => {
    return {
      y: trace.pressure,
      type: "box",
      name: trace.timeStep,
      marker: { color: "rgb(0,128,128)" },
    };
  });
  let meanPressure = {
    x: traceArr.map((trace) => trace.timeStep),
    y: traceArr.map((trace) => trace.meanPressure),
    type: "lines",
    line: {
      color: "rgb(55, 128, 191)",
      // width: 1,
      dash: "dot",
    },
    name: "mean",
  };
  let pressureLayout = {
    annotations: [
      {
        text: "中心气压箱线图",
        showarrow: false,
        xref: "paper",
        yref: "paper",
        x: 0,
        y: 1,
        xanchor: "left",
        yanchor: "top",
        font: { size: 13, color: "#333" },
        bgcolor: "rgba(255,255,255,0.6)",
      },
    ],
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
      ticklen: 5,
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
      dtick: x_dtick,
    },
    showlegend: false,
    margin: {
      l: 60,
      r: 20,
      t: 10,
      b: 40,
    },
    height: 310,
  };
  Plotly.newPlot(
    "box-pressure",
    [...pressureData, meanPressure],
    pressureLayout,
    { displayModeBar: false }
  );

  // 移动速度箱线图（km/h）
  let speedData = traceArr.map((trace) => {
    return {
      y: trace.speed,
      type: "box",
      name: trace.timeStep,
      marker: { color: "rgb(65,105,225)" },
    };
  });
  let meanSpeed = {
    x: traceArr.map((trace) => trace.timeStep),
    y: traceArr.map((trace) => trace.meanSpeed),
    type: "lines",
    line: {
      color: "rgb(255,140,0)",
      dash: "dot",
    },
    name: "mean",
  };
  let speedLayout = {
    annotations: [
      {
        text: "移动速度箱线图",
        showarrow: false,
        xref: "paper",
        yref: "paper",
        x: 0,
        y: 1,
        xanchor: "left",
        yanchor: "top",
        font: { size: 13, color: "#333" },
        bgcolor: "rgba(255,255,255,0.6)",
      },
    ],
    yaxis: {
      title: "speed km/h",
      zeroline: false,
      showline: true,
      showticklabels: true,
      linecolor: "rgb(204,204,204)",
      linewidth: 2,
      ticks: "outside",
      tickcolor: "rgb(204,204,204)",
      tickwidth: 2,
      ticklen: 5,
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
      dtick: x_dtick,
    },
    showlegend: false,
    margin: {
      l: 60,
      r: 20,
      t: 10,
      b: 40,
    },
    height: 310,
  };
  Plotly.newPlot("box-speed", [...speedData, meanSpeed], speedLayout, {
    displayModeBar: false,
  });

  var stackLayout = {
    barmode: "stack",
    height: 288,
    margin: {
      l: 60,
      r: 20,
      t: 40,
      b: 0,
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
      dtick: x_dtick,
      side: "top",
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
      range: [0, tcUtil.model[ins].enNumber], //范围为集合成员数
    },
    legend: {
      orientation: "h",
      // yanchor: "top",
      y: 0,
    },
  };

  let stackArr = [];
  for (let step of timeRange) {
    let currentTimePoint = tracks
      .map((member) => {
        let point = member.track.find((v) => v[0] == step);
        return { point, ensembleNumber: member.ensembleNumber };
      })
      .filter((member) => member.point); //去除空值

    let [LOW, TD, TS, STS, TY, STY, SuperTY] = [0, 0, 0, 0, 0, 0, 0];
    for (let member of currentTimePoint) {
      let wind = member.point[3];
      if (wind < 10.8) {
        LOW += 1;
      } else if (wind >= 10.8 && wind < 17.2) {
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
    let iTime = step2time(initTime, step);
    stackArr.push({
      time: moment(iTime).format("DD日HH时"), //step,
      LOW,
      TD,
      TS,
      STS,
      TY,
      STY,
      SuperTY,
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
  let stackData = ["SuperTY", "STY", "TY", "STS", "TS", "TD", "LOW"].map(
    (type) => {
      return {
        x: stackArr.map((tc) => tc.time),
        y: stackArr.map((tc) => tc[type]),
        name: type,
        type: "bar",
        marker: {
          color: tcColor[type],
        },
      };
    }
  );

  Plotly.newPlot("stacked-cat", stackData, stackLayout, {
    displayModeBar: false,
  });
}

/**
 * 计算中心
 */
function calCenter(tcRaw) {
  // console.log(tcRaw);
  if(tcRaw.tracks && tcRaw.tracks.length){
    let allPoint = tcRaw.tracks
      .map((member) => member.track)
      .map((track) => track.map((point) => point[1]))
      .flat();
    let meanLon = d3.mean(allPoint.map((loc) => loc[0]));
    let meanLat = d3.mean(allPoint.map((loc) => loc[1]));
    return [meanLon, meanLat];
  }else if(tcRaw.detTrack && tcRaw.detTrack.track && tcRaw.detTrack.track.length){
    let allPoint = tcRaw.detTrack.track
      .map(item=>item[1]);
    let meanLon = d3.mean(allPoint.map((loc) => loc[0]));
    let meanLat = d3.mean(allPoint.map((loc) => loc[1]));
    return [meanLon, meanLat];
  }else{
    return [130, 20];
  }
}

function step2time(initTime, step) {
  return moment(initTime).add(step, "hours").toDate();
}

async function d3MapOverview(multiTC) {
  // let center = calCenter(tcRaw);
  // center[1] += 5;
  // 清除全部
  // console.log(multiTC);
  // multiTC = [multiTC[0]];
  if (!multiTC[0]) return;
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
  for (let iTc = 0; iTc < multiTC.length; iTc++) {
    let tcRaw = multiTC[iTc];
    if (!tcRaw.tracks) continue; //不存在退出
    let catArr = tcRaw.tracks
      .map((member) => member.track)
      .map((track) => {
        let twoPointLineArr = [];
        for (let i = 0; i < track.length - 1; i++) {
          let point0 = track[i][1];
          let point1 = track[i + 1][1];
          let nextWind = track[i + 1][3];
          let nextCat = tcUtil.wind2cat(nextWind);
          let nextColor = tcUtil.tcColor[nextCat];
          let time0 = track[i][0];
          let time1 = track[i + 1][0];
          if (timeInterval>0 && time1 - time0 > timeInterval) continue;
          const distance = Math.sqrt(
            Math.pow(point1[0] - point0[0], 2) +
              Math.pow(point1[1] - point0[1], 2)
          );
          if (distance > 9) continue; // 如果大于9个经纬度则断线
          twoPointLineArr.push({
            line: { type: "LineString", coordinates: [point0, point1] },
            nextCat,
            nextColor,
            curCat: tcUtil.wind2cat(track[i][3]),
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
    .attr("d", (d) => path(d.line))
    .attr("class", (d) => `track-line ${d.nextCat}`)
    .style("stroke", (d) => d.nextColor);
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
  for (let iTc = 0; iTc < multiTC.length; iTc++) {
    let tcRaw = multiTC[iTc];
    if (!tcRaw.detTrack || !tcRaw.detTrack.track) continue; //不存在退出
    let detArr = (() => {
      let track = tcRaw.detTrack.track;
      let twoPointLineArr = [];
      for (let i = 0; i < track.length - 1; i++) {
        let point0 = track[i][1];
        let point1 = track[i + 1][1];
        let nextWind = track[i + 1][3];
        let nextCat = tcUtil.wind2cat(nextWind);
        let nextColor = tcUtil.tcColor[nextCat];
        let time0 = track[i][0];
        let time1 = track[i + 1][0];
        if (timeInterval>0 && time1 - time0 > timeInterval) continue; // 大于时间间隔跳过连线
        const distance = Math.sqrt(
          Math.pow(point1[0] - point0[0], 2) +
            Math.pow(point1[1] - point0[1], 2)
        );
        if (distance > 9) continue; // 如果大于9个经纬度则断线
        twoPointLineArr.push({
          line: { type: "LineString", coordinates: [point0, point1] },
          nextCat,
          nextColor,
          curCat: tcUtil.wind2cat(track[i][3]),
        });
      }
      return twoPointLineArr;
    })();
    allDetCatArr.push(detArr);
  }
  allDetCatArr = allDetCatArr.flat();

  let allDetPointArr = new Array();
  for (let iTc = 0; iTc < multiTC.length; iTc++) {
    let tcRaw = multiTC[iTc];
    if (!tcRaw.detTrack || !tcRaw.detTrack.track) continue; //不存在退出
    const detPoints = tcRaw.detTrack.track.map((point) => {
      let cat = tcUtil.wind2cat(point[3]);
      return {
        point: point[1],
        project: projection(point[1]),
        color: tcUtil.tcColor[cat],
        cat,
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
    .attr("d", (d) => path(d.line))
    .attr("class", (d) => `track-line-det ${d.nextCat}`)
    .style("stroke", (d) => d.nextColor);

  const detPointSvg = baseMap.append("g");
  detPointSvg.attr("class", "point-g");
  detPointSvg
    .selectAll("circle")
    .data(allDetPointArr)
    .enter()
    .append("circle")
    .attr("class", "point")
    .attr("cx", (d) => d.project[0])
    .attr("cy", (d) => d.project[1])
    .attr("r", 3)
    .style("fill", (d) => d.color);
  // .style("stroke", d => d.color)
  // .style("stroke-width", 1.0)

  return projection;
}

export default {
  name: "d3-tc-ens",
  data() {
    let now = moment(new Date());
    let endTime = now.format("YYYY-MM-DD");
    let startTime = moment(now).subtract(1, "days").format("YYYY-MM-DD");
    return {
      showPressureBox: false,
      showWindRadius: false,
      showEnsTrack: true,
      showDetTrack: true,
      showMeanTrack: true,
      showWindPro: false,
      showHitPro: false,
      showKeyTimeNodes: true,
      radiusTimeInterval: 24,
      windProScale: 18,
      tcOpenPanel: "1",
      allTC: [],
      hitCityList2: [
        { lon: 1, name: 123 },
        { lon: 2, name: 122 },
      ],
      currentTCcard: "singleTC",
      selectedTC: null,
      selectedIns: null,
      // overViewTC:null,
      selectedInsIndex: [-1, -1],
      selectedDateModelList: [],
      selectedOverView: [null, null],
      timeRange: [startTime, endTime],
      selectedTimeIndex: -1,
      selectedBasin: "WPAC",
      selectedModel: [
        "ecmwf",
        // "ncep-R",
        "ncep_e",
        // "fnv3",
        "aifs-cai",
        "fnv3-gen",
        // "fnmoc-R",
        // "cmc-R",
        "TRAMS_TY",
      ],
      tcMeta: tcUtil.model,
      cityInfo: cityInfo,
      basinList: [
        {
          value: "global",
          label: "全球",
        },
        {
          value: "WPAC",
          label: "西北太平洋",
        },
      ],
      modelListOffice: [
        { value: "ecmwf", label: "ECMWF" },
        { value: "TRAMS_TY", label: "华南台风模式" },
        { value: "NCEP", label: "NCEP" },
        { value: "fnv3", label: "FNV3-Google" },
        { value: "aifs-cai", label: "AIFS集合" },
        { value: "fnv3-gen", label: "FNV3-含扰动" },
      ],
      modelListRuc: [
        { value: "ncep-R", label: "NCEP-R" },
        { value: "ecmwf-R", label: "EC-R" },
        { value: "ukmo-R", label: "英国" },
        { value: "fnmoc-R", label: "FNMOC" },
        { value: "cmc-R", label: "加拿大" },
      ],
      modelListEmc: [
        { value: "ncep_e", label: "NCEP_E" },
        { value: "fnmoc_e", label: "FNMOC_E" },
        { value: "cmc_e", label: "加拿大_E" },
        { value: "ukmo_e", label: "英国_E" },
        { value: "ncep-N", label: "NCEP备份" },
      ],
      tcFilter: "all",
      showHitTime: false,
      hitTimeLocName: "",
      AllHitTimeLocName: "",
      allTcHitCityList: [],
      hitCityList: [],
      showAllTcHit: false,
      showAllHitTime: false,
    };
  },
  mounted() {
    this.timeChange(this.timeRange);
    d3.json("/source/110m.json").then((worldTopo) => {
      let worldGeo = topojson.feature(worldTopo, worldTopo.objects.land);
      tcUtil.geoMap = tcUtil.geoMap.concat(worldGeo.features);
    });

    d3.json("/source/bou2_4l.topo.simplify.json").then((chinaTopo) => {
      let chinaGeo = topojson.feature(chinaTopo, chinaTopo.objects.bou2_4l);
      tcUtil.geoMap = tcUtil.geoMap.concat(chinaGeo.features);
      // console.log(chinaGeo);
    });
    // console.log(worldTopo);
  },
  methods: {
    setBoxPlot() {
      drawPlotyBox().catch((err) => {
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
    searchTC() {
      let sTime = this.timeRange[0] + " 00:00";
      let eTime = this.timeRange[1] + " 23:59";
      return this.getTC([sTime, eTime]);
    },
    showTC(tcRaw, needJump = true) {
      this.showHitTime = false;
      // this.showAllTcHit = false;
      this.currentTCcard = "singleTC";
      this.selectedTC = tcRaw;
      // 切换到新的TC时，ECMWF且编号以7开头的默认不显示集合平均路径
      if (needJump) {
        const number = tcRaw && tcRaw.cycloneNumber ? tcRaw.cycloneNumber : "";
        // ecmwf 且编号以7开头（如70W/71W）默认不显示集合平均路径与关键时间节点
        const isEcmwf7 = tcRaw && tcRaw.ins === "ecmwf" && number[0] === "7";
        // fnv3-gen 中编号为 C-9999 的预报表示无法归类的集合成员，默认不显示关键时间节点
        const isFnv3genUnclassified =
          tcRaw && tcRaw.ins === "fnv3-gen" && number.includes("9999");
        this.showMeanTrack = !(isEcmwf7 || isFnv3genUnclassified);
        this.showKeyTimeNodes = !(isEcmwf7 || isFnv3genUnclassified);
      }
      this.$nextTick(() => {
        d3Map2(tcRaw, { showKeyTimeNodes: this.showKeyTimeNodes });
        drawPlotyBox(tcRaw, tcRaw.ins);
        d3Map(tcRaw, {
          showEnsTrack: this.showEnsTrack,
          showDetTrack: this.showDetTrack,
          showMeanTrack: this.showMeanTrack,
          showWindRadius: this.showWindRadius,
          showWindPro: this.showWindPro,
          showHitPro: this.showHitPro,
          windProScale: this.windProScale,
          radiusTimeInterval: this.radiusTimeInterval,
        });
        this.calHitCityList();
        if (needJump) this.jump(".tc-tabs-card", 75);
      });
      // d3OverViewMap(tcRaw);
    },
    triggerMapOpt(type, value) {
      switch (type) {
        case "showEnsTrack":
          this.showEnsTrack = !this.showEnsTrack;
          break;
        case "showDetTrack":
          this.showDetTrack = !this.showDetTrack;
          break;
        case "showMeanTrack":
          this.showMeanTrack = !this.showMeanTrack;
          break;
        case "showKeyTimeNodes":
          this.showKeyTimeNodes = !this.showKeyTimeNodes;
          break;
        case "showWindRadius":
          this.showWindRadius = !this.showWindRadius;
          break;
        case "radiusTimeInterval":
          // console.log(`triger${this.radiusTimeInterval}`);
          this.radiusTimeInterval = value;
          break;
        case "windProScale":
          // console.log(`triger windProScale`);
          this.windProScale = value;
          break;
        case "showWindPro":
          // console.log(`triger showWindPro`);
          this.showWindPro = !this.showWindPro;
          this.showHitPro = false;
          break;
        case "showHitPro":
          // console.log(`triger showHitPro`);
          this.showHitPro = !this.showHitPro;
          this.showWindPro = false;
          break;
        default:
          break;
      }
      this.showTC(this.selectedTC, false);
    },
    showAllTC(insMultiTC) {
      this.showAllTcHit = false;
      let multiTC = insMultiTC.tc;
      this.selectedIns = insMultiTC;
      this.currentTCcard = "overviewTC";
      this.selectedInsIndex = [this.selectedTimeIndex, insMultiTC.ins];
      this.$nextTick(() => {
        d3MapOverview(multiTC);
        this.jump(".tc-tabs-card", 50);
      });
    },
    getTC(times = ["20190407 00:00", "2019-04-08 23:59"]) {
      //.get("/source/2019032400_21S_VERONICA_ECEP.json")
      this.$Message.info("正在查询数据...");
      axios
        .get(
          `/api?interface=tc-ens&gt=${times[0]}&lt=${
            times[1]
          }&dateFormat=YYYY-MM-DD HH:mm&ins=${this.selectedModel.join(
            ","
          )}&basin=${this.selectedBasin}&spe=${this.tcFilter}`
        )
        .then((response) => {
          let raw = response.data;
          // console.log(raw);
          if (!raw.success) throw new Error(raw);
          let tcArr = raw.data;

          if (tcArr.length) {
            // this.tcList = tcList;
            this.$Message.info("查询完成...");
            this.allTC = this.catTC(tcArr);
            this.selectedTimeIndex = this.allTC.length - 1;
            if (this.allTC.length) {
              // 显示最新的TC概览
              let leastTimeTC = this.allTC[this.allTC.length - 1].ins;
              let ecLeastTimeTC = leastTimeTC.filter(
                (ins) => ins.ins === "ecmwf"
              );
              if (ecLeastTimeTC.length) {
                this.showAllTC(ecLeastTimeTC[0]);
              }
            }
          } else {
            this.$Notice.info({
              title: "Empty",
              desc: "所选条件没有数据",
            });
          }
        })
        .catch((error) => {
          this.$Notice.error({
            title: "查询TC出错",
            desc: error.message,
          });
          console.error(error);
        });
    },
    catTC(tcArr = []) {
      let timeSet = new Set(tcArr.map((tc) => tc.initTime)); //选出日期并去重
      let insSet = new Set(tcArr.map((tc) => tc.ins));
      let tcAll = [];
      for (let iTime of timeSet) {
        let timeWrap = { time: iTime, ins: [] };
        let sameTime = tcArr.filter((tc) => tc.initTime == iTime);
        for (let iIns of insSet) {
          let insWrap = { ins: iIns, tc: [] };
          let sameIns = sameTime.filter((tc) => tc.ins == iIns);
          sameIns.sort((tc0, tc1) => {
            let number0 = tc0.cycloneNumber;
            let number1 = tc1.cycloneNumber;
            if (number0[0] == "9") number0 = "6" + number0;
            if (number1[0] == "9") number1 = "6" + number1;
            if (number0 < number1) {
              return -1;
            } else {
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
    switchTimeTable(i) {
      this.selectedTimeIndex = i;
      // this.selectedInsIndex[0] = selectedTimeIndex;
    },
    showTCName(tc) {
      let fullName = "";
      if (tc.cycloneName === tc.cycloneNumber) {
        fullName += tc.cycloneName;
      } else {
        fullName += tc.cycloneName + "-" + tc.cycloneNumber;
      }
      let basin = tc.basinShort || tc.basinShort2;
      // console.log(fullName, )
      if (!tc.cycloneNumber.includes(basin)) {
        fullName += ` ${basin}`;
      }
      return fullName;
    },
    jump(selector, offset = 0) {
      let jump = document.querySelector(selector);
      let total = jump.offsetTop + offset;
      // console.log(total);
      document.documentElement.scrollTop = total;
    },
    getAllTcHitTimeSeries(point = { x: 153, y: 32 }) {
      const allTC = this.selectedIns.tc;
      const memberNumber = this.tcMeta[this.selectedIns.ins].enNumber;

      let hitArr = allTC.map((tc) => {
        return calPointHitProbilityTimeSeries(point, tc.tracks, memberNumber);
      });
      // console.log(hitArr);
      let timeList = this.tcMeta[this.selectedIns.ins].timeRange();
      let hitTimeArr = timeList.map((iTime) => {
        let iSetArr = hitArr
          .filter((tcMap) => tcMap.has(iTime))
          .map((tcMap) => tcMap.get(iTime).member);
        let iAllMember = [];
        iSetArr.forEach((iSet) => (iAllMember = iAllMember.concat(...iSet)));
        let iUnionSet = new Set(iAllMember);
        return {
          count: iUnionSet.size,
          member: iUnionSet,
          prob: iUnionSet.size / memberNumber,
        };
      });
      return hitTimeArr;
    },
    getTcHitTimeSeries(point = { x: 153, y: 32 }) {
      const allMember = this.tcMeta[this.selectedTC.ins].enNumber;
      let hitMap = calPointHitProbilityTimeSeries(
        point,
        this.selectedTC.tracks,
        allMember
      );
      let timeList = this.tcMeta[this.selectedIns.ins].timeRange();
      let hitTimeArr = timeList.map((iTime) => {
        return {
          count: hitMap.has(iTime) ? hitMap.get(iTime).value : 0,
          member: hitMap.has(iTime) ? hitMap.get(iTime).member : new Set(),
        };
      });
      hitTimeArr.forEach((iTime) => (iTime.prob = iTime.count / allMember));
      return hitTimeArr;
    },
    /**
     * 显示袭击概率序列
     */
    showHitProSeries(city = { name: "东沙", lon: "116.83", lat: "20.68" }) {
      this.showHitTime = true;

      const point = {
        x: Number(city.lon),
        y: Number(city.lat),
      };
      const hitSeries = this.getTcHitTimeSeries(point);
      // console.log(hitSeries);

      const layout = {
        title: "热带气旋袭击概率",
        yaxis: {
          title: "Hit Probality 袭击概率%",
          range: [
            0,
            Math.max(...hitSeries.map((iHit) => iHit.prob * 100)) + 10,
          ],
          zeroline: false,
          showline: true,
          showticklabels: true,
          linecolor: "rgb(204,204,204)",
          linewidth: 2,
          ticks: "outside",
          tickcolor: "rgb(204,204,204)",
          tickwidth: 2,
          ticklen: 5,
        },
        showlegend: false,
        margin: {
          l: 60,
          r: 20,
          t: 40,
          b: 40,
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
      };
      //* 生成日期序列
      let timeRange = tcUtil.model[this.selectedTC.ins].timeRange(); //生成等差序列
      let initTime = moment(this.selectedTC.initTime);
      let TimeArr = timeRange.map((step) =>
        moment(step2time(initTime, step)).format("DD日HH时")
      );
      //*//
      const trace0 = {
        y: hitSeries.map((iHit) => iHit.prob * 100),
        x: TimeArr,
        mode: "lines+markers",
        name: "袭击概率",
        line: { shape: "spline" },
        type: "scatter",
      };
      const plotData = [trace0];
      // console.log(plotData);
      Plotly.newPlot("hit-time-series", plotData, layout, {
        displayModeBar: false,
      });
      this.hitTimeLocName = city.name;
    },
    /**
     * 显示所有台风袭击概率序列
     */
    showAllTcHitProSeries(
      city = { name: "东沙", lon: "116.83", lat: "20.68" }
    ) {
      const point = {
        x: Number(city.lon),
        y: Number(city.lat),
      };
      this.showAllHitTime = true;
      const hitSeries = this.getAllTcHitTimeSeries(point);
      // console.log(hitSeries);

      const layout = {
        title: "热带气旋综合袭击概率",
        yaxis: {
          title: "Hit Probality 袭击概率%",
          range: [
            0,
            Math.max(...hitSeries.map((iHit) => iHit.prob * 100)) + 10,
          ],
          zeroline: false,
          showline: true,
          showticklabels: true,
          linecolor: "rgb(204,204,204)",
          linewidth: 2,
          ticks: "outside",
          tickcolor: "rgb(204,204,204)",
          tickwidth: 2,
          ticklen: 5,
        },
        showlegend: false,
        margin: {
          l: 60,
          r: 20,
          t: 40,
          b: 40,
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
      };
      //* 生成日期序列
      let timeRange = tcUtil.model[this.selectedIns.ins].timeRange(); //生成等差序列
      let initTime = moment(this.selectedIns.tc[0].initTime);
      let TimeArr = timeRange.map((step) =>
        moment(step2time(initTime, step)).format("DD日HH时")
      );
      //*//
      const trace0 = {
        y: hitSeries.map((iHit) => iHit.prob * 100),
        x: TimeArr,
        mode: "lines+markers",
        name: "袭击概率",
        line: { shape: "spline" },
      };
      const plotData = [trace0];
      // console.log(plotData);
      Plotly.newPlot("alltc-hit-time-series", plotData, layout, {
        displayModeBar: false,
      });
      this.AllHitTimeLocName = city.name;
    },
    calAllTcHitCityList() {
      this.showAllTcHit = true;
      if (!this.selectedIns || !this.selectedIns.tc[0]) return []; // 没有选中则退出
      let info = JSON.parse(JSON.stringify(cityInfo));
      // console.log(info);
      const memberNumber = this.tcMeta[this.selectedIns.ins].enNumber;
      let pointList = info.map((city) => {
        return { x: city.lon, y: city.lat };
      });

      const pointsTimeList = pointList.map((point) => {
        return this.getAllTcHitTimeSeries(point);
      });
      // console.log(pointsTimeList);
      let probilityList = pointsTimeList
        .map((timeList) =>
          timeList.reduce((pV, cV) => pV.concat(...cV.member), [])
        )
        .map((memberList) => new Set(memberList).size / memberNumber);
      // console.log(calPointHitProbilityTimeSeries({x:153,y:32}, this.selectedTC.tracks, this.tcMeta[this.selectedTC.ins].enNumber));
      // console.log(probilityList);
      info.forEach((city, i) => {
        let iP = probilityList[i];
        city.hit = iP * 100;
        Object.assign(city, hitProbColor(iP));
      });
      info = info
        .filter((city) => city.hit > 0)
        .sort((pre, next) => next.hit - pre.hit);
      return (this.allTcHitCityList = info);
    },
    /**
     * 单个台风袭击概率
     */
    calHitCityList() {
      if (!this.selectedTC) return [];
      let info = JSON.parse(JSON.stringify(cityInfo));
      let pointList = info.map((city) => {
        return { x: city.lon, y: city.lat };
      });

      let probilityList = pointList.map((point) => {
        return calTChitProbility(
          point,
          this.selectedTC.tracks,
          this.tcMeta[this.selectedTC.ins].enNumber
        );
      });
      // console.log(calPointHitProbilityTimeSeries({x:153,y:32}, this.selectedTC.tracks, this.tcMeta[this.selectedTC.ins].enNumber));
      // console.log(probilityList);
      info.forEach((city, i) => {
        let iP = probilityList[i];
        city.hit = iP * 100;
        Object.assign(city, hitProbColor(iP));
      });
      info = info
        .filter((city) => city.hit > 0)
        .sort((pre, next) => next.hit - pre.hit);
      // console.log(info);
      this.hitCityList = info;
    },
    calWindRadius() {
      let info = createWindRadiusPolygon();
      // console.log(JSON.stringify(info, null, 2))
    },
  },
  watch: {
    // 箱线图容器在隐藏(display:none)时绘制宽度为0，切换显示后需重新适配尺寸
    showPressureBox(val) {
      this.$nextTick(() => {
        const target = val ? "box-pressure" : "box-speed";
        const dom = document.getElementById(target);
        if (dom && dom.data) Plotly.Plots.resize(dom);
      });
    },
  },
  computed: {
    timeLegend() {
      let legend = [
        "24h",
        "48h",
        "72h",
        "96h",
        "120h",
        "144h",
        "168h",
        "192h",
        "216h",
        "240h",
        "264h",
        "288h",
        "312h",
        "336h",
        "360h",
      ];

      if (this.selectedTC) {
        let initTime = moment(this.selectedTC.initTime);
        let timeArr = Array.from(new Array(15), (val, index) =>
          moment(initTime)
            .add((index + 1) * 24, "hours")
            .format("DD日HH时")
        );
        legend = timeArr;
      }
      return legend;
    },
  },
};
</script>

<style scoped>
.wind-radius-panel {
  display: inline-block;
  border: #91a1e1 solid 2px;
}
</style>

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

#map-overview {
  height: 700px;
  width: 90%;
  border: 1px solid black;
}

.map-div {
  display: flex;
  overflow-x: auto;
  overflow-y: visible;
  /* flex-wrap: wrap; */
}

/* 箱线图区域固定宽度，避免 v-show 隐藏时容器坍缩导致图表绘制宽度异常 */
/* 高度对齐左侧两个 map-container（各 450px + 上下边框 2px），合计 908px */
/* 三图高度精确相加 = 908：stacked-cat 288 + box-wind 310 + 底部图 310 */
.bar-div {
  flex: 0 0 auto;
  width: 700px;
  height: 908px;
  overflow: hidden;
}
.bar-div #box-wind,
.bar-div #box-speed,
.bar-div #box-pressure {
  width: 700px;
}
/* 箱线图切换区域：按钮悬浮在图上，不占用竖向空间 */
.box-plot-wrap {
  position: relative;
}
.box-switch {
  position: absolute;
  top: 4px;
  right: 8px;
  z-index: 2;
}

#map-container,
#map-container2,
#stacked-Bar,
#box-plot {
  height: 450px;
  width: 700px;
  border: 1px solid black;
}
#map-container3 {
  height: 80vh;
  width: 75vw;
  border: 1px solid black;
}
.typhoon-info {
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
.track-line-det {
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
  top: 0px;
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
  line-height: 100%;
}
.legend-wind-pro {
  right: 0px;
}
.lonlat {
  position: absolute;
  bottom: 0px;
  background: white;
}
.lonlat > div {
  display: inline;
}
.relative-container {
  position: relative;
}
.time-row button,
.tc-table button {
  margin: 0px 2px 0px 2px;
}
.tc-table .tc-ins {
  margin: 0px 0px 0px 2px;
  color: green;
}
.tc-ins .ivu-btn {
  font-size: 0.9rem;
}
.tc-ins::after {
  content: "";
  display: inline-block;
  border: 8px solid transparent;
  border-left-color: transparent;
  border-left-style: solid;
  border-left-width: 8px;
  border-left: 8px solid #afabab;
  position: relative;
  top: 2px;
  left: 5px;
}
.tc-table {
  background-color: rgb(240, 240, 250);
  border: solid green;
  padding: 3px;
  margin: 3px 2px;
}
.tc-table-time-wrap {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.tc-table-ins-wrap {
  border: 3px solid royalblue;
  margin: 5px;
  padding: 5px;
  background-color: #f4dfed;
}

/*袭击概率面板 */
.hit-pro-panel {
  width: 175px;
  max-height: 400px;
  overflow-y: auto;
}
.hit-pro-panel > div {
  padding-left: 5px;
  padding-right: 5px;
  text-align: center;
  cursor: pointer;
  font-weight: 600;
  transition: box-shadow 0.15s ease;
}
.hit-pro-panel > div:hover {
  box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.55);
}
.hit-pro-panel div span {
  color: inherit;
}
/*
#stacked-cat .hovertext > path{
    opacity:0.6;
}

.axistext {
    z-index: 9999;
}*/
#hit-time-series,
#alltc-hit-time-series {
  width: 900px;
  height: 500px;
}
.map-div .typhoon-info {
  position: relative;
}
.typhoon-info .hit-time-series-wrap {
  position: absolute;
  left: 230px;
  top: 0px;
  z-index: 1;
  background-color: cornsilk;
  box-shadow: 2px 2px 5px #333333;
}
.hit-time-series-wrap .title {
  text-align: center;
  width: 80%;
  display: inline-block;
}
</style>
