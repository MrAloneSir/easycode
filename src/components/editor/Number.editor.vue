<template>
  <elInput v-model.number="model" type="number" :placeholder="`请输入${desc.label}`" />
</template>
<script>
export default {
  props: ['value', 'desc'],
  computed: {
    model: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      }
    }
  }
};
</script>
