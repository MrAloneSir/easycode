<template>
  <div style="display:flex">
    <elSelect v-model="model" placeholder="下拉选择" filterable>
      <elOption
        v-for="(option, index) in this.iconList"
        :key="index"
        :label="option.label"
        :value="option.value"
      ></elOption>
    </elSelect>
  </div>
</template>

<script>
export default {
  props: ['value', 'desc'],
  data() {
    return {
      iconList: []
    };
  },
  computed: {
    model: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      }
    }
  },
  mounted() {
    import(/* webpackChunkName: "icon-pack" */ '@icon-park/vue').then((IconMap) => {
      this.iconList = Object.keys(IconMap)?.map((item) => {
        return {
          label: item,
          value: item
        };
      });
    });
  }
};
</script>
<style>
.handRight {
  margin-top: 5px;
  margin-left: 5px;
  display: 'block';
}
</style>
