<template>
<div class='footer'>
  <!-- <span><a>站点地图</a> | </span> -->
  <!-- <span><a href="https://github.com/hanchyhill/oceanMonitor" target="_blank">代码仓库</a> | </span> -->
  <span>BUG与建议提交: <a href="http://bug.gdmo.gq/" target="_blank">内网</a>
  <!-- 、<a href="https://github.com/hanchyhill/oceanMonitor/issues" target="_blank">外网</a> -->
  </span>
  <div class="copy-left">© </div> <span> GDMO - 南海海洋气象预报中心</span>
</div>
</template>

<script>
  export default {
    data(){
      return{

      };
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
.footer{
  height:55px;
  background-color: #495060;
  font-size: 18px;
  text-align:center;
  vertical-align:middle;
  padding: 5px;
  line-height:40px;
  color: #e8f0f3;
}
.footer a{
  color:#9fe0f6;
}

.copy-left{
  transform:rotate(180deg);
  display: inline-block;
}
</style>

<style>

</style>