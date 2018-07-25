<template>
<Row>
  <Col span="1">
   <div>&nbsp;</div><!--左侧空白-->
  </Col>
  <Col span="22">
  <h2>机构</h2>
   <ul class="am-list">
    <li v-for="(item, index) of org" :key="index">
      <a :href="item.url"  target="_blank" rel=" nofollow noopener noreferrer">
      {{item.name}}
      </a>
    </li>
   </ul>

  <h2>其他</h2>
  <ul class="am-list">
    <li v-for="(item, index) of others" :key="index">
      <a :href="item.url"  target="_blank" rel=" nofollow noopener noreferrer">
      {{item.name}}
      </a>
    </li>
  </ul>
  </Col>
  <Col span="1">
   <div>&nbsp;</div><!--右侧空白-->
  </Col>
</Row>
</template>
<script>
  import {refSrc} from '../config/srcConfig.js';
  
  export default {
    name: 'ref-s',
    props:{

    },
    data () {
      return {
        org: refSrc.links.org,
        others: refSrc.links.others,
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
.am-list {
    margin-bottom: 1.6rem;
    padding-left: 0;
}
address, blockquote, dl, fieldset, figure, hr, ol, p, pre, ul {
    margin: 0 0 1.6rem 0;
        margin-bottom: 1.6rem;
}
ul, menu, dir {
    display: block;
    list-style-type: disc;
    margin-block-start: 1em;
    margin-block-end: 1em;
    padding-inline-start: 40px;
}

.am-list > li {

    position:  target="_blank" relative;
    display: block;
    margin-bottom: -1px;
    background-color: #fff;
    border: 1px solid #dedede;
    border-width: 1px 0;
    font-size: 25px;
    padding-top: 10px;
    padding-bottom: 10px;

}
</style>

<style>

</style>