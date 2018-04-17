<template>
<Row>
  <Col span="1">
   <div>&nbsp</div><!--左侧空白-->
  </Col>
  <Col span="22">
    <Row>
      <card-pic :dial="speedDial.typhoon2000"></card-pic>
      <card-pic :dial="speedDial.ruc"></card-pic>
      <card-pic :dial="speedDial.emc"></card-pic>
      <card-pic :dial="speedDial.gd121"></card-pic>
      <card-pic :dial="speedDial.gefs"></card-pic>
    </Row>

  </Col>
  <Col span="1"><!--右侧空白-->
  <div>&nbsp</div>
  </Col>
</Row>
</template>
<script>
  import CardPic from './comps/cardPic.vue';
  import {nwpSrc} from '../config/srcConfig.js';

  export default {
    components:{CardPic,},
    name: 'nwp-track',
    props:{

    },
    data () {
      return {
        speedDial: nwpSrc.speedDial,
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