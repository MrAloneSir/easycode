<template>
  <div class="content">
    <el-header v-if="hasHeader" :style="{ width: drawer ? 'calc(100% - 343px)' : '100%' }">
      <slot name="header"></slot>
    </el-header>
    <el-main :style="{ width: drawer ? 'calc(100% - 343px)' : '100%' }">
      <slot name="main"></slot>
    </el-main>
    <el-footer v-if="hasFooter" :style="{ width: drawer ? 'calc(100% - 343px)' : '100%' }">
      <slot name="footer"></slot>
    </el-footer>
  </div>
</template>

<script>
export default {
  name: 'Content',
  props: {
    hasFooter: {
      // 是否显示页脚
      type: Boolean,
      default: false
    },
    hasHeader: {
      type: Boolean,
      default: false
    },
    drawer: {
      type: Boolean,
      default: false
    }
  }
};
</script>
<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  height: calc(100vh - 20px);
  background-color: #f0f0f0;
  margin-left: 10px;
  .el-header {
    padding: 0;
    min-height: unset !important;
    height: auto !important;
  }
  .el-main {
    padding-top: 10px;
    background-color: white;
    // margin-top: 0;
  }
  .el-footer {
    padding: 0;
    // margin-left: 10px;
    border-top: solid #eee 1px;
  }
  .table-cell-img {
    height: 50px;
    vertical-align: middle;
  }
  .table-cell-err-img {
    opacity: 0.5;
    object-fit: contain;
  }
}
</style>
