<template>
      <elInput v-model="model" :placeholder="this.desc.placeholder"></elInput>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  props: ['value', 'desc'],
  inject: ['activeData', 'formConf'],
  computed: {
    ...mapGetters(['getModelValue']),
    model: {
      get() {
        if (Array.isArray(this.value)) {
          return this.value.join(',');
        }
        if (typeof this.value === 'boolean') {
          return `${this.value}`;
        }
        return this.value;
      },
      set(val) {
        if (Array.isArray(this.value)) {
          if (val) {
            val = val.split(',');
          } else {
            val = [];
          }
        }
        if (typeof val === 'boolean') {
          val = `${val}`;
        }
        if (this.desc.model === 'formRef') {
          // 删除ref
          this.deleteModel(this.value);
        }
        if (this.desc.model === '__vModel__') {
          // 删除对应model上的值
          const data = this.activeData();
          const { parentRef } = data.__config__;
          if (parentRef) {
            const model = this.getModelValue(parentRef);
            this.$delete(model, this.value);
          } else {
            const model = this.getModelValue(this.formConf().formRef);
            if (model) {
              this.$delete(model, this.value);
            }
          }
        }
        this.$emit('input', val);
      }
    },
  },
  methods: {
    ...mapMutations(['deleteModel'])
  }
};
</script>
