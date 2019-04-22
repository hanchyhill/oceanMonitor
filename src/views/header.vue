<template>
  <Menu mode="horizontal" theme="dark" :active-name="activeTab" @on-select="handleTabChange" class="main-menu menu">
    <div class="layout-logo">
      
      <div @click="openSilder"><Icon type="md-menu" /> 海洋监测</div>
    </div>
    <div class="layout-nav">
    <MenuItem name="env">
        环境分析
    </MenuItem>
    <MenuItem name="current">
        当前台风
    </MenuItem>
    <MenuItem name="bullet">
        机构-报文
    </MenuItem>
    <MenuItem name="nwp">
        数值路径
    </MenuItem>
    <MenuItem name="satellite">
        卫星
    </MenuItem>
    <MenuItem name="ref">
        相关链接
    </MenuItem>
    </div>
  </Menu>

</template>

<script>
export default {
  name: 'mainHeader',
  data () {
    // console.log(this.$route.name);
    return {
      activeTab:this.$route.name,
    }
  }, // data end
  methods:{
    handleTabChange(value){
    /**
    响应标签变化
     */
      this.activeTab = value;
      this.$router.push(value);
    },
    openSilder(){//折叠侧边栏
      this.$emit('showSideBar');
    },
  }, // methods end
  watch: {
     '$route' (to, from) {
       // console.log(this.$route.name);
      if(this.$route.name!==this.activeTab) this.activeTab = this.$route.name;
       // 对路由变化作出响应...
    }, 
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.layout-logo{
    width: 150px;
    height: 60px;
    background: #5b6270;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 0px;
    left: 0px;
    color:white;
    font-size: 25px;
    text-align: center;
    cursor:pointer;
}
.layout-nav{
    width: 800px;
    margin: 0 auto;
    margin-right: 20px;
}
/* .header{
  background-color: #7e57c2;
} */

/* .menu{
  display:inline-block;
} */

.logo-menu{
  height: 60px;
  line-height: 60px;
  background: #2d8cf0;
  font-size: 14px;
  margin: 0;
  padding-left: 10px;
  box-sizing: border-box;
  position: relative;
  color:#CCFFFF;
  z-index: 900;
  font-size:23px;
}

.main-menu li{
  /* color:white !important; */
  font-size:20px;
  
}

.logo{
  font-size: 24px;
  /* color: white; */
  display: inline-block;
  padding: 10px 20px;
}

.head-nav{
  display: inline-block;
  width: 70%;
  /* min-width:350px; */
  margin: 0 auto;
}

.tab{
  margin: 0 auto;
  /* width: 400px;
  background-color: rgba(0, 0, 0, 0); */
}

</style>
