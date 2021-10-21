<template>
<div class="grmc-bulletin">
  <h3>广州台风报文ftp</h3>
  <div class="row">
    <a href="ftp://zxt:123456@172.22.1.17/../../../../nas226/begz/rcv/tq/typh/"  target="_blank">
      <Button size="large" type="success">广州台风报文ftp</Button>
    </a>
  </div>
  <h3>数据中心接口</h3>
  <div>
    <div class="row">
      <a href="http://research.gdmo.gq/api/di/http.action?interfaceId=getRACTyphoonInfo&dataFormat=html"  target="_blank">
        <Button size="large" type="success">查看数据中心TSID信息</Button>
      </a>
    </div>
    <div class="row">
      <Input size="large" v-model="tsid" placeholder="Input TSID" style="width: 150px">
        <span slot="prepend">TSID</span>
      </Input>
      <Select size="large" v-model="selectIns" style="width:150px" placeholder="Select institution">
        <Option v-for="item in insList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <Button size="large" type="primary" icon="ios-search" @click.native="openObs">根据TSID查询台风观测记录</Button>
      <DatePicker size="large" v-model="fcDate" type="date"  placeholder="Select date" style="width: 200px"></DatePicker>
      <TimePicker size="large" :value="hour+'UTC'" format="HHUTC" :steps="[3,60,60]" placeholder="Select time" style="width: 112px" @on-change="changeTime"></TimePicker>
      <Button size="large" type="primary" icon="ios-search" @click.native="openFc">根据TSID查询指定时次预报</Button>
    </div>
  </div>
</div>
</template>
<script>
  import * as moment from 'moment';
  export default {
    name: 'grmc-bulletin',
    props:{

    },
    data () {
      let utcTime = moment.utc(new Date());
      let utcHour = utcTime.hours();
      let hour = (Array(2).join('0') + Math.floor(utcHour/3.0)*3).slice(-2);//向下取整为最接近3的倍数的整点，并转为2位字符串;
      return {
        selectIns:'BCGZ',
        tsid:'',
        insList: [
          {value: 'BABJ',label: '北京'},
          {value: 'BCGZ',label: '广州'},
          {value: 'RJTD',label: '日本'},
          {value: 'PGTW',label: 'JTWC'},
          {value: 'VHHH',label: '香港'},
          {value: 'ECMF',label: 'EC'},
          {value: 'GZRD',label: '热带所KM'},
          {value: 'GZRD9KM',label: '热带所9KM'},
        ],
        fcDate:new Date(Date.now() - 8*60*60*1000),
        hour,
        obsUrl:'https://research.gdmo.gq/api/di/http.action?interfaceId=getRACTyphoonObs4Tsid&dataFormat=html&tsid=%tsid&fcid=%ins',
        fcUrl: 'https://research.gdmo.gq/api/di/http.action?interfaceId=getRACTyphoonFst4Tsid&dataFormat=html&tsid=%tsid&fcid=%ins&ymdhms=%date',
      }
    },
    methods: {
      openObs(){// 打开台风观测接口
        let url = this.obsUrl.replace('%ins',this.selectIns).replace('%tsid',this.tsid);
        window.open(url, '_blank').location;
      },
      openFc(){// 打开台风预报接口
        let url = this.fcUrl
                      .replace('%ins',this.selectIns)
                      .replace('%tsid',this.tsid)
                      .replace('%date',this.dateString);
        window.open(url, '_blank').location;
      },
      changeTime(time){// 打开台风预报接口
        console.log(time);
        this.hour = time.replace('UTC','');
      },
    },
    created(){
    },
    computed:{
      dateString(){
        let head = moment(this.fcDate).format('YYYYMMDD');
        console.log(head + this.hour + '0000');
        return head + this.hour + '0000';
      }
    },
  };
</script>
<style scoped>
  .grmc-bulletin .row{
    margin-top:10px;
    display: flex;
    flex-direction:row;
    justify-content: flex-start;
    flex-wrap:wrap;
    justify-content:flex-start;
    align-items: center;
  }
  .grmc-bulletin .row  > *{
    margin-right: 10px;
    margin-bottom: 5px;
  }
  .ivu-btn-large{
    font-size: 18px;
  }
</style>

<style>

</style>