<template>
<Row>
  <Col span="1">
   <div>&nbsp</div>
  </Col>
  <Col span="22">
    <Row>
    <card-pic :dial="speedDial.steer"></card-pic>
    <card-pic :dial="speedDial.oceanHeatContent"></card-pic>
    <card-pic :dial="speedDial.cyclonephase"></card-pic>
    <card-pic :dial="speedDial.mtcswa"></card-pic>
    <card-pic :dial="speedDial.eTRaP"></card-pic>
    </Row>

    <h3>海温 & 浪高</h3>
    <Tabs type="card">
      <TabPane v-for="(item, index) of sst" :key="index" :label="item.name">
        <img :src="item.origin" :alt="item.name">
      </TabPane>
    </Tabs>
    
    <h3>WISC 环境场分析</h3>
    <Tabs type="card">
      <TabPane v-for="(item, index) of wiscEnv" :key="index" :label="item.name">
        <img :src="item.origin" :alt="item.name">
      </TabPane>
    </Tabs>
    
    <h3>生成概率 & 潜在强度</h3>
    <Tabs type="card">
      <TabPane v-for="(item, index) of probability" :key="index" :label="item.name">
        <img :src="item.origin" :alt="item.name">
      </TabPane>
    </Tabs>
    <h3>JTWC热带气旋警报图</h3>
    <img :src="jtwcImg.origin" :alt="jtwcImg.name" width="80%">
  
    <br>
    <h3>ASCAT风场扫描</h3>
  </Col>
  
  <Col span="1"><!--右侧空白-->
  <div>&nbsp</div>
  </Col>
</Row>
</template>
<script>
  import CardPic from './comps/cardPic.vue';
  import {envSrc} from '../config/srcConfig.js';
  
  export default {
    name: 'env-analysis',
    components:{CardPic,},
    props:{

    },
    data () {
      return {
        speedDial: envSrc.speedDial,
        sst: envSrc.tab.sst,
        wiscEnv: envSrc.tab.wiscEnv,
        probability: envSrc.tab.probability,
        jtwcImg: envSrc.imgs.jtwc,
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