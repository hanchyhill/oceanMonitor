<template>
<div>
  <Modal v-model="open" title="设置"
    @on-ok="settingOk"
    @on-cancel="settingCancel">
    <p slot style="text-align:center;font-size:22px;">
      <h3>实时消息推送</h3>
      <p>
        <Icon type="ios-bookmarks-outline"></Icon><span>订阅实时消息</span>
        <i-switch size="large" :disabled="!subscribable" @on-change="triggerSubscribe" v-model="isBookMark">
          <span slot="open">订阅</span>
          <span slot="close">关闭</span>
        </i-switch>
        <div class="sub-loading" v-if="loadingSub">
          正在订阅中，请同意消息推送权限...<div class="spin-container"><Spin fix></Spin></div>
        </div>
      </p>
      <div style="color:#f60;">
        <p v-if="isGFW"><Icon type="information-circled"></Icon>跪了，无法连接浏览器的Push服务，您可能是GFW的受害者</p>
        <p v-if="!subscribable"><Icon type="information-circled"></Icon>您的浏览器不支持Push API，请使用现代浏览器</p>
      </div>
      <CheckboxGroup v-model="messageList">
        <Checkbox label="nmcTyphoonExpress">
            <span>北京-台风快讯</span>
        </Checkbox>
        <Checkbox label="jma" disabled>
            <span>JMA-台风预报</span>
        </Checkbox>
        <Checkbox label="jtwc" disabled>
            <span>JTWC-台风预报</span>
        </Checkbox>
        <Checkbox label="jtwc-ty" disabled>
            <span>JTWC-生成报</span>
        </Checkbox>
    </CheckboxGroup>
    </p>
  </Modal>
</div>
</template>

<script>
import {isSubscribe,subscribePush,unsubscribePush} from '../../libs/push.js';
import Util from '../../libs/util';
const axios = Util.ajax;
export default {
  name: 'popup-setting',
  props:{isSettingOpen:Boolean,},
  data () {
    let subscribable = false;
    if ('serviceWorker' in navigator && 'PushManager' in window){
      subscribable = true;
    }
    return {
      subscribable,
      messageList:['nmcTyphoonExpress'],
      bookmark:false,
      loadingSub:false,
      isGFW:false,
      open:false,
    }
  }, // data end
  created(){
    if(this.subscribable){
      isSubscribe()
      .then(subscription=>{
        if(subscription){
          this.bookmark = true;
          console.log('已订阅');
        }
        else{
          this.bookmark = false;
          console.log('未订阅');
        }
      })
      .catch(err=>{
        
        console.error(err);
      })
    }
  },
  methods:{
    settingOk(){},
    settingCancel(){},
    triggerSubscribe(){
      if(this.bookmark){
        unsubscribePush()
        .then(subscription=>{
          // TODO 出错时bookmark与按钮状态不同步
          if(subscription){
            console.log('取消订阅'+subscription.endpoint);
            axios.post('/unregister',subscription)
            .then(()=>{
              // console.log('取消订阅'+subscription.endpoint);
              
              this.bookmark = false;
              this.$Notice.info({
                title: '消息',
                desc:  '已取消订阅'
              });
            })
            .catch(err=>{
              this.$Notice.info({
                title: '取消时发生错误',
                desc:  err.message,
              });
              console.error(err);
            })
          }
          else{
            this.$Notice.info({
              title: '消息',
              desc:  '没有订阅消息'
            });
          }
          
          // TODO axios unregister
        })
        .catch(err=>{
          console.log('取消订阅发生错误');
          this.$Notice.error({
            title: '错误',
            desc:  '取消订阅发生错误'
          });
          console.error(err);
        })
      }else{
        this.loadingSub = true;
        subscribePush()
        .then(subscription=>{
          this.loadingSub = false;
          this.bookmark = true;
          console.log('订阅信息'+subscription.endpoint);
          axios.post('/register',subscription)
          .then((data)=>{
            this.$Notice.success({
              title: '成功',
              desc:  '已订阅实时消息'
            });
          })
          .catch(err=>{
            this.$Notice.error({
              title: '服务器注册时发生错误',
              desc:  err.message,
            });
          })
        })
        .catch(err=>{
          console.log('订阅错误');
          this.loadingSub = false;
          this.bookmark = !this.bookmark;
          this.bookmark = false;
          console.error(err);
          this.$Notice.error({
            title: '错误',
            desc:  '无法与push服务取得联系，可能是网络问题',
          });
        });
      }
    }
  }, // methods end
  watch: {
    isSettingOpen(){
      this.open = true;
    }
  },
  computed:{
    isBookMark:{
      get:function(){return this.bookmark},
      set:function(){return},
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.spin-container{
  display: inline-block;
  width: 25px;
  height: 25px;
  position: relative;
}
.sub-loading{
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

</style>
