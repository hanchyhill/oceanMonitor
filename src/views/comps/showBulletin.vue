<template>
<div class='show-bulletin'>
  报文展示
  <Tabs value="CMA">
    <TabPane label="CMA" name="CMA">
      <Row>
        <Col span="1">
          <RadioGroup v-model="bulletType" vertical >
          <Radio label="all">
            <span>全部</span>
          </Radio>
          <Radio label="warning">
            <span>台风警报</span>
          </Radio>
          <Radio label="sat">
              <span>卫星报</span>
          </Radio>
          </RadioGroup>
        </Col>
        <Col span="23">
          <Card width="600px">
            <p slot="title">
              <span>北京台风警报</span>
              <span>UTC: 201806201800</span>
              <span>北京时: 2018年06月20日18时00分</span>
            </p>
            <p>Content of card</p>
            <p>Content of card</p>
            <p>Content of card</p>
          </Card>
          <Card width="600px">
            <p slot="title">北京台风警报 UTC: 201806191800 北京时: 2018年06月19日18时00分</p>
            <p>Content of card</p>
            <p>Content of card</p>
            <p>Content of card</p>
          </Card>
        </Col>
      </Row>
      
    </TabPane>
    <TabPane label="JMA" name="JMA">JMA</TabPane>
    <TabPane label="JTWC" name="JTWC">JTWC</TabPane>
  </Tabs>
</div>
</template>

<script>
  import Util from '../../libs/util';
  //import axios from 'axios';
  const axios = Util.ajax;
  export default {
    data(){
      return{
        bulletType:'all',
      };
    },
    methods: {
    },
    created(){
      const lt = Date.now();
      const gt = lt - 1000*60*60*24*30;
      axios.get(`http://127.0.0.1:10074/api/?gt=${gt}&lt=${lt}&ins=PGTW,BABJ,RJTD`)
        .then(res=>{
          console.log(res.data);
        })
        .catch(err=>{
          console.error(err.response?err.response.data:err);
        });
    },
    computed:{
    },
  };
</script>

<style scoped>
</style>

<style>
</style>