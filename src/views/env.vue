<template>
  <Row>
    <Col span="1">
      <div>&nbsp;</div>
    </Col>
    <Col span="22">
      <Row>
        <card-pic :dial="speedDial.steer"></card-pic>
        <card-pic :dial="speedDial.oceanHeatContent"></card-pic>
        <card-pic :dial="speedDial.cyclonephase"></card-pic>
        <card-pic :dial="speedDial.mtcswa"></card-pic>
        <card-pic :dial="speedDial.eTRaP"></card-pic>
      </Row>
      <h2 id="sst">海温 & 浪高</h2>
      <Tabs class="tabs-style" type="card" :animated="false">
        <TabPane v-for="(item, index) of sst" :key="index" :label="item.name">
          <a :href="item.origin" target="_blank">
            <img :src="item.src" :alt="item.name" />
          </a>
        </TabPane>
      </Tabs>

      <h2 id="wisc">WISC 环境场分析</h2>
      <Tabs type="card" :animated="false">
        <TabPane
          v-for="(item, index) of wiscEnv"
          :key="index"
          :label="item.name"
        >
          <a :href="item.origin" target="_blank">
            <img :src="item.src" :alt="item.name" />
          </a>
        </TabPane>
      </Tabs>

      <h2 id="wisc-steer">
        <a
          href="http://tropic.ssec.wisc.edu/real-time/dlmmain.php?&basin=westpac&sat=wgms&prod=dlm2&zoom=&time="
          target="_blank"
        >
          WISC 引导气流
        </a>
      </h2>
      <Tabs type="card" :animated="false">
        <TabPane
          v-for="(item, index) of wiscSteer"
          :key="index"
          :label="item.name"
        >
          <div>{{ item.note }}</div>
          <img :src="item.src" :alt="item.name" />
        </TabPane>
      </Tabs>

      <h2 id="tcfp">
        <a
          href="http://www.ssd.noaa.gov/PS/TROP/TCFP/west_pacific.html"
          target="_blank"
        >
          生成概率 & 潜在强度
        </a>
      </h2>
      <h3>ECMWF 集合预报概率</h3>
      <ec-pro></ec-pro>
      <h3>NCEP热带气旋概率</h3>
      <Tabs type="card" :animated="false">
        <TabPane
          v-for="(item, index) of probability"
          :key="index"
          :label="item.name"
        >
          <img :src="item.src" :alt="item.name" />
        </TabPane>
      </Tabs>
      <h2 id="climate">热带天气/短期气候分析</h2>
      <Tabs type="card" :animated="false">
        <TabPane label="JTWC热带气旋警报图">
          <a :href="jtwcImg.origin" target="_blank">
            <img :src="jtwcImg.src" :alt="jtwcImg.name" width="80%" />
          </a>
        </TabPane>
        <TabPane label="日本天气图">
          <Tabs value="obs" :animated="false">
            <TabPane label="实况" name="obs">
              <object
                type="application/pdf"
                data="/static/remote-img/env/ASAS_COLOR.pdf"
                width="989"
                height="700"
              ></object>
            </TabPane>
            <TabPane label="24H预报" name="name2">
              <object
                type="application/pdf"
                data="/static/remote-img/env/FSAS24_COLOR_ASIA.pdf"
                width="989"
                height="700"
              ></object>
            </TabPane>
            <TabPane label="48H预报" name="name3">
              <object
                type="application/pdf"
                data="/static/remote-img/env/FSAS48_COLOR_ASIA.pdf"
                width="989"
                height="700"
              ></object>
            </TabPane>
          </Tabs>
        </TabPane>
        <TabPane label="热带卫星天气分析">
          <a :href="phSatAnalysis.origin" target="_blank">
            <img
              :src="phSatAnalysis.src"
              :alt="phSatAnalysis.name"
              width="80%"
            />
          </a>
        </TabPane>
        <TabPane label="2周热带气候展望">
          <a :href="tropicOutlook.origin" target="_blank">
            <img
              :src="tropicOutlook.src"
              :alt="tropicOutlook.name"
              width="80%"
            />
          </a>
        </TabPane>
        <TabPane v-for="(item, index) of mjo" :key="index" :label="item.name">
          <img :src="item.src" :alt="item.name" />
        </TabPane>

        <!--       <TabPane label="热带季内振荡(MJO)">
        <Tabs type="card" :animated="false">
          <TabPane v-for="(item, index) of mjo" :key="index" :label="item.name">
          <img :src="item.src" :alt="item.name">
          </TabPane>
        </Tabs>
      </TabPane> -->
        <!-- <TabPane label="南海夏季风爆发指数">
        <a :href="scs2idx.origin"  target="_blank">
          <img :src="scs2idx.src" :alt="scs2idx.name" width="80%">
        </a>
      </TabPane> -->
      </Tabs>

      <h2 id="ascat">ASCAT风场扫描</h2>
      <Tabs type="card" :animated="false">
        <TabPane label="上升A">
          <ascat-view :imgList="ascat.ascend"></ascat-view>
        </TabPane>
        <TabPane label="下降A">
          <ascat-view :imgList="ascat.descend"></ascat-view>
        </TabPane>
        <TabPane label="上升B">
          <ascat-view :imgList="ascat.ascendB"></ascat-view>
        </TabPane>
        <TabPane label="下降B">
          <ascat-view :imgList="ascat.descendB"></ascat-view>
        </TabPane>
      </Tabs>
    </Col>

    <Col span="1"
      ><!--右侧空白-->
      <div>&nbsp;</div>
    </Col>
  </Row>
</template>
<script>
import AscatView from "./comps/ascatView.vue";
import { envSrc, ascatImg } from "../config/srcConfig.js";
import CardPic from "./comps/cardPic.vue";
import EcPro from "./comps/ecPro.vue";
export default {
  name: "env-analysis",
  components: { CardPic, AscatView, EcPro },
  props: {},
  data() {
    return {
      speedDial: envSrc.speedDial,
      sourceFrom: "local", //origin
    };
  },
  methods: {},
  created() {},
  computed: {
    sst() {
      return envSrc.tab.sst.map((item) => {
        item.src = item[this.sourceFrom];
        return item;
      });
    },
    wiscEnv() {
      return envSrc.tab.wiscEnv.map((item) => {
        item.src = item[this.sourceFrom];
        return item;
      });
    },
    wiscSteer() {
      return envSrc.tab.wiscSteer.map((item) => {
        item.src = item[this.sourceFrom];
        return item;
      });
    },
    probability() {
      return envSrc.tab.probability.map((item) => {
        item.src = item[this.sourceFrom];
        return item;
      });
    },
    mjo() {
      return envSrc.tab.mjo.map((item) => {
        item.src = item[this.sourceFrom];
        return item;
      });
    },
    jtwcImg() {
      envSrc.imgs.jtwc.src = envSrc.imgs.jtwc[this.sourceFrom];
      return envSrc.imgs.jtwc;
    },
    tropicOutlook() {
      envSrc.imgs.tropicOutlook.src =
        envSrc.imgs.tropicOutlook[this.sourceFrom];
      return envSrc.imgs.tropicOutlook;
    },
    phSatAnalysis() {
      envSrc.imgs.phSatAnalysis.src =
        envSrc.imgs.phSatAnalysis[this.sourceFrom];
      return envSrc.imgs.phSatAnalysis;
    },
    scs2idx() {
      envSrc.imgs.scs2idx.src = envSrc.imgs.scs2idx[this.sourceFrom];
      return envSrc.imgs.scs2idx;
    },
    ascat() {
      ascatImg.descend.forEach((list) =>
        list.forEach((v) => (v.src = v[this.sourceFrom]))
      );
      ascatImg.ascend.forEach((list) =>
        list.forEach((v) => (v.src = v[this.sourceFrom]))
      );
      ascatImg.descendB.forEach((list) =>
        list.forEach((v) => (v.src = v[this.sourceFrom]))
      );
      ascatImg.ascendB.forEach((list) =>
        list.forEach((v) => (v.src = v[this.sourceFrom]))
      );
      // console.log(ascatImg);
      return ascatImg;
    },
  },
};
</script>
<style scoped>
</style>

<style>
</style>