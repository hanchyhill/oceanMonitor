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
        <img :src="item.src" :alt="item.name">
      </TabPane>
    </Tabs>
    
    <h3>WISC 环境场分析</h3>
    <Tabs type="card">
      <TabPane v-for="(item, index) of wiscEnv" :key="index" :label="item.name">
        <img :src="item.src" :alt="item.name">
      </TabPane>
    </Tabs>
    
    <h3>生成概率 & 潜在强度</h3>
    <Tabs type="card">
      <TabPane v-for="(item, index) of probability" :key="index" :label="item.name">
        <img :src="item.src" :alt="item.name">
      </TabPane>
    </Tabs>
    <h3>JTWC热带气旋警报图</h3>
    <img :src="jtwcImg.src" :alt="jtwcImg.name" width="80%">
  
    <br>
    <h3>ASCAT风场扫描</h3>
    <Tabs type="card">
      <TabPane label="上升">
        <ascat-view :imgList="ascat.ascend"></ascat-view>
      </TabPane>
      <TabPane label="下降">
        <ascat-view :imgList="ascat.descend"></ascat-view>
      </TabPane>
    </Tabs>
    
  </Col>
  
  <Col span="1"><!--右侧空白-->
  <div>&nbsp</div>
  </Col>
</Row>
</template>
<script>
  import AscatView from './comps/ascatView.vue';
  import {envSrc, ascatImg} from '../config/srcConfig.js';
  import CardPic from './comps/cardPic.vue';
  
  export default {
    name: 'env-analysis',
    components:{CardPic, AscatView},
    props:{

    },
    data () {
      return {
        speedDial: envSrc.speedDial,
        sourceFrom:'local',//origin
      }
    },
    methods: {
    },
    created(){
    },
    computed:{
      sst(){
        return envSrc.tab.sst.map(item=>{
          item.src = item[this.sourceFrom];
          return item;
        });
      },
      wiscEnv(){
        return envSrc.tab.wiscEnv.map(item=>{
          item.src = item[this.sourceFrom];
          return item;
        })
      },
      probability(){
        return envSrc.tab.probability.map(item=>{
          item.src = item[this.sourceFrom];
          return item;
        })
      },
      jtwcImg(){
        envSrc.imgs.jtwc.src = envSrc.imgs.jtwc[this.sourceFrom];
        return envSrc.imgs.jtwc;
      },
      ascat(){
        ascatImg.descend.forEach(list => 
          list.forEach(v=>v.src = v[this.sourceFrom])
        );
        ascatImg.ascend.forEach(list => 
          list.forEach(v=>v.src = v[this.sourceFrom])
        );
        // console.log(ascatImg);
        return ascatImg;
      }
    },
  };
</script>
<style scoped>

</style>

<style>

</style>