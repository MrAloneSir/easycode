<template>
  <div>
    <el-divider>布局结构树</el-divider>
    <el-tree :data="treeArr" :props="layoutTreeProps" :allow-drop="allowDrop" node-key="id"
      :current-node-key="currentNodeKey" default-expand-all ref="tree" :highlight-current="true" show-checkbox draggable>
      <span slot-scope="{ node, data }">
        <span class="node-label">
          <el-icon :type="getIcon(data)" />
          {{ node.label }}
          <el-dropdown trigger="click" v-if="funcListData(data).length > 0">
            <span>
              <svg-icon icon-class="code" class-name="icon-class" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(item, index) in funcListData(data) || []" :key="index"
                @click.native="showCode(item)">{{ item.label }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
      </span>
    </el-tree>
    <Monaco v-if="showMonaco" :codeString="codeString.value" :visiable="showMonaco" defaultName="javascript"
      @actionMonaco="handleFunc" />
    <div class="clipboard">
      <el-tooltip content="选中组件，点击按钮，即可复制成功组件" placement="top" effect="light">
        <el-button type="primary" plain circle :disabled="treeArr.length ? false : true" @click="getCheckedNodes"
          icon="el-icon-scissors">
        </el-button></el-tooltip>
      <el-tooltip placement="top" effect="light">
        <el-button type="warning" circle plain icon="el-icon-copy-document" @click="copyListNodes"></el-button>
        <div slot="content" style="width:150px">
          点击后，可以粘贴已复制的组件至结构树末尾，通过拖拽结构树节点移动，可以重新调整结构～
        </div>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import Monaco from '../../../components/editor/coms/Monaco';
export default {
  components: { Monaco },
  props: ['drawingList', 'activeId'],
  computed: {
    treeArr: function () {
      let newTreeArr = this.treeData(this.drawingList);
      return newTreeArr.map((item) => {
        item.id = item.__config__.formId;
        if (item.__config__.children) {
          item.__children__ = item.__config__.children;
        }
        return item;
      });
    }
  },
  watch: {
    activeId: {
      handler(val) {
        this.$refs['tree'].setCheckedKeys([val]);
        this.currentNodeKey = val;
      }
    },
    treeArr: {
      handler(val) {
        this.getFunc(this.treeArr);
      },
      deep: true
    }
  },
  created() {
    this.getFunc(this.treeArr);
  },
  mounted() {
    this.$refs['tree'].setCheckedKeys([this.activeId]);
  },
  data() {
    return {
      currentNodeKey: '',
      funcList: [],
      layoutTreeProps: {
        label(data, node) {
          const config = data.__config__;
          return config.componentName || `${config?.label || ''}: ${data.__vModel__}`;
        },
        children: '__children__'
      },
      treeIds: [],
      actionTypeOptions: [
        {
          label: '请求ajax',
          value: 'ajax'
        },
        {
          label: '提交表单',
          value: 'form'
        },
        {
          label: '自定义事件',
          value: 'custom'
        }
      ],
      showMonaco: false,
      codeString: null
    };
  },
  methods: {
    handleFunc({ code, visiable }) {
      try {
        if (code) {
          this.codeString.value = code;
          this.$emit('getNewCode', this.codeString);
        }
      } catch (error) {
        console.log(error);
      }
      this.showMonaco = visiable;
    },
    showCode(code) {
      this.showMonaco = true;
      this.codeString = code;
    },
    // 下拉列表获取当前组件函数列表
    funcListData(data) {
      let arr = this.funcList.filter((item) => item.id === data.id);
      return arr;
    },
    // 处理全部组件对应的函数列表
    getFunc(data) {
      this.funcList = [];
      data.forEach((item) => {
        // 远程数据，转换结果自定义函数
        if (item?.__config__?.useCodeFilter) {
          let newObj = {};
          newObj.id = item.id;
          newObj.label = '转换结果';
          newObj.value = item.__config__.optionSlotCode;
          newObj.funcType = 'useCodeFilter';
          this.funcList?.push(newObj);
        }
        // 远程数据，参数转换函数
        if (item?.__config__?.useParamCode) {
          let newObj = {};
          newObj.id = item.id;
          newObj.label = '参数转换';
          newObj.value = item.__config__.paramCode;
          newObj.funcType = 'useParamCode';
          this.funcList?.push(newObj);
        }
        // 新建动作，处理绑定动作函数
        if (item?.__config__?.action?.length > 0) {
          item.__config__.action.forEach((actionItem) => {
            let actionType = this.actionTypeOptions.filter(
              (item) => item.value === actionItem.actionType
            );
            // 绑定自定义函数
            if (actionItem.actionType == 'custom') {
              let newObj = {};
              newObj.id = item.id;
              newObj.label = '自定义函数';
              newObj.value = actionItem.paramCode;
              newObj.actionType = actionItem.actionType;
              this.funcList?.push(newObj);
            }
            // 提交表单或者请求ajax时，自定义参数格式
            if (actionItem.useCode) {
              let newObj = {};
              newObj.id = item.id;
              newObj.label = actionType[0].label + '自定义参数格式';
              newObj.value = actionItem.optionSlotCode;
              newObj.actionType = actionItem.actionType;
              newObj.funcType = 'useCode';
              this.funcList?.push(newObj);
            }
            // 提交表单或者请求ajax时，启用回调函数
            if (actionItem.useCBCode) {
              let newObj = {};
              newObj.id = item.id;
              newObj.label = actionType[0].label + '回调函数';
              newObj.value = actionItem.paramCode;
              newObj.actionType = actionItem.actionType;
              newObj.funcType = 'useCBCode';
              this.funcList?.push(newObj);
            }
          });
        }
        if (item.__children__) {
          this.getFunc(item.__children__);
        }
      });
    },
    treeData(arr) {
      arr?.forEach((item) => {
        item.id = item.__config__.formId;
        if (item.__config__.children) {
          item.__children__ = item.__config__.children;
          this.treeData(item.__config__.children);
        }
      });
      return arr;
    },
    // 获取全部id数组，为field重名做判断
    getTreeIds(treeArr) {
      treeArr.forEach((item) => {
        this.treeIds.push(item.id);
        if (item.__children__) {
          this.getTreeIds(item.__children__);
        }
      });
    },
    // 获取copy来的组件全部id数组，为field重名做判断
    getCopyIds(list) {
      list.forEach((item) => {
        if (this.treeIds.includes(item.id)) {
          item.id = item.id + 120;
          item.__config__.formId = item.id;
          item.__vModel__ = 'field' + item.__config__.formId;
        }
        if (item.__children__) {
          this.getCopyIds(item.__children__);
        }
      });
      return list;
    },
    copyListNodes() {
      var list = JSON.parse(localStorage.getItem('copyList'));
      // this.getTreeIds(this.treeArr);
      // const newList = this.getCopyIds(list);
      // const newDrawingList = this.drawingList.concat(newList);
      // this.$emit('getCopyList', JSON.stringify(newDrawingList));
      this.$emit('getCopyList', list);
      this.$message({
        message: `已成功粘贴 ${list.length} 个组件,快去把他们挪到正确位置吧～`,
        type: 'success'
      });
    },
    getCheckedNodes() {
      var checkedNodes = this.$refs.tree.getCheckedNodes();
      this.$refs.tree.getCheckedNodes()?.map((item, index) => {
        if (item?.__children__) {
          checkedNodes.splice(index + 1, item?.__children__.length);
        }
      });
      localStorage.setItem('copyList', JSON.stringify(checkedNodes));
      this.$message({
        message: `已成功复制 ${checkedNodes.length} 个组件,快去粘贴吧～`,
        type: 'success'
      });
    },
    allowDrop(draggingNode, dropNode, type) {
      if (type === 'inner' && !dropNode.children) {
        return false;
      }
      return true;
    },
    getIcon(data) {
      if (data.__config__ && data.__config__.tagIcon) {
        return data.__config__.tagIcon;
      }
      return '';
    }
  }
};
</script>

<style lang="scss" scoped>
.node-label {
  font-size: 14px;
}

.node-icon {
  color: #bebfc3;
}

.clipboard {
  display: flex;
  justify-content: space-evenly;
  width: 255px;
  padding: 5px 30px;
  position: absolute;
  bottom: 2px;
  box-shadow: 2px -2px 5px #e8e8e8;
}

.icon-class {
  width: 10px !important;
  height: 10px !important;
  // margin-left: 14px;
}
</style>
