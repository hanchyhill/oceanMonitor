<template>
 <div  class="header" title="海洋监测">
  <div class="menu-wrapper">
    <Row>
      <Col span="3">
        <div class="logo-menu menu">
          海洋监测
        </div>
      </Col>
      <Col span="21">
        <Menu mode="horizontal" theme="primary" :active-name="activeTab" @on-select="handleTabChange" class="main-menu menu">
          <MenuItem name="env">
              环境分析
          </MenuItem>
          <MenuItem name="current">
              当前台风
          </MenuItem>
          <MenuItem name="nwp">
              数值路径
          </MenuItem>
          <MenuItem name="bulletin">
              报文
          </MenuItem>
          <MenuItem name="satellite">
              卫星
          </MenuItem>
          <MenuItem name="ref">
              相关链接
          </MenuItem>
        </Menu>
      </Col>
    </Row>
    
    <!-- <div class="head-nav">
      <Tabs :value="activeTab" @on-click="handleTabChange" class="tab">
        <TabPane label="环境分析" name="env"></TabPane>
        <TabPane label="当前台风" name="current"></TabPane>
        <TabPane label="数值路径" name="nwp"></TabPane>
        <TabPane label="报文" name="bulletin"></TabPane>
        <TabPane label="卫星" name="satellite"></TabPane>
        <TabPane label="相关链接" name="ref"></TabPane>
      </Tabs>
    </div>-->
  </div>
 </div>
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

.main-menu{
  /* background: #00cc99; 
  width:90%;
  overflow:hidden;*/
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
