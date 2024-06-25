<template>
  <elSelect v-model="model" placeholder="下拉选择" default-first-option>
    <elOption
      v-for="(option, index) in options"
      :key="index"
      :label="option.label"
      :value="option.label"
    >
      <el-tooltip class="item" effect="dark" :content="option.value" placement="left">
        <span style="float: left">{{ option.label }}</span>
      </el-tooltip>
    </elOption>
  </elSelect>
</template>

<script>
import { getHostOptions } from '@/config/config';

export default {
  props: ['value', 'desc'],
  computed: {
    options: function() {
      return getHostOptions();
    },
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
