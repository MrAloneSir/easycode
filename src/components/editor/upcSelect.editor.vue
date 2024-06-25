<template>
  <elSelect v-model="model" placeholder="下拉选择" @change="selectOption">
    <elOption
      v-for="(option, index) in this.resultArr"
      :key="index"
      :label="option.showLabel"
      :value="option"
    >
    </elOption>
  </elSelect>
</template>

<script>
export default {
  props: ['value', 'desc'],
  data() {
    return {
      optionsArr: [],
      resultArr: [],
      option: {}
    };
  },
  computed: {
    model: {
      get() {
        this.getOptionsList(this.optionsArr);
        return this.option?.label ? this.option?.label : this.value?.label;
      },
      set(val) {
        this.$emit('input', val);
      }
    }
  },
  mounted() {
    this.optionsArr = JSON.parse(sessionStorage.getItem('ori_menus'));
    if (!this.optionsArr) {
      console.log('系统获取菜单资源出错');
    }
  },
  methods: {
    getOptionsList(arr) {
      arr?.map((item) => {
        var label = item.resourceName + '(' + item.resourceUrl + ')';
        var obj = {};
        obj.value = item?.resourceId;
        obj.showLabel = label;
        obj.label = item?.resourceName;
        obj.resourceTag = item?.resourceTag;
        this.resultArr.findIndex((item) => item.value == obj.value) == -1 &&
          this.resultArr.push(obj);
        if (item?.children) {
          this.getOptionsList(item.children);
        }
      });
      return this.resultArr;
    },
    selectOption(item) {
      this.option = item;
    }
  }
};
</script>
