<template>
  <div>
    <el-tree
      draggable
      :data="value"
      node-key="id"
      :expand-on-click-node="false"
      :render-content="renderContent"
    />
    <div style="margin-left: 20px">
      <el-button
        style="padding-bottom: 0"
        icon="el-icon-circle-plus-outline"
        type="text"
        @click="addTreeItem"
      >
        添加选项
      </el-button>
    </div>
    <StatusNodeDialog
      :visible.sync="dialogVisible"
      :data-label="dataLabel"
      :data-value="dataValue"
      :data-type="dataType"
      :type="type"
      title="添加选项"
      @commit="addNode"
      @edit="editData"
    />
  </div>
</template>
<script>
import StatusNodeDialog from './coms/StatusNodeDialog.vue';

export default {
  props: ['value', 'desc'],
  components: {
    StatusNodeDialog
  },
  data() {
    return {
      currentNode: null,
      dialogVisible: false,
      dataLabel: '',
      dataValue: '',
      dataType: '',
      type: 'add'
    };
  },
  methods: {
    addTreeItem() {
      this.type = 'add';
      this.dialogVisible = true;
      this.currentNode = this.value;
    },
    renderContent(_, { node, data }) {
      return (
        <div
          class="custom-tree-node"
          onClick={() => {
            this.changeData(data);
          }}
        >
          <span>{node.label}</span>
          <span class="node-operation">
            <i
              onClick={(e) => {
                e.stopPropagation();
                this.remove(node, data);
              }}
              class="el-icon-delete"
              title="删除"
            ></i>
          </span>
        </div>
      );
    },
    append(data) {
      if (!data.children) {
        this.$set(data, 'children', []);
      }
      this.type = 'add';
      this.dialogVisible = true;
      this.currentNode = data.children;
    },
    remove(node, data) {
      const { parent } = node;
      const children = parent.data.children || parent.data;
      const index = children.findIndex((d) => d.value === data.value);
      children.splice(index, 1);
    },
    addNode(data) {
      this.currentNode.push(data);
    },
    changeData(data) {
      this.type = 'edit';
      this.dialogVisible = true;
      // 缓存下来
      this.__data = data;
      this.dataLabel = data.label;
      this.dataValue = data.value;
      this.dataType = data.type;
    },
    editData(editData) {
      // 编辑__data
      this.__data.label = editData.label;
      this.__data.value = editData.value;
      this.__data.type = editData.type;
    }
  }
};
</script>


<style lang="scss" scoped>
.custom-tree-node {
  width: 100%;
  font-size: 14px;
  .node-operation {
    float: right;
  }
  i[class*='el-icon'] + i[class*='el-icon'] {
    margin-left: 6px;
  }
  .el-icon-plus {
    color: #409eff;
  }
  .el-icon-delete {
    color: #157a0c;
  }
}

.custom-tree-node{
  width: 100%;
  font-size: 14px;
  .node-operation{
    float: right;
  }
  i[class*="el-icon"] + i[class*="el-icon"]{
    margin-left: 6px;
  }
  .el-icon-plus{
    color: #409EFF;
  }
  .el-icon-delete{
    color: #157a0c;
  }
}
</style>
