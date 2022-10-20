<template>
  <div class="ec-pro">
    <div class="sel-date">
      <span>起报时间</span>
      <DatePicker
        type="date"
        split-panels
        placeholder="Select date"
        style="width: 150px"
        @on-change="dateChange"
        :value="selectedDate"
      >
      </DatePicker>
      <i-select v-model="selectedHour" style="width:100px">
          <i-option  v-for="item in hourList" :value="item.value" :key="item.value">
            {{ item.label }}
          </i-option>
      </i-select>
      <span>强度选择</span><i-select v-model="tcType" style="width:200px">
          <i-option  value="td" >
            热带低压TD以上强度
          </i-option>
          <i-option  value="ts" >
            热带风暴TS以上强度
          </i-option>
      </i-select>
      <Button type="primary" icon="ios-search" @click="switchShowTime">检索</Button>
    </div>
    <div clas="sel-btn-group">
      <Button 
        v-for="(time, index) of timeList" :key="time"
        @click="changeCarouse(index)"
        type = "success"
        :ghost="index!==ecCarIndex"
      >
      {{fcTimeList[index]}}
      </Button>
    </div>
    <Carousel class="ec-pro-car"
        v-model="ecCarIndex"
        :autoplay="false"
        dots="outside"
        :radius-dot="true"
        arrow="always">
        <CarouselItem v-for="(url, index) of urlList" :key="index">
            <div class="pro-carousel"><img :src="url" @error="evt=>eventImgError(evt.currentTarget)"></div>
        </CarouselItem>
    </Carousel>
  </div>
</template>
<script>
  import * as moment from 'moment';
  let config = {
    timeList:[72,96,120,144,168,192,216,240,264,288,],
    getUrlPrefix(){
      let isLocal = /localhost/.test(location.href); ///(127\.0\.0\.1)|(localhost)/.test(location.href);
      let prefix = '';
      if(isLocal){// 本地执行
        prefix = '/static/remote-img/';
      }else{// 线上执行
        prefix = 'https://data.gdmo.gq/img/ec_cloud/';
      }
      return prefix;
    },
  }

  export default {
    name:'ecPro',
    props:{
    },
    data() {
      let now = moment.utc();
      let nHour = now.hour();
      let fitTime;
      let fitYear;
      if(nHour>=8&&nHour<20){
        fitTime = now.format('YYYYMMDD')+'00';
      }else if(nHour>=20){
        fitTime = now.format('YYYYMMDD')+'12';
      }else{
        fitTime = moment(now).subtract(1,'days').format('YYYYMMDD')+'12';
      }
      // fitYear = fitTime.slice(0,4);
      let selectedDate = moment.utc(fitTime,'YYYYMMDDHH').format('YYYY-MM-DD');
      let selectedHour = fitTime.slice(-2);
      return {
        fitTime,
        ecCarIndex:0,
        timeList:[72,96,120,144,168,192,216,240,264,288,],
        selectedDate,
        selectedHour,
        hourList: [{value:'00',label:'00:00UTC'},{value:'12',label:'12:00UTC'}],
        urlPrefix: config.getUrlPrefix(),
        tcType:'td',
      };
    },
    mounted() {

    },
    beforeDestroy() {

    },
    methods: {
      changeCarouse(index){
        this.ecCarIndex = index;
      },
      dateChange(date="2019-07-14"){
        //console.log(date);
        this.selectedDate = date;
      },
      switchShowTime(){
        const targetTime = this.selectedDate+this.selectedHour;
        this.fitTime = targetTime.replace(/-/g,'');
      },
      eventImgError(target){
        target.src = '/static/image-not-found.png';
      },
    },
    computed:{
      urlList(){
        let urlPrefix = this.urlPrefix;
        let initT = moment.utc(this.fitTime,'YYYYMMDDHH');
        let fitYear = this.fitTime.slice(0,4);
        let timeList = [];
        for(let fcHour of config.timeList){
          let fcTime = moment(initT).add(fcHour,'hours');
          // let timeFormat = [this.fitTime,fcHour,fcTime.format('YYYYMMDDHH')];
          // timeList.push(timeFormat);
          timeList.push(fcTime);
        }
        let fileArr = timeList.map(fcTime=>`tc_pro_opencharts_wnp_genesis_${this.tcType}_base${initT.format('YYYYMMDDHHmm')}_valid${fcTime.format('YYYYMMDDHHmm')}.png`)
        // let fileArr = timeList.map(tF=>`ecTcPro${tF[0]},${tF[1]},${tF[2]}${this.tcType==='td'?'.td':''}.png`);
        // http://localhost:8080/static/remote-img/2022/2022101912/ecTcPro2022101912,216,2022102812.png
        // https://data.gdmo.gq/img/ec_cloud/202210/2022101912/tc_pro_opencharts_wnp_genesis_td_base202210191200_valid202210301200.png
        let urlArr = fileArr.map(fileName=>`${urlPrefix}${initT.format('YYYYMM')}/${initT.format('YYYYMMDDHH')}/${fileName}`);
        return urlArr;
      },
      fcTimeList(){
        let urlPrefix = config.getUrlPrefix();
        let initT = moment.utc(this.fitTime,'YYYYMMDDHH');
        let fitYear = this.fitTime.slice(0,4);
        let timeList = [];
        for(let fcHour of config.timeList){
          let fcTime = moment(initT).add(fcHour,'hours');
          // let timeFormat = [this.fitTime,fcHour,fcTime.format('YYYYMMDDHH')];
          timeList.push(fcTime.format('MM-DD HH')+'UTC');
        }
        return timeList;
      }
    }
  };
</script>
<style scope>
  .pro-carousel{
    display: flex;
    justify-content:center;
    align-items: center;
  }
</style>