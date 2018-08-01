<template>
  <div class="layout">
    <Layout>
      <Header><main-header @showSideBar="sideBarCollapse" ></main-header></Header>
      <Layout>
        <Sider class="side-bar" ref="side1" hide-trigger collapsible :collapsed-width="0" v-model="isCollapsed"
        :style="{position: 'fixed', height: '100vh', left: 0, overflow: 'auto', background: '#fff'}" >
          <sidebar-menu :isCollapsed="isCollapsed"></sidebar-menu>
        </Sider>
        <Content id="main-content"><router-view></router-view></Content>
        
      </Layout>
      <Footer class="footer-wrapper"><footer-bar></footer-bar></Footer>
    </Layout>
  </div>
</template>
<script>
  import MainHeader from './views/header.vue';
  import FooterBar from './views/comps/footerBar.vue';
  import SidebarMenu from './views/comps/sidebarMenu.vue';

  export default {
    name:'ocean',
    components:{MainHeader,FooterBar,SidebarMenu,},
    data() {
      return {
        isCollapsed: true,
      };
    },
    mounted() {

    },
    beforeDestroy() {

    },
    methods: {
      sideBarCollapse(){
        if(this.isCollapsed===true){
          document.getElementById('main-content').addEventListener('click',this.sideBarCollapse);
        }else{
          document.getElementById('main-content').removeEventListener('click',this.sideBarCollapse);
        }
        this.isCollapsed=!this.isCollapsed;
      },
    },
    computed:{
    },
  };
</script>
<style scoped>
.footer-wrapper{
  padding-left: 0px !important;
  padding-right: 0px !important;
  padding-bottom:0px !important;
}

.layout{
    
    position: relative;
    border-radius: 4px;
    height:100%;
}

.ivu-layout{
  min-height:100%;
}

.side-bar{
  z-index: 999;
}

</style>
<style >
html,body{
  height: 100%;
}
body{
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  overflow-y:auto;
}

h2{
  margin-top:20px !important;
  margin-bottom:10px !important;
  font-size:30px;
  font-weight:normal;
}
h3{
  margin-top:10px !important;
  margin-bottom:5px !important;
  font-size:20px;
}
 .fade-enter-active, .fade-leave-active {
  transition: opacity .3s
}
.fade-enter, .fade-leave-to  {
  opacity: 0
} 
/* .fade-leave-active in below version 2.1.8 */
</style>