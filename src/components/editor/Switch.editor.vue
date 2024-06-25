<template>
    <div>
        <elSwitch v-model="model"/>
    </div>
</template>
<script>
export default {
  props: ["desc", "value"],
  computed: {
    model: {
      get() {
        return !!this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
};
</script>
