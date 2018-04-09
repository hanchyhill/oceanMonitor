<template>
<Row>
  <Col span="1">
   <div>&nbsp;</div><!--左侧空白-->
  </Col>
  <Col span="22">
  <h3>机构</h3>
   <ul class="am-list">
    <li>
    <a href="http://gb.weather.gov.hk/contentc.htm"  target="_blank" rel=" nofollow noopener noreferrer">香港天文台</a>
    </li>
    <li>
    <a href="http://www.smg.gov.mo/smg/c_index.htm"  target="_blank" rel=" nofollow noopener noreferrer">澳门地球物理暨氣象局</a>
    </li>
    <li>
    <a href="https://www.cwb.gov.tw/"  target="_blank" rel=" nofollow noopener noreferrer">台湾中央气象局</a>
    </li>
    <li>
    <a href="http://www.jma.go.jp/en/amedas/000.html?elementCode=1"  target="_blank" rel=" nofollow noopener noreferrer">日本气象厅-风观测</a>
    </li>
    <li>
    <a href="https://www1.pagasa.dost.gov.ph/"  target="_blank" rel=" nofollow noopener noreferrer">菲律宾PAGASA</a>
    </li>
   </ul>

  <h3>其他</h3>
  <ul class="am-list">
    <li>
    <a href="http://www.ssd.noaa.gov/PS/TROP/CI-chart.html"  target="_blank" rel=" nofollow noopener noreferrer">德法强度表</a>
    </li>
    <li>
    <a href="http://photino.cwb.gov.tw/rdcweb/lib/comput1.htm#1"  target="_blank" rel=" nofollow noopener noreferrer">氣象常用表單位換算</a>
    </li>
    <li>
    <a href="http://photino.cwb.gov.tw/rdcweb/lib/comput2.htm"  target="_blank" rel=" nofollow noopener noreferrer">计量单位换算</a>
    </li>
    <li>
    <a href="http://www.ab126.com/Geography/2204.html"  target="_blank" rel=" nofollow noopener noreferrer">海平面气压订正</a>
    </li>
    <li>
    <a href="https://tieba.baidu.com/f?kw=%E5%8F%B0%E9%A3%8E"  target="_blank" rel=" nofollow noopener noreferrer">百度台风吧</a>
    </li>
    <li>
    <a href="http://bbs.typhoon.org.cn/index.php?c=thread&amp;fid=79"  target="_blank" rel=" nofollow noopener noreferrer">台风论坛</a>
    </li>
   </ul>
  </Col>
  <Col span="1">
   <div>&nbsp;</div><!--右侧空白-->
  </Col>
</Row>
</template>
<script>
  export default {
    name: 'ref-s',
    props:{

    },
    data () {
      return {
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