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
      <TabPane label="BD色阶"><img src="http://tropic.ssec.wisc.edu/real-time/westpac/images/irbdgms5kml.GIF" width="70%"></TabPane>
      <TabPane label="红外"><img src="http://tropic.ssec.wisc.edu/real-time/westpac/images/kml/yyirgms5.GIF" width="70%"></TabPane>
      <TabPane label="NHC色阶"><img src="http://tropic.ssec.wisc.edu/real-time/westpac/images/kml/yyirgms5n.GIF" width="70%"></TabPane>
      <TabPane label="水汽"><img src="http://tropic.ssec.wisc.edu/real-time/westpac/images/kml/yywvgms5.GIF" width="70%"></TabPane>
    </Tabs>
    <h3>NOAA 卫星产品与服务中心</h3>
    <Tabs type="card">
      <TabPane label="him8可见光">
        <a target="_blank" href="http://www.ssd.noaa.gov/jma/twpac/h5-loop-vis.html" >
        <img src="http://www.ssd.noaa.gov/jma/twpac/vis-l.gif">
        </a>
      </TabPane>
      <TabPane label="him8-ir2">
        <a target="_blank" href="http://www.ssd.noaa.gov/jma/twpac/h5-loop-ir2.html" >
        <img src="http://www.ssd.noaa.gov/jma/twpac/ir2-l.gif">
        </a>
      </TabPane>
      <TabPane label="him8-水汽-ir3">
        <a target="_blank" href="http://www.ssd.noaa.gov/jma/twpac/h5-loop-wv.html" >
        <img src="http://www.ssd.noaa.gov/jma/twpac/wv-l.gif">
        </a>
      </TabPane>
      <TabPane label="him8-ir4">
        <a target="_blank" href="http://www.ssd.noaa.gov/jma/twpac/h5-loop-ir4.html" >
        <img src="http://www.ssd.noaa.gov/jma/twpac/ir4-l.gif">
        </a>
      </TabPane>
      <TabPane label="ir4-BD色阶">
        <a target="_blank" href="http://www.ssd.noaa.gov/jma/twpac/h5-loop-bd.html" >
        <img src="http://www.ssd.noaa.gov/jma/twpac/bd-l.gif">
        </a>
      </TabPane>
      <TabPane label="ir4-Rainbow">
        <a target="_blank" href="http://www.ssd.noaa.gov/jma/twpac/h5-loop-rb.html" >
        <img src="http://www.ssd.noaa.gov/jma/twpac/rb-l.gif">
        </a>
      </TabPane>
      <TabPane label="ir4-AVN">
        <a target="_blank" href="http://www.ssd.noaa.gov/jma/twpac/h5-loop-avn.html" >
        <img src="http://www.ssd.noaa.gov/jma/twpac/avn-l.gif">
        </a>
      </TabPane>
      <TabPane label="RGB">
        <a target="_blank" href="http://www.ssd.noaa.gov/jma/twpac/h5-loop-rgb.html" >
        <img src="http://www.ssd.noaa.gov/jma/twpac/rgb-l.jpg">
        </a>
      </TabPane>
    </Tabs>
    <h3>极轨卫星</h3>
    <Tabs type="card">
      <TabPane label="DMSP-85GHz">
        <a target="_blank" href="http://www.ssd.noaa.gov/poes/twpac/h5-loop-ss85.html" >
        <img src="http://www.ssd.noaa.gov/poes/twpac/ss85-l.jpg">
        </a>
      </TabPane>
      <TabPane label="DMSP-地面风">
        <a target="_blank" href="http://www.ssd.noaa.gov/poes/twpac/h5-loop-sswd.html" >
        <img src="http://www.ssd.noaa.gov/poes/twpac/sswd-l.jpg">
        </a>
      </TabPane>
      <TabPane label="AMSU-89GHz">
        <a target="_blank" href="http://www.ssd.noaa.gov/poes/twpac/h5-loop-am89.html" >
        <img src="http://www.ssd.noaa.gov/poes/twpac/am89-l.jpg">
        </a>
      </TabPane>
    </Tabs>
    <h3>科罗拉多州立大学</h3>
    <Tabs type="card">
      <TabPane label="可见光">
        <a href="http://rammb.cira.colostate.edu/ramsdis/online/loop.asp?data_folder=himawari-8/tropics_band_03&width=1020&height=720&number_of_images_to_display=24" target="_blank">
        <img src="http://rammb.cira.colostate.edu/ramsdis/online/images/latest/himawari-8/tropics_band_03.gif">
        </a>
      </TabPane>
      <TabPane label="Band 7 (3.9 µm)">
        <a href="http://rammb.cira.colostate.edu/ramsdis/online/loop.asp?data_folder=himawari-8/himawari-8_band_07_sector_06&width=1020&height=720&number_of_images_to_display=24" target="_blank">
        <img src="http://rammb.cira.colostate.edu/ramsdis/online/images/latest/himawari-8/himawari-8_band_07_sector_06.gif">
        </a>
      </TabPane>
      <TabPane label="Band 8 (6.2 µm)">
        <a href="http://rammb.cira.colostate.edu/ramsdis/online/loop.asp?data_folder=himawari-8/tropics_band_08&width=1020&height=720&number_of_images_to_display=24" target="_blank">
        <img src="http://rammb.cira.colostate.edu/ramsdis/online/images/latest/himawari-8/tropics_band_08.gif">
        </a>
      </TabPane>
      <TabPane label="Band 13 (10.4 µm)">
        <a href="http://rammb.cira.colostate.edu/ramsdis/online/loop.asp?data_folder=himawari-8/himawari-8_band_13_sector_06&width=1020&height=720&number_of_images_to_display=24" target="_blank">
        <img src="http://rammb.cira.colostate.edu/ramsdis/online/images/latest/himawari-8/himawari-8_band_13_sector_06.gif">
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
  export default {
    components:{CardPic,},
    name: 'sat-img',
    props:{

    },
    data () {
      return {
        speedDial:{
          colSlider:{
            link:'http://col.st/t8E3d',
            imgSrc:'/static/thumbnails/col-slider.jpg',
            headInfo:'交互式圆盘图',
            head2:'科罗拉多州立大学',
            notes:'提供葵花、GOES系列卫星的交互式多通道卫星图像',
          },
          colTropics:{
            link:'http://rammb.cira.colostate.edu/ramsdis/online/himawari-8.asp#Tropics',
            imgSrc:'/static/thumbnails/col-tropics-sat.jpg',
            headInfo:'himawari8 热带',
            head2:'科罗拉多州立大学',
            notes:'提供葵花卫星的图像',
          },
          nictHim8:{
            link:'https://himawari8.nict.go.jp/',
            imgSrc:'/static/thumbnails/nict.jpg',
            headInfo:'葵花8即时图像',
            head2:'NICT',
            notes:'提供葵花卫星的实时图像',
          },
          jmaSat:{
            link:'http://www.data.jma.go.jp/mscweb/data/himawari/sat_img.php?area=se2',
            imgSrc:'/static/thumbnails/jma-sat.jpg',
            headInfo:'葵花8多通道图像',
            head2:'日本气象厅',
            notes:'提供葵花8多通道和多通道融合图像',
          },
          fy4:{
            link:'http://fy4.nsmc.org.cn/nsmc/cn/image/animation.html',
            imgSrc:'/static/thumbnails/fy4.jpg',
            headInfo:'风云4号卫星云图',
            head2:'国家卫星气象中心',
            notes:'提供风云4多通道及二级产品图像',
          },
          gdWeb:{
            link:'http://10.148.8.228/to_live_home.action?name=xfy2g',
            imgSrc:'/static/thumbnails/gd-web.jpg',
            headInfo:'业务网卫星图像',
            head2:'生态中心',
            notes:'提供风云、葵花系列卫星云图',
          },
          gdSat:{
            link:'http://10.12.12.211/satellite/',
            imgSrc:'/static/thumbnails/gd-sat.jpg',
            headInfo:'华南区域卫星遥感',
            head2:'生态中心',
            notes:'提供风云、葵花系列卫星云图',
          },
        },
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