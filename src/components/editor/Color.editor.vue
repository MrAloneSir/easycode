<template>
  <el-color-picker v-model="model" />
</template>

<script>
export default {
  props: ['value'],
  computed: {
    model: {
      get() {
        return String(this.value);
      },
      set(val) {
        this.$emit('input', val);
      }
    }
  }
};
</script>
