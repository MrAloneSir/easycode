<template>
  <div style="padding: 0 10px">
    <el-divider>数据源</el-divider>
    <div class="action-item-extra" v-for="(dataItem, index) in formConf.dataSource" :key="index">
      <div class="title">{{ dataItem.name }}</div>
      <div class="action-item-controls">
        <div class="btn-control" @click="settingItem(dataItem, index)">
          <i class="el-icon-edit-outline"></i>
        </div>
        <div class="btn-control" @click="copyItem(dataItem, index)">
          <i class="el-icon-document-copy"></i>
        </div>
        <div class="btn-control" @click="formConf.dataSource.splice(index, 1)">
          <i class="el-icon-delete"></i>
        </div>
      </div>
    </div>
    <elButton type="primary" @click="add" style="margin-top: 10px">添加</elButton>
    <add-data-dialog
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      :type="type"
      :data-source="formConf.dataSource"
      :index="index"
      title="新增数据源"
    />
  </div>
</template>
<script>
import AddDataDialog from './AddDataDialog.vue';

export default {
  components: {
    AddDataDialog
  },
  props: ['formConf'],
  data() {
    return {
      dialogVisible: false,
      type: '',
      index: -1
    };
  },
  methods: {
    add() {
      this.dialogVisible = true;
      this.type = 'add';
    },
    copyItem(item, index) {
      let newItem = JSON.parse(JSON.stringify(item));
      this.formConf.dataSource.splice(index + 1, 0, newItem);
    },
    settingItem(item, index) {
      this.type = 'edit';
      this.dialogVisible = true;
      this.index = index;
    }
  }
};
</script>

<style lang="scss" scoped>
.action-item-extra {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 30px;
  background: #eee;
  border-radius: 3px;
  margin-top: 5px;

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
    width: 25px;
    height: 25px;
    cursor: pointer;
    color: #409eff;
  }
}
</style>
