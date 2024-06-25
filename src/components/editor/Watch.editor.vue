<template>
  <div>
    <div v-for="(item, index) in value" :key="index" class="item">
      <el-input v-model="value[index]" placeholder="事件接收field"></el-input>
      <div class="close-btn select-line-icon" @click="value.splice(index, 1)">
        <i class="el-icon-remove-outline" />
      </div>
    </div>
    <elButton
      style="padding-bottom: 0"
      icon="el-icon-circle-plus-outline"
      type="text"
      @click="addWatchItem"
    >
      添加接收方
    </elButton>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: ['value', 'desc'],
  data() {
    return {};
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
    }
  },
  methods: {
    addWatchItem(e) {
      e.preventDefault();
      this.value.push('');
    }
  }
};
</script>

<style lang="scss" scoped>
.item {
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
.item + .item {
  margin-top: 4px;
}
.select-line-icon {
  line-height: 32px;
  font-size: 22px;
  padding: 0 4px;
  color: #777;
}
</style>
