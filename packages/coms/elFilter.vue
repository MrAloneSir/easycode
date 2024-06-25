<template>
  <div class="el-filter">
    <div class="el-filter__content">
      <slot></slot>
    </div>
    <div class="el-filter__buttons">
      <el-button v-if="showReset" @click="reset">重置</el-button>
      <el-button v-if="showSearch" type="primary" @click="search">查询</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ElFilter',
  props: {
    showSearch: {
      type: Boolean,
      default: true
    },
    showReset: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    search(e) {
      e.preventDefault();
      this.$emit('search');
    },
    reset(e) {
      e.preventDefault();
      this.$emit('reset');
    }
  }
};
</script>

<style lang="scss" scoped>
.el-filter {
  overflow: hidden;
  :deep(.el-form-item) {
    margin-bottom: 10px !important;
  }
}
.el-filter__content {
  float: left;
}
.el-filter__buttons {
  float: right;
}
</style>
