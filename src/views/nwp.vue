<template>
<Row>
  <Col span="1">
   <div>&nbsp</div><!--左侧空白-->
  </Col>
  <Col span="22">
    <Row>
      <card-pic :dial="speedDial.typhoon2000"></card-pic>
      <card-pic :dial="speedDial.ruc"></card-pic>
      <card-pic :dial="speedDial.emc"></card-pic>
      <card-pic :dial="speedDial.gd121"></card-pic>
    </Row>

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
    name: 'nwp-track',
    props:{

    },
    data () {
      return {
        speedDial:{
          typhoon2000:{
            link:'http://www.typhoon2000.ph/multi/models.php',
            imgSrc:'/static/thumbnails/typhoon2000.jpg',
            headInfo:'模式/机构路径集合',
            head2:'typhoon2000',
            notes:'提供多家数值模式路径，历史台风机构预报路径合集',
          },
          ruc:{
            link:'https://ruc.noaa.gov/hfip/tceps/',
            imgSrc:'/static/thumbnails/ruc-tceps.jpg',
            headInfo:'模式集合预报',
            head2:'NOAA / RUC tceps',
            notes:'提供NCEP、EC、UKMO等集合预报路径',
          },
          emc:{
            link:'http://www.emc.ncep.noaa.gov/gmb/tpm/emchurr/tcgen/',
            imgSrc:'/static/thumbnails/emc-tc-track.jpg',
            headInfo:'气旋生成与追踪',
            head2:'NCEP / EMC',
            notes:'提供气旋生成和追踪监测',
          },
          gd121:{
            link:'http://www.gd12121.com:8080/special/typhoonpattern/page/typhoonpattern.asp',
            imgSrc:'/static/thumbnails/gd12121.jpg',
            headInfo:'EC集合预报',
            head2:'广东12121',
            notes:'提供EC集合预报相关产品',
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