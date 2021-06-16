<template>
<Row>
  <Col span="1">
   <div>&nbsp;</div><!--左侧空白-->
  </Col>
  <Col span="22">
    <!--<iframe class="fy4-iframe" height="900px" width="100%" src="http://10.148.114.72:4000/satelliteview"></iframe>-->
    <Row>
      <card-pic :dial="speedDial.fy4Direct"></card-pic>
      <card-pic :dial="speedDial.zoomEarth"></card-pic>
      <card-pic :dial="speedDial.swap2"></card-pic>
      <card-pic :dial="speedDial.colSlider"></card-pic>
      <card-pic :dial="speedDial.colTropics"></card-pic>
      <!-- <card-pic :dial="speedDial.nictHim8"></card-pic> -->
      <card-pic :dial="speedDial.jmaSat"></card-pic>
      <card-pic :dial="speedDial.h8target"></card-pic>
      <card-pic :dial="speedDial.gdSat"></card-pic>
    </Row>

    <h2>WISC CIMSS</h2>
    <Tabs type="card">
      <TabPane v-for="(item, index) of wiscSat" :key="index" :label="item.name">
        <img :src="item.src" :alt="item.name" width="70%">
      </TabPane>
    </Tabs>

    <h2>NOAA 卫星产品与服务中心</h2>
    <Tabs type="card">
      <TabPane v-for="(item, index) of ssdSat" :key="index" :label="item.name">
        <a :href="item.anchorUrl" rel="nofollow noopener noreferrer" target="_blank">
        <img :src="item.src" :alt="item.name">
        </a>
      </TabPane>
    </Tabs>

    <h2>极轨卫星</h2>
    <Tabs type="card">
      <TabPane v-for="(item, index) of polarSat" :key="index" :label="item.name">
        <a :href="item.anchorUrl" rel="nofollow noopener noreferrer" target="_blank">
        <img :src="item.src" :alt="item.name">
        </a>
      </TabPane>
    </Tabs>

    <h2>科罗拉多州立大学</h2>
    <Tabs type="card">
      <TabPane v-for="(item, index) of coloSat" :key="index" :label="item.name">
        <a :href="item.anchorUrl" rel="nofollow noopener noreferrer" target="_blank">
        <img :src="item.src" :alt="item.name">
        </a>
      </TabPane>
    </Tabs>
  </Col>
  <Col span="1"><!--右侧空白-->
  <div>&nbsp;</div>
  </Col>
</Row>
</template>
<script>
  import CardPic from './comps/cardPic.vue';
  import {satSrc} from '../config/srcConfig.js';

  export default {
    components:{CardPic,},
    name: 'sat-img',
    props:{

    },
    data () {
      return {
        speedDial: satSrc.speedDial,
        sourceFrom:'local',//origin
      }
    },
    methods: {
    },
    created(){
    },
    computed:{
      wiscSat(){
        return satSrc.tab.wiscSat.map(item=>{
          item.src = item[this.sourceFrom];
          return item;
        });
      },
      ssdSat(){
        return satSrc.tab.ssdSat.map(item=>{
          item.src = item[this.sourceFrom];
          return item;
        });
      },
      polarSat(){
        return satSrc.tab.polarSat.map(item=>{
          item.src = item[this.sourceFrom];
          return item;
        });
      },
      coloSat(){
        return satSrc.tab.coloSat.map(item=>{
          item.src = item[this.sourceFrom];
          return item;
        });
      },
    },
  };
</script>
<style scoped>
.fy4-iframe{
  margin-top:10px;
}
</style>

<style>

</style>