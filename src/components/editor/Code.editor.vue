<template>
  <el-input type="textarea" :rows="10" v-model="model" autosize></el-input>
</template>

<script>
export default {
  props: ['value'],
  computed: {
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
        // // 以换行结束才赋值
        // if (!/\n$/.test(val)) {
        //   return
        // }
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
        this.$emit('input', val);
      }
    }
  }
};
</script>
