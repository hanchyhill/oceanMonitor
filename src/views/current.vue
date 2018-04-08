<template>
<Row>
  <Col span="1">
   <div>&nbsp</div><!--左侧空白-->
  </Col>
  <Col span="22">
    <Row>
      <card-pic :dial="speedDial.typhoonNew"></card-pic>
      <card-pic :dial="speedDial.jma"></card-pic>
      <card-pic :dial="speedDial.jtwc"></card-pic>
      <card-pic :dial="speedDial.activeTCinSSD"></card-pic>
      <card-pic :dial="speedDial.tropicaltidbits"></card-pic>
      <card-pic :dial="speedDial.colostate"></card-pic>
      <card-pic :dial="speedDial.wisc"></card-pic>
      <card-pic :dial="speedDial.digitalTY"></card-pic>
      <card-pic :dial="speedDial.nrlNavy"></card-pic>
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
    name: 'cur-ty',
    props:{

    },
    data () {
      return {
        speedDial:{
          typhoonNew:{
            link:'http://www.nmc.cn/publish/typhoon/typhoon_new.html',
            imgSrc:'/static/thumbnails/typhoonnew.jpg',
            headInfo:'台风快讯',
            head2:'中央气象台',
            notes:'',
          },
          activeTCinSSD:{
            link:'http://www.ssd.noaa.gov/PS/TROP/Basin_WestPac.html',
            imgSrc:'/static/thumbnails/SSD-active-TC.jpg',
            headInfo:'NOAA active TC',
            head2:'NOAA / SSD / TROP',
            notes:'SSD 提供当前活跃TC的报文、目标监测卫星图像以及其他相关信息',
          },
          tropicaltidbits:{
            link:'https://www.tropicaltidbits.com/storminfo/',
            imgSrc:'/static/thumbnails/tropicaltidbits.jpg',
            headInfo:'TC消息集合',
            head2:'tropicaltidbits',
            notes:'此网站是Levi Cowan的个人网站，提供各家机构的预报集合，数值预报路径，多家数值预报模式和海洋环境监测数据。',
          },
          colostate:{
            link:'http://rammb.cira.colostate.edu/products/tc_realtime/',
            imgSrc:'/static/thumbnails/colostate-tc-realtime.jpg',
            headInfo:'TC real-time',
            head2:'科罗拉多州立大学',
            notes:'由科罗拉多州立大学提供的热带气旋监测网页，提供多通道卫星、海洋热容量、数值预报、德法指数等相关监测数据。',
          },
          wisc:{
            link:'http://tropic.ssec.wisc.edu/',
            imgSrc:'/static/thumbnails/wisc-tc-real-time.jpg',
            headInfo:'CIMSS realtime',
            head2:'威斯康星大学',
            notes:'由CIMSS热带气旋小组提供的热带气旋环境分析和监测页面',
          },
          jma:{
            link:'http://www.jma.go.jp/en/typh/',
            imgSrc:'/static/thumbnails/jma-tc.jpg',
            headInfo:'热带气旋消息',
            head2:'日本气象厅',
            notes:'负责有关世界气象组织对国际换日线以西的北太平洋洋面上生成的热带气旋达热带风暴或以上级别给予国际编号及命名工作。',
          },
          jtwc:{
            link:'http://www.metoc.navy.mil/jtwc/jtwc.html',
            imgSrc:'/static/thumbnails/jtwc.jpg',
            headInfo:'JTWC',
            head2:'联合台风警报中心',
            notes:'美国海军位于夏威夷珍珠港的海军太平洋气象及海洋中心。该中心负责为太平洋、印度洋等海域的热带气旋发出警报。',
          },
          digitalTY:{
            link:'http://agora.ex.nii.ac.jp/digital-typhoon/',
            imgSrc:'/static/thumbnails/digitalTY.jpg',
            headInfo:'digital typhoon',
            head2:'数字台风网',
            notes:'提供当前和历史台风卫星云图数据',
          },
          nrlNavy:{
            link:'https://www.nrlmry.navy.mil/TC.html',
            imgSrc:'/static/thumbnails/nrl.jpg',
            headInfo:'NRL TC',
            head2:'美国海军热带气旋监测',
            notes:`It's blocked`,
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