<template>
  <div class="content">
    <el-main :class="{ 'content--split': split }">
      <slot name="main"></slot>
    </el-main>
    <el-footer v-if="hasFooter" class="el-footer-empty" style="height: auto">
      <slot name="footer"></slot>
    </el-footer>
  </div>
</template>

<script>
export default {
  name: "Content",
  props: {
    split: {
      type: Boolean,
      default: false
    },
    hasFooter: {
      // 是否显示页脚
      type: Boolean,
      default: false
    }
  }
};
</script>
<style lang="scss" scoped>
.content {
  display: flex;
  height: 100%;
  flex-direction: column;
  overflow-y: auto;
  .content--split {
    padding: 0;
    background: transparent;
  }
  .el-main {
    flex: 1;
  }
  .table-cell-img {
    height: 50px;
    vertical-align: middle;
  }
  .table-cell-err-img {
    opacity: 0.5;
    object-fit: contain;
  }

  .el-footer {
    margin-top: 10px;
    display: flex;
    align-items: center;
    min-height: 50px;
    background-color: white;
    &-empty:empty {
      display: none;
    }
  }
}
</style>
