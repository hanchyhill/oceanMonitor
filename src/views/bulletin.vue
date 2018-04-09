<template>
<Row>
  <Col span="1">
   <div>&nbsp</div><!--左侧空白-->
  </Col>
  <Col span="22">

    <Row>
      <card-pic :dial="speedDial.nmcBulletin"></card-pic>
      <card-pic :dial="speedDial.gdBJTY"></card-pic>
      <card-pic :dial="speedDial.ssdBulletin"></card-pic>
      <card-pic :dial="speedDial.ssdADT"></card-pic>
      <card-pic :dial="speedDial.wiscADT"></card-pic>
    </Row>
  <h3>UNISYS报文合集</h3>
  <Row>
    <Col span="8">
      <Card style="width:200px;margin:20px">
        <p slot="title">
            <Icon type="ios-film-outline"></Icon>
            今天
        </p>
        <ul class="unisys-list unisys-button">
          <li v-for="(item, index) in todayArr" :key="index">
            <a :href="unisysUrl+item" target="_blank"><Button size="large" type="success" >{{item}}</Button></a>
          </li>
        </ul>
      </Card>
    </Col>
    <Col span="8">
      <Card style="width:200px;margin:20px">
        <p slot="title">
            <Icon type="ios-film-outline"></Icon>
            昨天
        </p>
        <ul class="unisys-list unisys-button">
          <li v-for="(item, index) in yesterArr" :key="index">
            <a :href="unisysUrl+item" target="_blank"><Button size="large" type="success" >{{item}}</Button></a>
          </li>
        </ul>
      </Card>
    </Col>
    <Col span="8">
      <Card style="width:200px;margin:20px">
        <p slot="title">
            <Icon type="ios-film-outline"></Icon>
            前天
        </p>
        <ul class="unisys-list unisys-button">
          <li v-for="(item, index) in bfYesArr" :key="index">
            <a :href="unisysUrl+item" target="_blank"><Button size="large" type="success" >{{item}}</Button></a>
          </li>
        </ul>
      </Card>
    </Col>
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
    name: 'bul-fc',
    props:{

    },
    data () {
      const today = this.getTimeString(0);
      const yesterday = this.getTimeString(-1);
      const bfYesDay = this.getTimeString(-2);
      const timeArr = ['18','12','06','00'];
      const todayArr = timeArr.map(v=>today+v);
      const yesterArr = timeArr.map(v=>yesterday+v);
      const bfYesArr = timeArr.map(v=>bfYesDay+v);
     
      return {
        speedDial:{
          ssdBulletin:{
            link:'http://www.ssd.noaa.gov/PS/TROP/bulletins.html',
            imgSrc:'/static/thumbnails/ssdBulletin.jpg',
            headInfo:'NHC/JTWC报文合集',
            head2:'NOAA / SSD',
            notes:'提供实时NHC/JTWC/CPHC报文合集',
          },
          ssdADT:{
            link:'http://www.ssd.noaa.gov/PS/TROP/adt.html',
            imgSrc:'/static/thumbnails/ssdADT.jpg',
            headInfo:'ADT分析合集',
            head2:'NOAA / SSD',
            notes:'提供实时机构ADT分析报文合集',
          },
          wiscADT:{
            link:'http://tropic.ssec.wisc.edu/real-time/adt/adt.html',
            imgSrc:'/static/thumbnails/wiscADT.jpg',
            headInfo:'WISC ADT分析',
            head2:'WISC / CMISS',
            notes:'提供实时自动ADT分析',
          },
          nmcBulletin:{
            link:'http://www.nmc.cn/publish/typhoon/message.html',
            imgSrc:'/static/thumbnails/nmcBulletin.jpg',
            headInfo:'北京报文',
            head2:'中央气象台',
            notes:'NMC北京报文',
          },
          gdBJTY:{
            link:'http://10.148.8.228/to_pros_typonmessage.action?name=bjtfdwb',
            imgSrc:'/static/thumbnails/gdBJ.jpg',
            headInfo:'北京台风定位报',
            head2:'数据中心',
            notes:'信息中心下发的台风报文',
          },
        },
        todayArr,
        yesterArr,
        bfYesArr,
        unisysUrl:'http://www.weather.unisys.com/hurricane/archive/',
      }
    },
    methods: {
      getTimeString(dayCount){
        const initTime = new Date();
        initTime.setDate(initTime.getDate() + dayCount);
        const year = initTime.getUTCFullYear().toString().slice(2);// 两位年份
        const month = (Array(2).join('0') + (initTime.getUTCMonth()+1)).slice(-2)
        const date = (Array(2).join('0') + initTime.getUTCDate()).slice(-2);
        return `${year}${month}${date}`;
      },
    },
    created(){
    },
    computed:{
    },
  };
</script>
<style scoped>
.unisys-button{
  margin:2px;
}
.unisys-button a{
  color:white;
}
.unisys-list li{
  padding:2px;
}
</style>

<style>

</style>