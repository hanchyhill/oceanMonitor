<template>
<div>
  <Menu theme="light" width="auto" :class="menuitemClasses" class="sidebar-menu">
    <MenuItem  @click.native="isSettingOpen=!isSettingOpen" name="1-1">
      <Icon type="md-settings" />
      <span>设置</span>
    </MenuItem>
    <!-- <MenuItem name="1-2">
      <a href="https://github.com/hanchyhill/oceanMonitor" target="_blank" style="color:black"><Icon type="md-code-download" />
      <span>代码仓库</span></a>
    </MenuItem> -->
    <MenuItem name="1-3">
      <Icon type="md-help-circle" />
      <span>帮助WIKI</span>
    </MenuItem>
    <!-- <MenuItem name="1-4">
      <a href="https://github.com/hanchyhill/oceanMonitor/issues" target="_blank" style="color:black">
      <Icon type="ios-bug" />
      <span>提交BUG</span>
      </a>
    </MenuItem> -->
  </Menu>
  <popup-setting :isSettingOpen="isSettingOpen"></popup-setting>
</div>
</template>

<script>
import PopupSetting from './popSetting.vue';
export default {
  components:{PopupSetting,},
  name: 'sidebar-menu',
  props:{isCollapsed:Boolean,},
  data () {
    return {
      isSettingOpen:false,
    }
  }, // data end
  methods:{

  }, // methods end
  watch: {

  },
  computed:{
      menuitemClasses () {
        return [
            'menu-item',
            this.isCollapsed ? 'collapsed-menu' : ''
        ];
      },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.sidebar-menu i{
  font-size: 22px;
}
</style>
