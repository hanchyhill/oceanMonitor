<template>
<Row>
  <Col span="1">
   <div>&nbsp;</div><!--左侧空白-->
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
            <a :href="unisysUrl+item" target="_blank" rel="nofollow noopener noreferrer"><Button size="large" type="success" >{{item}}</Button></a>
          </li>
        </ul>
      </Card>
    </Col>
  </Row>
  <h3>数据中心入库报文</h3>
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
.unisys-button{
  margin:2px;
  list-style:none;
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