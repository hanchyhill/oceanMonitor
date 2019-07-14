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
      let isLocal = /(172\.0\.0\.1)|(localhost)/.test(location.href);
      let prefix = '';
      if(isLocal){// 本地执行
        prefix = '/static/remote-img/';
      }else{// 线上执行
        prefix = 'https://data.gdmo.gq/img/tc_ec_pro/';
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
          let timeFormat = [this.fitTime,fcHour,fcTime.format('YYYYMMDDHH')];
          timeList.push(timeFormat);
        }
        let fileArr = timeList.map(tF=>`ecTcPro${tF[0]},${tF[1]},${tF[2]}.png`);
        let urlArr = fileArr.map(fileName=>`${urlPrefix}${fitYear}/${this.fitTime}/${fileName}`);
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