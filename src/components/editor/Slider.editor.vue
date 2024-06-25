<template>
  <el-slider
    v-model="model"
    :max="desc.options.max"
    :min="desc.options.min"
    :marks="desc.options.marks"
  />
</template>
<script>
export default {
  props: ["desc", "value"],
  computed: {
    model: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
};
</script>