<template>
<div class='bulletin-content'>
  <Card>
    <div slot="title" class="bulletin-title">
      <span>{{titleCN}}</span>
      <span>{{timeUTC}}(UTC)</span><br>
      <span>{{timeBJ}}</span>
    </div>
    <span v-for="(content, index) of contents" :key="index">
      <Input :value="content" type="textarea" :autosize="true" placeholder="Enter something..."></Input>
    </span>
  </Card>
</div>
</template>

<script>
  import * as moment from 'moment';
  export default {
    name: 'bulletin-container',
    props:{
      item:Object,
    },
    data(){
      return{
        
      };
    },
    methods: {
    },
    created(){
    },
    computed:{
      titleCN(){return this.item.cn},
      contents(){return this.item.content},
      timeUTC(){return this.item.fulltime},
      timeBJ(){return moment(this.item.date).format('MM-DD HH:mm Z')},
      ins(){return this.item.ins},
      time(){return this.item.date},
    },
  };
</script>

<style scoped>
</style>

<style>
.bulletin-title{
  line-height: 1;
  color: #fdfef7;
  font-weight:bold;
  background-color:#1fb554;
}
.bulletin-content .ivu-card-head{
  background-color:#1fb554;
}
.bulletin-content{
  min-width: 450px;
  max-height:1500px;
  overflow: auto;
}
.bulletin-content textarea{
  resize:both;
}
</style>