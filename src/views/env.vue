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
      <TabPane label="西太海温"><img src="https://www.tropicaltidbits.com/analysis/ocean/cdas-sflux_sst_wpac_1.png"></TabPane>
      <TabPane label="海温距平"><img src="https://www.tropicaltidbits.com/analysis/ocean/cdas-sflux_ssta_wpac_1.png"></TabPane>
      <TabPane label="全球海温距平"><img src="https://www.tropicaltidbits.com/analysis/ocean/cdas-sflux_ssta_global_1.png"></TabPane>
      <TabPane label="南海浪高"><img src="http://www.oceanweather.com/data/South-China-Sea/WAVE000.GIF"></TabPane>
      <TabPane label="西太浪高"><img src="http://www.oceanweather.com/data/NPAC-Western/WAVE000.GIF"></TabPane>
    </Tabs>
    <!--
      <h3>OceanWeather</h3>
    <Tabs type="card">
      <TabPane label="西太浪高"><img src="http://www.oceanweather.com/data/NPAC-Western/WAVE000.GIF"></TabPane>
      <TabPane label="南海浪高"><img src="http://www.oceanweather.com/data/South-China-Sea/WAVE000.GIF"></TabPane>
      <TabPane label="西太海温"><img src="http://www.oceanweather.com/data/NPAC-Western/SST.GIF"></TabPane>
      <TabPane label="南海海温"><img src="http://www.oceanweather.com/data/South-China-Sea/SST.GIF"></TabPane>
    </Tabs>
    -->
    <h3>WISC 环境场分析</h3>
    <Tabs type="card">
      <TabPane label="低层涡度"><img src="http://tropic.ssec.wisc.edu/real-time/westpac/winds/wgmsvor.GIF"></TabPane>
      <TabPane label="低层辐合"><img src="http://tropic.ssec.wisc.edu/real-time/westpac/winds/wgmsconv.GIF"></TabPane>
      <TabPane label="高空辐散"><img src="http://tropic.ssec.wisc.edu/real-time/westpac/winds/wgmsdvg.GIF"></TabPane>
      <TabPane label="垂直风切"><img src="http://tropic.ssec.wisc.edu/real-time/westpac/winds/wgmsshr.GIF"></TabPane>
      <TabPane label="风切趋势"><img src="http://tropic.ssec.wisc.edu/real-time/westpac/winds/wgmssht.GIF"></TabPane>
      <TabPane label="高空风反演"><img src="http://tropic.ssec.wisc.edu/real-time/westpac/winds/wgmswv.GIF"></TabPane>
      <TabPane label="中低层风反演"><img src="http://tropic.ssec.wisc.edu/real-time/westpac/winds/wgmsir.GIF"></TabPane>
    </Tabs>
    
    <h3>生成概率 & 潜在强度</h3>
    <Tabs type="card">
      <TabPane label="0-48h 生成概率"><img src="http://www.ssd.noaa.gov/PS/TROP/TCFP/data/current/wp_rCUMP_048.gif"></TabPane>
      <TabPane label="0-24h 生成概率"><img src="http://www.ssd.noaa.gov/PS/TROP/TCFP/data/current/wp_rTCFP_024.gif"></TabPane>
      <TabPane label="24-48h 生成概率"><img src="http://www.ssd.noaa.gov/PS/TROP/TCFP/data/current/wp_rTCFP_048.gif"></TabPane>
      <TabPane label="最大潜在强度"><img src="http://wxmaps.org/pix/wpacpot.png"></TabPane>
    </Tabs>
    <h3>JTWC热带气旋警报图</h3>
    <img src="http://www.metoc.navy.mil/jtwc/products/abpwsair.jpg" width="80%">
    
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
  export default {
    name: 'env-analysis',
    components:{CardPic,},
    props:{

    },
    data () {
      return {
        speedDial:{
          /**
          speedDial数据
           */
          steer:{
            link:'http://tropic.ssec.wisc.edu/real-time/dlmmain.php?&basin=westpac&sat=wgms&prod=dlm2&zoom=&time=',
            imgSrc:'/static/thumbnails/steerStream.jpg',
            headInfo:'引导气流',
            head2:'WISC',
            notes:'根据热带气旋强度选择平均引导流，引导气流可以指示热带气旋的移动方向。',
          },
          oceanHeatContent:{
            link:'http://www.aoml.noaa.gov/phod/cyclone/data/np.html',
            imgSrc:'/static/thumbnails/ohc.jpg',
            headInfo:'海洋热容量',
            head2:'NOAA / AOML',
            notes:'海洋上层的热力结构是热带气旋与海洋相互作用中的关节要素，对热带气旋的加强起着重要作用。',
          },
          cyclonephase:{
            link:'http://moe.met.fsu.edu/cyclonephase/',
            imgSrc:'/static/thumbnails/cyclonephase.jpg',
            headInfo:'气旋变性分析',
            head2:'moe.met.fsu.edu',
            notes:'本页面提供当前和历史数据中北半球气旋相位图。',
          },
          mtcswa:{
            link:'http://www.ssd.noaa.gov/PS/TROP/mtcswa.html',
            imgSrc:'/static/thumbnails/mtcswa.jpg',
            headInfo:'融合地面风反演',
            head2:'NOAA / MTCSWA',
            notes:'由多部卫星探测器融合反演当前台风的地面风场。',
          },
          eTRaP:{
            link:'http://www.ssd.noaa.gov/PS/TROP/etrap.html',
            imgSrc:'/static/thumbnails/eTRaP.jpg',
            headInfo:'集合热带降水估测',
            head2:'NOAA / eTRaP',
            notes:'由多部卫星微波探测器和数值预报估测热带降水。',
          },
        }
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