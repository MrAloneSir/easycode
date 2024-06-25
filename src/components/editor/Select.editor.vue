<template>
  <elSelect v-model="model" placeholder="下拉选择" :multiple="multiple">
    <elOption
      v-for="(option, index) in desc.source === 'dynamic' ? getServerName : desc.options"
      :key="index"
      :label="option.label"
      :value="option.value"
    ></elOption>
  </elSelect>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: ['value', 'desc'],
  computed: {
    ...mapGetters(['getServerName']),
    model: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      }
    },
    multiple() {
      return this.desc.multiple === true;
    }
  }
};
</script>
