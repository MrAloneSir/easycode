<template>
  <elSwitch v-model="model" />
</template>

<script>
export default {
  props: ['value'],
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
