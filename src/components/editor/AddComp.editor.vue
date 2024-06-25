<template>
  <el-button type="primary" @click="addDefault">新增</el-button>
</template>
<script>
export default {
  props: ["desc", "value"],
  inject: ["cloneComponent"],
  methods: {
    addDefault() {
      const clone = this.cloneComponent(this.desc.default);
      this.value.push(clone);
    },
  },
};
</script>