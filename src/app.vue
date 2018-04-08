<template>
  <div>
    <main-header></main-header>
        <router-view></router-view>
  </div>
</template>
<script>
  import MainHeader from './views/header.vue';

  export default {
    name:'ocean',
    components:{MainHeader,},
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
<style >
/* .fade-enter-active, .fade-leave-active {
  transition: opacity .3s
}
.fade-enter, .fade-leave-to  {
  opacity: 0
} */
/* .fade-leave-active in below version 2.1.8 */
</style>