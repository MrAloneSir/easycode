<template>
  <div>
    <div v-for="(item, index) in value" :key="index" class="select-item">
      <el-input v-model="item.label" placeholder="参数名" size="small" />
      <el-input
        style="margin-left: 10px"
        placeholder="参数值"
        size="small"
        :value="item.value"
        @input="setOptionValue(item, $event)"
      >
        <elSelect v-model="item.content" slot="prepend" style="width: 50px">
          <elOption
            v-for="(item, index) in contentArr"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></elOption>
        </elSelect>
      </el-input>
      <div class="close-btn select-line-icon" @click="value.splice(index, 1)">
        <i class="el-icon-remove-outline" />
      </div>
    </div>
    <elButton
      style="padding-bottom: 0"
      icon="el-icon-circle-plus-outline"
      type="text"
      @click="addParamItem"
    >
      添加参数
    </elButton>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { isNumberStr } from '@/utils/index';

export default {
  props: ['value', 'desc'],
  data() {
    return {
      selectOptions: [
        {
          label: 'None',
          value: 'none'
        },
        {
          label: 'LocalStorage',
          value: 'ls'
        },
        {
          label: 'SessionStorage',
          value: 'ss'
        },
        {
          label: 'Route',
          value: 'Route'
        },
        {
          label: 'window',
          value: 'window'
        },
        {
          label: 'state',
          value: 'state'
        }
      ]
    };
  },
  computed: {
    ...mapGetters(['getModelName']),
    model: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      }
    },
    contentArr: function () {
      let arr = this.getModelName.map((item) => {
        return {
          label: item,
          value: item
        };
      });
      return [...this.selectOptions, ...arr];
    }
  },
  methods: {
    addParamItem(e) {
      e.preventDefault();
      this.value.push({
        label: '',
        value: '',
        content: 'none'
      });
    },
    setOptionValue(item, val) {
      item.value = isNumberStr(val) ? +val : val;
    }
  }
};
</script>

<style lang="scss" scoped>
.select-item {
  display: flex;
  border: 1px dashed #fff;
  box-sizing: border-box;
  & .close-btn {
    cursor: pointer;
    color: #f56c6c;
  }
  & .el-input + .el-input {
    margin-left: 4px;
  }
}
.select-item + .select-item {
  margin-top: 4px;
}
.select-item.sortable-chosen {
  border: 1px dashed #409eff;
}
.select-line-icon {
  line-height: 32px;
  font-size: 22px;
  padding: 0 4px;
  color: #777;
}
</style>
