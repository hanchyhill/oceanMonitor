<template>
<div>
  
  <h3 id="unisys">UNISYS报文合集</h3>
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
    

</div>
</template>
<script>

  export default {
    name: 'bul-unisys',
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
</style>
<style>

</style>