<template>
  <div class="right-board">
    <elTabs v-model="currentTab" class="center-tabs">
      <el-tab-pane label="组件属性" name="field" />
      <el-tab-pane label="页面属性" name="form" />
    </elTabs>
    <div class="attribute">
      <!-- 组件属性 -->
      <el-form v-show="currentTab === 'field' && showField" size="small" label-width="90px">
        <right-editor
        v-if="!!activeData.__config__"
          style="margin-top: 10px"
          :active-data="activeData"
        />
        <el-empty v-else description="请选择组件" style="margin-top: 200px"></el-empty>

        <div style="height: 100px"></div>
      </el-form>
      <!-- 页面属性 -->
      <el-form v-show="currentTab === 'form'" size="small" label-width="90px">
        <right-editor
          style="margin-top: 10px"
          type="page"
          :active-data="formConf"
        />
      </el-form>
    </div>
  </div>
</template>

<script>
import RightEditor from './Editor.vue';

export default {
  components: {
    RightEditor
  },
  props: ['showField', 'activeData', 'formConf'],
  data() {
    return {
      currentTab: 'field'
    };
  },
};
</script>
<style lang="scss" scoped>
.right-board {
  width: 360px;
  height: calc(100vh - 42px);
  padding: 0 10px;
  box-sizing: border-box;
  .el-scrollbar {
    height: 100%;
  }
}

.attribute {
  height: 100%;
  overflow: scroll;
}
</style>
