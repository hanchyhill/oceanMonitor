<template>
<div>
  <div class="ascat-wrap">
    <!--<div style="width:740px; display:inline-block;" ></div>-->
    <div class="ascat-row-wrap" v-for="(list, index) of mosaicList" :key="index">
      <span class="ascat-img-wrap" v-for="imgItem of list" :key="imgItem.src">
        <img :src="imgItem.src" :alt="imgItem.name">
      </span>
    </div>
  </div>
</div>
</template>
<script>
  let mosaicImg = [
    [ 
      {name:'下降华东', origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBds230.png',local:'/static/remote-img/ascat/WMBds230.png'},
      {name:'下降黄海', origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBds242.png',local:'/static/remote-img/ascat/WMBds242.png'},
      {name:'下降日本', origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBds254.png',local:'/static/remote-img/ascat/WMBds254.png'},
    ],
    [
      {name:'广东', origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBds231.png',local:'/static/remote-img/ascat/WMBds231.png'},
      {name:'下降东海', origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBds243.png',local:'/static/remote-img/ascat/WMBds243.png'},
      {name:'下降琉球以东', origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBds255.png',local:'/static/remote-img/ascat/WMBds255.png'},
    ],
    [
      {name:'下降南海', origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBds232.png',local:'/static/remote-img/ascat/WMBds232.png'},
      {name:'下降菲律宾北部', origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBds244.png',local:'/static/remote-img/ascat/WMBds244.png'},
      {name:'下降关岛', origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBds256.png',local:'/static/remote-img/ascat/WMBds256.png'},
    ],
    [
      {origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBds233.png',local:'/static/remote-img/ascat/WMBds233.png',name:'下降南海南部', },
      {origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBds245.png',local:'/static/remote-img/ascat/WMBds245.png',name:'下降菲律宾南部', },
      {origin:'http://manati.star.nesdis.noaa.gov/ascat_images/cur_25km_META/zooms/WMBds257.png',local:'/static/remote-img/ascat/WMBds257.png',name:'下降菲东', },
    ],
  ];

  export default {
    name: 'ascat-view',
    props:{
      imgList:Array,
    },
    data () {
      return {
        mosaicImg,
      }
    },
    methods: {
    },
    created(){
    },
    computed:{
      mosaicList(){
        // console.log(this.imgList);
        return this.imgList;
      },
    },
  };
</script>
<style scoped>

.ascat-wrap {
  position:relative;
  white-space: nowrap;
  width:100%;
  max-height: 900px;
  overflow: scroll;
  display: flex;
  flex-direction: column;
}
.ascat-row-wrap{
  line-height: 0;
}
.ascat-img-wrap{
  position: relative;
  display: inline-block;
  height: 390px;
  width: 434px;
}
.ascat-img-wrap img{
  position:absolute;
  height: 390px;
  left: -10px;
}
</style>

<style>
  .ascat-wrap  img {
  display:inline-block;
}
</style>