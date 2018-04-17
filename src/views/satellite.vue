<template>
<Row>
  <Col span="1">
   <div>&nbsp</div><!--左侧空白-->
  </Col>
  <Col span="22">
    <Row>
      <card-pic :dial="speedDial.colSlider"></card-pic>
      <card-pic :dial="speedDial.colTropics"></card-pic>
      <card-pic :dial="speedDial.nictHim8"></card-pic>
      <card-pic :dial="speedDial.jmaSat"></card-pic>
      <card-pic :dial="speedDial.fy4"></card-pic>
      <card-pic :dial="speedDial.gdWeb"></card-pic>
      <card-pic :dial="speedDial.gdSat"></card-pic>
    </Row>

    <h3>WISC CIMSS</h3>
    <Tabs type="card">
      <TabPane v-for="(item, index) of wiscSat" :key="index" :label="item.name">
        <img :src="item.origin" :alt="item.name" width="70%">
      </TabPane>
    </Tabs>

    <h3>NOAA 卫星产品与服务中心</h3>
    <Tabs type="card">
      <TabPane v-for="(item, index) of ssdSat" :key="index" :label="item.name">
        <a :href="item.anchorUrl" rel="nofollow noopener noreferrer" target="_blank">
        <img :src="item.origin" :alt="item.name">
        </a>
      </TabPane>
    </Tabs>

    <h3>极轨卫星</h3>
    <Tabs type="card">
      <TabPane v-for="(item, index) of polarSat" :key="index" :label="item.name">
        <a :href="item.anchorUrl" rel="nofollow noopener noreferrer" target="_blank">
        <img :src="item.origin" :alt="item.name">
        </a>
      </TabPane>
    </Tabs>

    <h3>科罗拉多州立大学</h3>
    <Tabs type="card">
      <TabPane v-for="(item, index) of coloSat" :key="index" :label="item.name">
        <a :href="item.anchorUrl" rel="nofollow noopener noreferrer" target="_blank">
        <img :src="item.origin" :alt="item.name">
        </a>
      </TabPane>
    </Tabs>
  </Col>
  <Col span="1"><!--右侧空白-->
  <div>&nbsp</div>
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
        wiscSat: satSrc.tab.wiscSat,
        ssdSat: satSrc.tab.ssdSat,
        polarSat: satSrc.tab.polarSat,
        coloSat: satSrc.tab.coloSat,
      }
    },
    methods: {
    },
    created(){
    },
    computed:{
    },
  };
</script>
<style scoped>

</style>

<style>

</style>