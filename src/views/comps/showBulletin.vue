<template>
<div class='show-bulletin'>
  <DatePicker type="daterange" split-panels placeholder="Select date" style="width: 200px"></DatePicker>
  <Button type="primary" icon="ios-search">Search</Button>
  <Tabs value="CMA">
    <TabPane label="CMA" name="CMA">
      <Row>
        <Col span="2">
          <RadioGroup v-model="typeBABJ" vertical >
          <Radio label="all">
            <span>全部</span>
          </Radio>
          <Radio label="WTPQ2-BABJ">
            <span>台风警报</span>
          </Radio>
          <Radio label="TCPQ4-BABJ">
              <span>卫星报</span>
          </Radio>
          </RadioGroup>
        </Col>
        <Col span="22">
          <div class= "bullet-wrapper">
            <bulletin-container 
            v-for="(item,index) of filterBABJ" :key="index" :item="item">
            </bulletin-container>
          </div>
        </Col>
      </Row>
      
    </TabPane>
    <TabPane label="JMA" name="JMA">
      <Row>
        <Col span="2">
          <RadioGroup v-model="typeRJTD" vertical >
          <Radio label="all">
            <span>全部</span>
          </Radio>
          <Radio label="WTPQ2-RJTD">
            <span>台风预报</span>
          </Radio>
          <Radio label="WTPQ5-RJTD">
              <span>台风预报5天</span>
          </Radio>
          <Radio label="WTPQ3-RJTD">
              <span>JMA分析报</span>
          </Radio>
          <Radio label="FXPQ8-RJTD">
              <span>数值指导预报</span>
          </Radio>
          </RadioGroup>
        </Col>
        <Col span="22">
          <div class= "bullet-wrapper">
            <bulletin-container 
            v-for="(item,index) of filterRJTD" :key="index" :item="item">
            </bulletin-container>
          </div>
        </Col>
      </Row>
    </TabPane>
    
    <TabPane label="JTWC" name="JTWC">
      <Row>
        <Col span="2">
          <RadioGroup v-model="typePGTW" vertical >
          <Radio label="all">
            <span>全部</span>
          </Radio>
          <Radio label="WTPN3-PGTW">
            <span>台风预报</span>
          </Radio>
          <Radio label="WTPN5-PGTW">
              <span>台风预报长remark</span>
          </Radio>
          <Radio label="WTPN2-PGTW">
              <span>JTWC理由分析</span>
          </Radio>
          <Radio label="ABPW-PGTW">
              <span>当前台风通报</span>
          </Radio>
          <Radio label="TPPN-PGTW">
              <span>台风定位报</span>
          </Radio>
          <Radio label="WDPN-PGTW">
              <span>诊断分析报</span>
          </Radio>
          </RadioGroup>
        </Col>
        <Col span="22">
          <div class= "bullet-wrapper">
            <bulletin-container 
            v-for="(item,index) of filterPGTW" :key="index" :item="item">
            </bulletin-container>
          </div>
        </Col>
      </Row>
    </TabPane>
    <TabPane label="HKO" name="HKO">
      <Row>
        <Col span="2">
          <RadioGroup v-model="typeVHHH" vertical >
          <Radio label="all">
            <span>全部</span>
          </Radio>
          <Radio label="WTSS-VHHH">
            <span>台风警报</span>
          </Radio>
          <Radio label="FXSS2-VHHH">
              <span>HKO主观预报</span>
          </Radio>
          <Radio label="FXSS0-VHHH">
              <span>模式指导预报</span>
          </Radio>
          </RadioGroup>
        </Col>
        <Col span="22">
          <div class= "bullet-wrapper">
            <bulletin-container 
            v-for="(item,index) of filterVHHH" :key="index" :item="item">
            </bulletin-container>
          </div>
        </Col>
      </Row>
    </TabPane>
  </Tabs>
</div>
</template>

<script>
  import Util from '../../libs/util';
  import BulletinContainer from './BulletinContainer.vue';
  //import axios from 'axios';
  const axios = Util.ajax;
  export default {
    components:{BulletinContainer,},
    name: 'show-bulletin',
    data(){
      return{
        typeBABJ:'all',
        typeRJTD:'all',
        typePGTW:'all',
        typeVHHH:'all',
        BABJ:[],
        PGTW:[],
        RJTD:[],
        VHHH:[],
      };
    },
    methods: {
    },
    created(){
      const lt = Date.now();
      const gt = lt - 1000*60*60*24*30;
      axios.get(`http://127.0.0.1:10074/api/?gt=${gt}&lt=${lt}&ins=PGTW,BABJ,RJTD`)
        .then(res=>{
          if(res.data.success){
            const data = res.data.data;
            this.BABJ = data.filter(v=>v.ins==='BABJ');
            this.PGTW = data.filter(v=>v.ins==='PGTW');
            this.RJTD = data.filter(v=>v.ins==='RJTD');
            this.VHHH = data.filter(v=>v.ins==='VHHH');
          }
          else{
            console.error('获取报文出现意外');
          }
        })
        .catch(err=>{
          console.error(err.response?err.response.data:err);
        });
    },
    computed:{
      filterBABJ(){
        if(this.typeBABJ === 'all'){
          return this.BABJ;
        }
        else{
          return this.BABJ.filter(v=>v.name == this.typeBABJ);
        }
      },
      filterRJTD(){
        if(this.typeRJTD === 'all'){
          return this.RJTD;
        }
        else{
          return this.RJTD.filter(v=>v.name == this.typeRJTD);
        }
      },
      filterPGTW(){
        if(this.typePGTW === 'all'){
          return this.PGTW;
        }
        else{
          return this.PGTW.filter(v=>v.name == this.typePGTW);
        }
      },
      filterVHHH(){
        if(this.typeVHHH === 'all'){
          return this.VHHH;
        }
        else{
          return this.VHHH.filter(v=>v.name == this.typeVHHH);
        }
      },
    },
  };
</script>

<style scoped>
</style>

<style>
.bullet-wrapper{
  display: flex;
  flex-wrap: wrap;
  max-height:800px;
  align-content: space-between;
  overflow: scroll;
}
</style>