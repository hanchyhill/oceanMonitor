<template>
<Row>
  <Col span="1">
   <div>&nbsp</div>
  </Col>
  <Col span="22">
    <h2>环境分析</h2>
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
    
  </Col>
  
  <Col span="1"><!--右侧空白-->
  <div>&nbsp</div>
  </Col>
</Row>
</template>
<script>
  export default {
    name: 'env-analysis',
    props:{

    },
    data () {
      return {
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