<template>
  <div class="layout">
    <Layout>
      <Sider class="side-bar" ref="side1" hide-trigger collapsible :collapsed-width="0" v-model="isCollapsed"
      :style="{position: 'fixed', height: '100vh', left: 0, overflow: 'auto'}" >
        <Menu active-name="1-2" theme="dark" width="auto" :class="menuitemClasses">
          <MenuItem name="1-1">
              <Icon type="ios-navigate"></Icon>
              <span>Option 1</span>
          </MenuItem>
          <MenuItem name="1-2">
              <Icon type="search"></Icon>
              <span>Option 2</span>
          </MenuItem>
          <MenuItem name="1-3">
              <Icon type="settings"></Icon>
              <span>Option 3</span>
          </MenuItem>
        </Menu>
      </Sider>
    <Layout>
      <Header>
        <main-header @showSideBar="isCollapsed=!isCollapsed" ></main-header>
      </Header>
      <Content  @click.native="closeSideBar">
        <router-view></router-view>
      </Content>
      <Footer class="footer-wrapper">
        <footer-bar></footer-bar>
      </Footer>
    </Layout>
    </Layout>
  </div>
</template>
<script>
  import MainHeader from './views/header.vue';
  import FooterBar from './views/comps/footerBar.vue';

  export default {
    name:'ocean',
    components:{MainHeader,FooterBar,},
    data() {
      return {
        isCollapsed: true,
        isSideBarOpen:false,
      };
    },
    mounted() {

    },
    beforeDestroy() {

    },
    methods: {
      closeSideBar(){
        !this.isCollapsed?this.isCollapsed=true:'';
      }
    },
    computed:{
      menuitemClasses () {
        return [
            'menu-item',
            this.isCollapsed ? 'collapsed-menu' : ''
        ];
      },
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

    .menu-icon{
        transition: all .3s;
    }
    .rotate-icon{
        transform: rotate(-90deg);
    }
    .menu-item span{
        display: inline-block;
        overflow: hidden;
        width: 69px;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: bottom;
        transition: width .2s ease .2s;
    }
    .menu-item i{
        transform: translateX(0px);
        transition: font-size .2s ease, transform .2s ease;
        vertical-align: middle;
        font-size: 16px;
    }
    .collapsed-menu span{
        width: 0px;
        transition: width .2s ease;
    }
    .collapsed-menu i{
        transform: translateX(5px);
        transition: font-size .2s ease .2s, transform .2s ease .2s;
        vertical-align: middle;
        font-size: 22px;
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