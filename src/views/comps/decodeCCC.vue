<template>
  <Modal class="decode-ccc" v-model="modal" title="中文电报解码" closable width="80%">
    <div class="wrap-decode-c">
      <div> 
        <Input
        v-model="rawText"
        type="textarea"
        placeholder="输入中文电码报文"
        :autosize="true"
        @on-change="textChange"
        />
      </div>
      <div>
        <Input class="decode-text"
          v-model="decodedText"
          type="textarea"
          :autosize="true"
          v-show="decodedText"
        />
      </div>
    </div>
    <div slot="footer">
        <Button type="info" size="large" @click="()=>modal=!modal">关闭</Button>
    </div>
  </Modal>
</template>
<script>
import * as axios from "axios";
export default {
  name: "decode-chn-bullet",
  props: {showDecodeCCC:Boolean},
  data() {
    return {
      code: null,
      decodedText: "",
      rawText: "",
      modal:false,
    };
  },
  methods: {
    decodeBulletin(bulletin = "",codeIndex=[]) {
      let bulletinline = bulletin.split(/[\n\r]+/);
      let decode = bulletinline.map(line =>
        line.split(" ").map(item => {
          if (item.length === 4 && /\d{4}/.test(item)) {
            return codeIndex[parseInt(item)];
          } else {
            return item;
          }
        })
      );
      let rawText = decode.map(line => line.join(" ")).join("\n");
      console.log(rawText);
      return rawText;
    },
    textChange() {
      if(!this.code){//未获取则抓取数据
        axios
        .get("/static/source/CCC-combine.json")
        .then(res => {
          this.code = res.data;
          this.decodedText = this.decodeBulletin(this.rawText,this.code);
        })
        .catch(err => {
          this.$Notice.error({
            title: "获取电码表发生错误",
            desc: err
          });
          console.error(err);
        });
      }else{
        this.decodedText = this.decodeBulletin(this.rawText,this.code);
      }
      
    }
  },
  created() {},
  computed: {},
  watch: {
    showDecodeCCC(){
      this.modal = true;
    }
  },
};
</script>
<style scoped>
  .wrap-decode-c{
    display: flex;
    width:100%;
  }
  .wrap-decode-c > div{
    width:45%;
  }
</style>
<style>
</style>