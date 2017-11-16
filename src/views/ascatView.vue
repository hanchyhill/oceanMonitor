<template>
<div>
  <span class="ascat-wrap">
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
    <img src="http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBds256.png" alt="下降关岛">
    <br>
    <img src="http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBds233.png" alt="下降南海南部">
    <img src="http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBds245.png" alt="下降菲律宾南部">
    <img src="http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBds257.png" alt="下降菲东">
  </span>
</div>
</template>
<script>
  export default {
    name: 'ascat-view',
    props:{
      imgList:Array,
    },
    data () {
      return {
      }
    },
    methods: {
    },
    created(){
    },
    computed:{
      list(){
        return this.imgList;
      },
    },
  };
</script>
<style scoped>

.ascat-wrap {
  position:relative;
  white-space: nowrap;
}
</style>

<style>
  .ascat-wrap  img {
  display:inline-block;
}
</style>