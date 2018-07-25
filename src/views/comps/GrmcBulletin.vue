<template>
<div class="grmc-bulletin">
  <h4>广州台风报文ftp</h4>
  <div>
    <a href="ftp://zxt:123456@172.22.1.17/dbdata/nas226/begz/rcv/tq/typh/"  target="_blank">
      <Button size="large" type="success">广州台风报文ftp</Button>
    </a>
  </div>
  <h4>数据中心接口</h4>
  <div>
    <div>
      <a href="http://172.22.1.175/di/http.action?userId=sqxt&pwd=shengqxt123&interfaceId=getRACTyphoonInfo&dataFormat=html"  target="_blank">
        <Button size="large" type="success">查看数据中心TSID信息</Button>
      </a>
    </div>
    <div>
      <Input size="large" v-model="tsid" placeholder="Input TSID" style="width: 100px"></Input>
      <Select size="large" v-model="selectIns" style="width:100px" placeholder="Select institution">
        <Option v-for="item in insList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <Button size="large" type="primary" icon="ios-search" @click.native="openObs">根据TSID查询台风观测记录</Button>
    </div>
    <div>
      <DatePicker size="large" v-model="fcDate" type="date"  placeholder="Select date" style="width: 200px"></DatePicker>
      <TimePicker size="large" :value="hour" format="HH" :steps="[3,60,60]" placeholder="Select time" style="width: 112px" @on-change="changeTime"></TimePicker>
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
      return {
        selectIns:'BCGZ',
        tsid:'',
        insList: [
          {value: 'BABJ',label: '北京'},
          {value: 'BCGZ',label: '广州'},
          {value: 'PGTW',label: 'JTWC'},
          {value: 'VHHH',label: '香港'},
          {value: 'RPMM',label: '菲律宾'},
          {value: 'RKSL',label: '韩国'},
        ],
        fcDate:new Date(),
        hour:'00',
        obsUrl:'http://172.22.1.175/di/http.action?userId=sqxt&pwd=shengqxt123&interfaceId=getRACTyphoonObs4Tsid&dataFormat=html&tsid=%tsid&fcid=%ins',
        fcUrl: 'http://172.22.1.175/di/http.action?userId=sqxt&pwd=shengqxt123&interfaceId=getRACTyphoonFst4Tsid&dataFormat=html&tsid=%tsid&fcid=%ins&ymdhms=%date',
      }
    },
    methods: {
      openObs(){
        let url = this.obsUrl.replace('%ins',this.selectIns).replace('%tsid',this.tsid);
        window.open(url, '_blank').location;
      },
      openFc(){
        let url = this.obsUrl
                      .replace('%ins',this.selectIns)
                      .replace('%tsid',this.tsid)
                      .replace('%date',this.dateString);
        window.open(url, '_blank').location;
      },
      changeTime(time){
        console.log(time);
        this.hour = time;
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
  .grmc-bulletin div{
    margin-top:10px;
  }
  .ivu-btn-large{
    font-size: 18px;
  }
</style>

<style>

</style>