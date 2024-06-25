<template>
  <div>
    <div class="action-item-extra" v-for="(actionItem, index) in value" :key="index">
      <div class="title">{{ actionItem.actionType }}</div>
      <div class="action-item-controls">
        <div class="btn-control" @click="settingItem(actionItem, index)">
          <i class="el-icon-s-tools"></i>
        </div>
        <div class="btn-control" @click="value.splice(index, 1)">
          <i class="el-icon-delete"></i>
        </div>
      </div>
    </div>
    <el-button
      type="primary"
      size="medium"
      @click="
        showAction = true;
        actionIndex = -1;
      "
      >新建动作</el-button
    >
    <action-dialog
      v-if="showAction"
      :visible.sync="showAction"
      :action-list="value"
      :index="actionIndex"
    ></action-dialog>
  </div>
</template>

<script>
import ActionDialog from './coms/ActionDialog.vue';

export default {
  props: ['desc', 'value'],
  inject: ['addItem', 'drawingList'],
  data() {
    return {
      showAction: false,
      actionIndex: -1
    };
  },
  components: {
    ActionDialog
  },
  methods: {
    settingItem(item, index) {
      if (item.actionType === 'dialog') {
        this.addItem(item.dialog, this.drawingList());
      } else {
        this.showAction = true;
        this.actionIndex = index;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.action-item-extra {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .title {
    font-size: 14px;
    color: #333;
  }
  .action-item-controls {
    display: flex;
    align-items: center;
  }
  .btn-control {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    cursor: pointer;
    color: #409eff;
  }
}
</style>