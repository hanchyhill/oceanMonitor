<template>
<div class='show-bulletin'>
  <DatePicker v-model="dateRange" type="daterange" split-panels placeholder="Select date" style="width: 200px"></DatePicker>
  <Select v-model="selectIns" multiple style="width:450px" placeholder="Select institution">
    <Option v-for="item in insList" :value="item.value" :key="item.value">{{ item.label }}</Option>
  </Select>
  <Button type="primary" icon="ios-search" @click.native="searchBulletin">Search</Button>
  <Tabs value="CMA" :animated="false">
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
          <Radio label="WSCI40-BABJ">
              <span>重要天气报</span>
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
          <Radio label="WTJP2-RJTD">
              <span>warning</span>
          </Radio>
          <Radio label="WTJP3-RJTD">
              <span>storm warning</span>
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
    <TabPane label="PAGASA" name="PAGASA">
      <Row>
        <Col span="2">
          <RadioGroup v-model="typeRPMM" vertical >
          <Radio label="all">
            <span>全部</span>
          </Radio>
          <Radio label="WTPH2-RPMM">
            <span>台风预报</span>
          </Radio>
          <Radio label="WTPH0-RPMM">
              <span>台风警报</span>
          </Radio>
          <Radio label="SDPH-RPMM">
              <span>卫星定位报</span>
          </Radio>
          </RadioGroup>
        </Col>
        <Col span="22">
          <div class= "bullet-wrapper">
            <bulletin-container 
            v-for="(item,index) of filterRPMM" :key="index" :item="item">
            </bulletin-container>
          </div>
        </Col>
      </Row>
    </TabPane>
        <TabPane label="KMA" name="KMA">
      <Row>
        <Col span="2">
          <RadioGroup v-model="typeRKSL" vertical >
          <Radio label="all">
            <span>全部</span>
          </Radio>
          </RadioGroup>
        </Col>
        <Col span="22">
          <div class= "bullet-wrapper">
            <bulletin-container 
            v-for="(item,index) of filterRKSL" :key="index" :item="item">
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
  import * as moment from 'moment';
  //import axios from 'axios';
  const axios = Util.ajax;
  export default {
    components:{BulletinContainer,},
    name: 'show-bulletin',
    data(){
      return{
        typeBABJ:'all', typeRJTD:'all', typePGTW:'all', typeVHHH:'all', typeRPMM:'all',typeRKSL:'all',
        BABJ:[],PGTW:[], RJTD:[], VHHH:[],RPMM:[],RKSL:[],
        selectIns:['BABJ','RJTD','PGTW','VHHH','RPMM','RKSL'],
        insList: [
          {value: 'BABJ',label: '北京'},
          {value: 'RJTD',label: '日本'},
          {value: 'PGTW',label: 'JTWC'},
          {value: 'VHHH',label: '香港'},
          {value: 'RPMM',label: '菲律宾'},
          {value: 'RKSL',label: '韩国'},
        ],
        dateRange:[new Date(Date.now()-1000*60*60*24*3), new Date()],
      };
    },
    methods: {
      getBulletin(gt,lt,dateFormat){
        // lt = Date.now();
        // gt = lt - 1000*60*60*24*30;
        axios.get(`/api/?gt=${gt}&lt=${lt}&ins=${this.selectIns.join(',')}&dateFormat=${dateFormat}`)
          .then(res=>{
            if(res.data.success){
              const data = res.data.data;
              this.BABJ = data.filter(v=>v.ins==='BABJ');
              this.PGTW = data.filter(v=>v.ins==='PGTW');
              this.RJTD = data.filter(v=>v.ins==='RJTD');
              this.VHHH = data.filter(v=>v.ins==='VHHH');
              this.RPMM = data.filter(v=>v.ins==='RPMM');
              this.RKSL = data.filter(v=>v.ins==='RKSL');
              if(data.length===0){
                this.showNotice('获取内容为空','请求范围内无数据',2);
              }else{
                this.showNotice('请求成功','',1);
              }
            }
            else{
              console.error('获取报文出现意外');
              this.showNotice('获取报文出现意外',res.data,-1);
            }
          })
          .catch(err=>{
            console.error(err.response?err.response.data:err);
            this.showNotice('连接发生错误',err.response?err.response.data:err,-1);
          });
      },
      searchBulletin(){
        let gt = moment.utc(moment(this.dateRange[0]).format('YYYY-MM-DD')).valueOf();
        let lt = moment.utc(moment(this.dateRange[1]).format('YYYY-MM-DD')+' 23:59:59').valueOf();
        this.getBulletin(gt,lt,'x');
      },
      showNotice(title,content,status){
        if(status === 1){//成功
          this.$Notice.success({
            title: title?title:'成功',
            desc: content ? content : '',
            duration:1.5,
          });
        }
        else if(status === -1){
          this.$Notice.error({
            title: title?title:'错误',
            desc: content ? content : '',
          });
        }
        else if(status === 2){ // 警告
          this.$Notice.warning({
            title: title?title:'警告',
            desc: content ? content : '',
          });
        }
        else{
          this.$Notice.info({
            title: title?title:'提示',
            desc: content ? content : '',
          });
        }
      }
    },
    created(){
      this.searchBulletin();
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
      filterRPMM(){
        if(this.typeRPMM === 'all'){
          return this.RPMM;
        }
        else{
          return this.RPMM.filter(v=>v.name == this.typeRPMM);
        }
      },
      filterRKSL(){
        if(this.typeRKSL === 'all'){
          return this.RKSL;
        }
        else{
          return this.RKSL.filter(v=>v.name == this.typeRKSL);
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