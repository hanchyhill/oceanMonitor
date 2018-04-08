<template>
  <a href="http://tropic.ssec.wisc.edu/real-time/dlmmain.php?&basin=westpac&sat=wgms&prod=dlm2&zoom=&time=" target="_blank">
  <div class="single-member effect-2">
    <div class="member-image">
      <img src="/static/thumbnails/steerStream.jpg" alt="WISC引导气流">
    </div>
    <div class="member-info">
      <h3>引导气流</h3>
      <br>
      <h5>WISC</h5>
      <br>
      <p>
      根据热带气旋强度选择平均引导流，引导气流可以指示热带气旋的移动方向。
      </p>
      <div class="social-touch">
      </div>
    </div>
  </div>
  </a>
</template>
<script>

  export default {
    name:'cardPic',
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
<style scope>
.single-member{
  width: 280px; 
  float: left; 
  /* font-family: sans-sarif; */ 
  margin: 30px 2.5%; 
  background-color: #fff; 
  text-align: center; 
  position: relative;
}
.member-image img{
  max-width: 100%; 
  vertical-align: middle;
}
h3 {
  font-size: 24px; 
  font-weight: normal; 
  margin: 10px 0 0; 
  text-transform: uppercase;
}
h5 {
  font-size: 16px; 
  font-weight: 300; 
  margin: 0 0 15px; 
  line-height: 22px;
}
p {font-size: 14px; 
  font-weight: 300; 
  line-height: 22px; 
  padding: 0 30px; 
  margin-bottom: 10px;
}
.social-touch a{
  display: inline-block; 
  width: 27px; 
  height: 26px; 
  vertical-align: middle; 
  margin: 0 2px; 
  background-repeat: no-repeat; 
  opacity: 0.7; 
  transition: 0.3s;
}
.social-touch a:hover{
  opacity: 1; 
  transition: 0.3s;
}

.effect-2{max-height: 302px; min-height: 302px; overflow: hidden;}
.effect-2 h3{padding-top: 7px; line-height: 33px;}
.effect-2 .member-image{border-bottom: 5px solid #1fb554; height: 212px; overflow: hidden; width: 100%; transition: 0.4s; display: inline-block; float: none; vertical-align: middle;}
.effect-2 .member-info{transition: 0.4s;}
.effect-2 .member-image img{width: 100%; vertical-align: bottom;}
.effect-2 .social-touch{background-color: #1fb554; float: left; left: 0; bottom: 0; overflow: hidden; padding: 5px 0; width: 100%; transition: 0.4s;}
.effect-2:hover .member-image{height: 81px; transition: 0.4s;}
</style>