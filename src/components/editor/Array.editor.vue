<template>
  <div class="array-editor">
    <elButton
      v-if="properties.length === 0 && desc.default"
      type="primary"
      icon="el-icon-document-add"
      @click="addDefault"
      >新增</elButton
    >
    <el-collapse v-else v-model="activeNames" accordion>
      <el-collapse-item
        class="array-item"
        v-for="(item, index) in properties"
        :key="index"
        :name="index"
      >
        <template slot="title">
          <div
            style="width: 100%;display: flex; justify-content: space-between; align-items: center;"
          >
            <div
              v-if="value[index] && desc.showLabel && parsePath(desc.showLabel, value[index])"
              class="label"
            >
              {{ parsePath(desc.showLabel, value[index]) }}
            </div>
            <div v-else></div>
            <el-dropdown>
              <div class="btn-control" @click.stop="">
                <i class="el-icon-s-tools"></i>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="index > 0" @click.native="moveUpItem(index)"
                  >上移
                  <i class="el-icon-upload2"></i>
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="index < properties.length - 1"
                  @click.native="moveDownItem(index)"
                  >下移
                  <i class="el-icon-upload2"></i>
                </el-dropdown-item>
                <el-dropdown-item @click.native="copyItem(index)"
                  >复制
                  <i class="el-icon-document-copy"></i>
                </el-dropdown-item>
                <el-dropdown-item @click.native="delItem(index)"
                  >删除
                  <i class="el-icon-delete"></i>
                </el-dropdown-item>
                <el-dropdown-item v-if="desc.valueType" @click.native="addItem(index)"
                  >新增
                  <i class="el-icon-plus"></i>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
        <Editor :desc="item" :model="value" @update="updateCom"></Editor>
      </el-collapse-item>
    </el-collapse>
    <div v-if="dialogVisible">
      <el-dialog title="提醒" :visible.sync="dialogVisible" width="30%">
        <el-row>
          <el-col :span="4"
            ><div>{{ this.desc.valueType.label }}:</div></el-col
          >
          <el-col :span="10">
            <elSelect v-model="dataType" placeholder="请选择" default-first-option>
              <elOption
                v-for="item in this.desc.valueType.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </elOption>
            </elSelect>
          </el-col>
        </el-row>

        <span slot="footer">
          <elButton @click="dialogVisible = false">取 消</elButton>
          <elButton type="primary" @click="handleSure">确 定</elButton>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { deepClone, parsePath } from '../../utils';
export default {
  components: {
    Editor: () => import('./index.vue')
  },
  props: ['value', 'desc'],
  inject: ['cloneComponent'],
  data() {
    return {
      dataType: null,
      dialogVisible: false,
      changeIndex: -1,
      defaultObj: {},
      activeNames: [0]
    };
  },
  computed: {
    properties() {
      let item = this.desc.item;
      let value = this.value;
      let edits = [];

      value.forEach((val, index) => {
        edits.push(
          Object.assign({}, item, {
            label: item.label || '',
            model: index
          })
        );
      });
      return edits;
    }
  },
  mounted() {
    if (this.desc.valueType) {
      this.desc.valueType.options.forEach((item, index) => {
        this.defaultObj[index] = item.default;
      });
    }
    //  let length = this.value.length;
    // this.activeNames =  Array.from({ length: length + 1 }, (v, i) => i);
  },
  methods: {
    updateCom(value) {
      let newVal = JSON.parse(JSON.stringify(value));
      this.$emit('input', newVal);
    },
    addDefault() {
      this.value.push(this.desc.default);
    },
    copyItem(index) {
      this.activeNames = [index + 1];
      let newVal = this.value;
      if (newVal.length > index) {
        let originItem = newVal[index];
        let colItem = null;
        if (originItem.__config__) {
          colItem = this.cloneComponent(originItem);
          colItem.prop = colItem.__config__.componentName;
        } else {
          colItem = deepClone(originItem);
        }
        newVal.splice(index + 1, 0, colItem);
      } else {
        newVal.push({});
      }

      this.$emit('input', newVal);
    },
    addItem(index) {
      this.activeNames = [index + 1];
      if (this.desc.valueType) {
        this.dialogVisible = true;
        this.changeIndex = index;
      } else {
        let newVal = this.value;
        if (newVal.length > 0) {
          let originItem = newVal[index];
          let colItem = null;
          if (originItem.__config__) {
            colItem = this.cloneComponent(originItem);
            colItem.prop = colItem.__config__.componentName;
          } else {
            colItem = deepClone(originItem);
          }
          newVal.splice(index + 1, 0, colItem);
        } else {
          newVal.push({});
        }
        this.$emit('input', newVal);
      }
    },
    handleSure() {
      const index = this.changeIndex;
      if (this.dataType) {
        this.dialogVisible = false;
        let newVal = this.value;
        let originItem = this.defaultObj[this.dataType];
        // item = this.cloneComponent(item);
        // item.prop = item.__config__.componentName;
        let colItem = null;
        if (originItem.__config__) {
          colItem = this.cloneComponent(originItem);
          colItem.prop = colItem.__config__.componentName;
        } else {
          colItem = deepClone(originItem);
        }
        newVal.splice(index + 1, 0, colItem);
      } else {
        this.$message({
          message: '请选择正确类型',
          type: 'warning'
        });
      }
    },
    delItem(index) {
      if (index > 0) {
        this.activeNames = [index - 1];
      } else {
        this.activeNames = [0];
      }
      let newVal = this.value;
      newVal.splice(index, 1);
      this.$emit('input', newVal);
    },
    moveUpItem(index) {
      this.activeNames = [index - 1];
      let newVal = this.value;
      let temp = newVal.splice(index, 1, newVal[index - 1])[0];
      newVal[index - 1] = temp;
      this.$emit('input', newVal);
    },
    moveDownItem(index) {
      this.activeNames = [index + 1];
      let newVal = this.value;
      let temp = newVal.splice(index, 1, newVal[index + 1])[0];
      newVal[index + 1] = temp;
      this.$emit('input', newVal);
    },
    parsePath(path, obj) {
      return parsePath(path)(obj);
    }
  }
};
</script>

<style lang="scss" scoped>
.array-editor {
  box-sizing: border-box;
  display: inline-block;
  width: 100%;
  border: 1px solid #dcdfe6;
  padding: 10px;
  border-radius: 4px;
}

// .array-item {
//   border-top: 2px solid #595959;
// }
.el-collapse-item__header {
  height: 30px;
  line-height: 30px;
}

.label {
  width: 150px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.el-collapse {
  border-top: none;
  border-bottom: none;
}

.array-item-extra {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.array-item-controls {
  display: flex;
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

.btn-add {
  width: 100%;
  margin-top: 10px;
}

/* 控制数组层级样式 */
.array-item-extra {
  background-color: #e4e7ed;
}
.array-editor .array-item-extra {
  background-color: #ebeef5;
}
.array-editor .array-editor .array-editor .array-item-extra {
  background-color: #f2f6fc;
}
</style>
