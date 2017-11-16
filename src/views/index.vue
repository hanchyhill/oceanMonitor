<template>
<div>
  <span class="index"  style="white-space: nowrap">
    <!--<div style="width:740px; display:inline-block;" ></div>-->
    <img src="http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBds230.png" alt="下降华东">
    <img src="http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBds242.png" alt="下降黄海">
    <img src="http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBds254.png" alt="下降日本">
    <br>
    <img src="http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBds231.png" alt="广东">
    <img src="http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBds243.png" alt="下降东海">
    <img src="http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBds255.png" alt="下降琉球以东">
    <br>
    <img src="http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBds232.png" alt="下降南海">
    <img src="http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBds244.png" alt="下降菲律宾北部">
    <img src="http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBds256.png" alt="下降关岛"><br>
    <span>
    <img src="http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBds233.png" alt="下降南海南部">
    <img src="http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBds245.png" alt="下降菲律宾南部">
    <img src="http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBds257.png" alt="下降菲东">
    </span>
  </span>
  上升轨道
  <span class="index"  style="white-space: nowrap">
    
    <img src="http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBas230.png" alt="上升华东">
    <img src="http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBas242.png" alt="上升黄海">
    <img src="http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBas254.png" alt="上升日本">
    <br>
    <img src="http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBas231.png" alt="上升广东">
    <img src="http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBas243.png" alt="上升东海">
    <img src="http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBas255.png" alt="上升琉球以东">
    <br>
    <img src="http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBas232.png" alt="上升南海">
    <img src="http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBas244.png" alt="上升菲北">
    <img src="http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBas256.png" alt="上升关岛">
    <br>
    <img src="http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBas233.png" alt="上升南海南部">
    <img src="http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBas245.png" alt="上升菲南">    
    <img src="http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBas257.png" alt="上升菲东">
    <br>
  </span>
</div>
</template>
<script>
import Util from '../libs/util';
  export default {
    name: 'pp-Main',
    data () {
      return {}
    },
    methods: {
    },
    created(){
    },
    computed:{
    },
  };
</script>
<style scoped>
img {
  display:inline-block;
}
.index {
  position:relative;
}
</style>

<style>
    /*.pp-table .scale6{
      background-color: #56B9D0;
      color: #3B3F42;
    }*/
    .pp-table .scale7{
      background-color: #FFFDA4;
    }
    .pp-table .scale8{
      background-color: #FF5661;
      color: #fff;
    }
</style>