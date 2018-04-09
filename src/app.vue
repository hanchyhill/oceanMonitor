<template>
  <div class="layout">
    <Layout>
      <Header>
        <main-header></main-header>
      </Header>
      <Content>
        <router-view></router-view>
      </Content>
      <Footer class="footer-wrapper">
        <footer-bar></footer-bar>
      </Footer>
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

      };
    },
    mounted() {

    },
    beforeDestroy() {

    },
    methods: {

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

h3{
  margin-top:20px !important;
  margin-bottom:10px !important;
  font-size:30px;
}
 .fade-enter-active, .fade-leave-active {
  transition: opacity .3s
}
.fade-enter, .fade-leave-to  {
  opacity: 0
} 
/* .fade-leave-active in below version 2.1.8 */
</style>