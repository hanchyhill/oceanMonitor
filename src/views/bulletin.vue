<template>
<Row>
  <Col span="1">
   <div>&nbsp;</div><!--左侧空白-->
  </Col>
  <Col span="22">
    <Row>
      <card-pic :dial="speedDial.typhoonNew"></card-pic>
      <card-pic :dial="speedDial.nmcBulletin"></card-pic>
      <card-pic :dial="speedDial.jma"></card-pic>
      <card-pic :dial="speedDial.jtwc"></card-pic>
      <card-pic :dial="speedDial.gdBJTY"></card-pic>
      <card-pic :dial="speedDial.ssdBulletin"></card-pic>
      <card-pic :dial="speedDial.ssdADT"></card-pic>
      <card-pic :dial="speedDial.wiscADT"></card-pic>
    </Row>
  <h3>机构热带气旋报文集</h3>
  <div class="bulletin-flex">
  <Card style="width:400px;margin:20px">
    <p slot="title" style="height:auto;">
      <a href="http://tgftp.nws.noaa.gov/data/raw/wt/?C=M;O=D" target="_blank">
        <Button size="large" type="success">Warning text 台风警报/预报报文</Button>
      </a>
    </p>
    <p class="p-title">报文说明</p>
      <ul class="card-list card-button">
        <li>wtpq**.babj 中国中央气象台</li>
        <li>wtpq**.rjtd 日本气象厅热带气旋通报</li>
        <li>wtjp**.rjtd 日本气象厅天气警报</li>
        <li>wtpn**.pgtw 美国联合台风预警中心</li>
        <li>wtss**.vhhh 香港天文台</li>
        <li>wtko**.rksl 韩国气象局</li>
        <li>wtph**.rpmm 菲律宾PAGASA</li>
        
      </ul>
      <hr>
      其他
      <ul  class="card-list card-button">
        <li>wtsr**.wsss 新加坡</li>
        <li>wtpn**.phnc JTWC中东太平洋</li>
        <li>wtpz**.knhc 美国迈阿密飓风中心</li>
      </ul>
    </Card>
    <Card style="width:350px;margin:45px">
    <p slot="title" style="height:auto;">
      其他报文
    </p>
      <ul class="card-list card-button">
        <li><a href="http://tgftp.nws.noaa.gov/data/raw/ab/?C=M;O=D"  target="_blank">
            <Button size="large" type="success">abpw**.pgtw JTWC 当前台风通报</Button>
          </a>
        </li>
        <li>
          <a href="http://tgftp.nws.noaa.gov/data/raw/tp/?C=M;O=D"  target="_blank">
            <Button size="large" type="success">tppn**.pgtw JTWC 卫星定位报<br>Satellite Fix Bulletin</Button>
          </a>
        </li>
        <li>
          <a href="http://tgftp.nws.noaa.gov/data/raw/wd/?C=M;O=D"  target="_blank">
            <Button size="large" type="success">wdpn**.pgtw JTWC 诊断分析报 <br> Prognostic Reasoning</Button>
          </a>
        </li>
        <li>
          <a href="http://tgftp.nws.noaa.gov/data/raw/fx/fxxt03.egrr..txt"  target="_blank">
            <Button size="large" type="success">fxxt03.egrr 英国报文(模式)</Button>
          </a>
        </li>
        <li>
          <a href="https://www.wis-jma.go.jp/d/o/RJTD/BUFR/Satellite(Himawari)/SAREP/"  target="_blank">
            <Button size="large" type="success">日本卫星定位报</Button>
          </a>
        </li>
        <li>
          <a href="ftp://gmcrgz:guangz123@10.148.8.212/bcgzup/msg/publ"  target="_blank">
            <Button size="large" type="success"> 广东省气象局数据中心接收报文</Button>
          </a>
        </li>
      </ul>
    </Card>
  </div>
  <h3>数据中心入库报文</h3>
  <h3>UNISYS报文合集-已失效</h3>
    <Row>
      <Col span="8">
        <Card style="width:200px;margin:20px">
          <p slot="title">
              <Icon type="ios-film-outline"></Icon>
              今天
          </p>
          <ul class="card-list card-button">
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
          <ul class="card-list card-button">
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
          <ul class="card-list card-button">
            <li v-for="(item, index) in bfYesArr" :key="index">
              <a :href="unisysUrl+item" target="_blank" rel="nofollow noopener noreferrer"><Button size="large" type="success" >{{item}}</Button></a>
            </li>
          </ul>
        </Card>
      </Col>
    </Row>
    
  </Col>
  <Col span="1"><!--右侧空白-->
  <div>&nbsp; </div>
  </Col>
</Row>
</template>
<script>
  import CardPic from './comps/cardPic.vue';
  import {bulletinSrc} from '../config/srcConfig.js';

  export default {
    components:{CardPic,},
    name: 'bul-fc',
    props:{

    },
    data () {
      const today = this.getTimeString(0);
      const yesterday = this.getTimeString(-1);
      const bfYesDay = this.getTimeString(-2);
      const timeArr = ['12','00'];
      const todayArr = timeArr.map(v=>today+v);
      const yesterArr = timeArr.map(v=>yesterday+v);
      const bfYesArr = timeArr.map(v=>bfYesDay+v);
     
      return {
        speedDial: bulletinSrc.speedDial,
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
.card-button{
  margin:2px;
  list-style:none;
}
.card-button a{
  color:white;
}
.card-list li{
  padding:2px;
  font-size: 18px;
}
.p-title{
  color:lightseagreen;
  font-size: 20px;
  font-weight: bold;
}
.ivu-btn-large{
  font-size: 18px;
}
.bulletin-flex{
  display: flex;
  flex-direction:row;
  justify-content: flex-start;
  flex-wrap:wrap;
  justify-content:flex-start;
  align-items: flex-start;
}
</style>

<style>

</style>