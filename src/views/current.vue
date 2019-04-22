<template>
<Row>
  <Col span="1">
   <div>&nbsp;</div><!--左侧空白-->
  </Col>
  <Col span="22">
    <Row>
      <card-pic :dial="speedDial.activeTCinSSD"></card-pic>
      <card-pic :dial="speedDial.tropicaltidbits"></card-pic>
      <card-pic :dial="speedDial.colostate"></card-pic>
      <card-pic :dial="speedDial.wisc"></card-pic>
      <card-pic :dial="speedDial.digitalTY"></card-pic>
      <card-pic :dial="speedDial.nrlNavy"></card-pic>
      <card-pic :dial="speedDial.fnmoc"></card-pic>
      <card-pic :dial="speedDial.hurZone"></card-pic>
    </Row>

  </Col>
  <Col span="1"><!--右侧空白-->
  <div>&nbsp;</div>
  </Col>
</Row>
</template>
<script>
  import CardPic from './comps/cardPic.vue';
  import {currentSrc} from '../config/srcConfig.js';
  export default {
    components:{CardPic,},
    name: 'cur-ty',
    props:{

    },
    data () {
      return {
        speedDial: currentSrc.speedDial,
      }
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

</style>

<style>

</style>