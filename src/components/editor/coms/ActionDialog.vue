<template>
  <el-dialog v-bind="$attrs" v-on="$listeners" title="动作" width="1200px">
    <el-form label-width="120px" :rules="rules" ref="formData" :model="formData">
      <el-row>
        <el-col :span="6">
          <el-form-item label="动作" prop="actionType">
            <el-select
              v-model="formData.actionType"
              placeholder="请选择内置动作"
              clearable
              :style="{ width: '100%' }"
            >
              <el-option
                v-for="(item, index) in actionTypeOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <div v-if="formData.actionType === 'url'">
            <el-form-item label="目标页面" prop="url">
              <elSelect v-model="formData.url">
                <elOption
                  v-for="(item, index) in routeList"
                  :key="index"
                  :label="item.resourceName + '(' + item.resourceUrl + ')'"
                  :value="item.resourceId"
                ></elOption>
              </elSelect>
            </el-form-item>
            <el-form-item label="跳转方式" prop="routerType">
              <elSelect v-model="formData.routerType">
                <elOption label="push" value="push"></elOption>
                <elOption label="replace" value="replace"></elOption>
              </elSelect>
            </el-form-item>
            <el-form-item label="其他参数">
              <div v-for="(item, index) in formData.options" :key="index" class="select-item">
                <el-input v-model="item.key" placeholder="参数名" size="small" />
                <el-input
                  style="margin-left: 10px"
                  placeholder="参数值"
                  size="small"
                  :value="item.value"
                  @input="setOptionValue(item, $event)"
                >
                  <elSelect v-model="item.content" slot="prepend" style="width: 130px">
                    <elOption
                      v-for="(item, index) in contentArr"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    ></elOption>
                  </elSelect>
                </el-input>
                <div class="close-btn select-line-icon" @click="formData.options.splice(index, 1)">
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
            </el-form-item>
          </div>
          <div v-if="formData.actionType === 'closeDialog'">
            <el-form-item label="弹框名" prop="name">
              <el-select
                v-model="formData.name"
                placeholder="请选择关闭弹框"
                clearable
                multiple
                :style="{ width: '100%' }"
              >
                <el-option
                  v-for="(item, index) in dialogList"
                  :key="index"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div v-if="formData.actionType === 'message'">
            <el-form-item label="消息类型" prop="type">
              <el-select
                v-model="formData.type"
                placeholder="请选择消息类型"
                clearable
                :style="{ width: '100%' }"
              >
                <el-option
                  v-for="(item, index) in messageTypeOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="消息内容" prop="msgContent">
              <el-input v-model="formData.msgContent"></el-input>
            </el-form-item>
          </div>
          <div v-if="formData.actionType === 'link'">
            <el-form-item label="地址" prop="linkUrl">
              <el-input v-model="formData.linkUrl" placeholder="请输入url地址"></el-input>
            </el-form-item>
          </div>
          <div v-if="formData.actionType === 'store'">
            <el-form-item label="目标:" prop="target">
              <elSelect v-model="formData.target">
                <elOption label="localStorage" value="localStorage"></elOption>
                <elOption label="window" value="window"></elOption>
              </elSelect>
            </el-form-item>
            <el-form-item label="存储信息">
              <div v-for="(item, index) in formData.options" :key="index" class="select-item">
                <el-input v-model="item.key" placeholder="参数key" size="small" />
                <el-input
                  style="margin-left: 10px"
                  placeholder="参数值"
                  size="small"
                  :value="item.value"
                  @input="setOptionValue(item, $event)"
                >
                  <elSelect v-model="item.content" slot="prepend" style="width: 130px">
                    <elOption
                      v-for="(item, index) in contentArr"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    ></elOption>
                  </elSelect>
                </el-input>
                <div class="close-btn select-line-icon" @click="formData.options.splice(index, 1)">
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
            </el-form-item>
          </div>
          <div v-if="formData.actionType === 'custom'">
            <el-form-item label="自定义代码" prop="paramCode"
              ><CodeIcon v-model="formData.paramCode" :desc="{ defaultName: 'javascript' }" />
            </el-form-item>
          </div>
          <div v-if="formData.actionType === 'ajax' || formData.actionType === 'form'">
            <el-form-item label="host" prop="api.host" required>
              <elSelect v-model="formData.api.host" placeholder="下拉选择" default-first-option>
                <elOption
                  v-for="(option, index) in hostOptions"
                  :key="index"
                  :label="option.label"
                  :value="option.label"
                >
                  <el-tooltip class="item" effect="dark" :content="option.value" placement="left">
                    <span style="float: left">{{ option.label }}</span>
                  </el-tooltip></elOption
                >
              </elSelect>
            </el-form-item>
            <el-form-item
              label="url"
              required
              prop="api.url"
            >
              <elInput v-model="formData.api.url" type="text" placeholder="请输入url" clearable />
            </el-form-item>
            <el-form-item label="Content-Type" prop="api.contentType" required>
              <elSelect
                v-model="formData.api.contentType"
                placeholder="下拉选择"
                default-first-option
              >
                <elOption
                  v-for="(option, index) in contentTypeOptions"
                  :key="index"
                  :label="option.label"
                  :value="option.value"
                ></elOption>
              </elSelect>
            </el-form-item>
            <el-form-item
              v-if="formData.actionType === 'ajax'"
              label="请求方法"
              prop="api.method"
              required
            >
              <elSelect v-model="formData.api.method">
                <elOption label="get" value="GET"></elOption>
                <elOption label="post" value="POST"></elOption>
              </elSelect>
            </el-form-item>
            <el-form-item
              v-if="formData.actionType === 'form'"
              label="选择form表单"
              prop="formArr"
              required
            >
              <el-select
                v-model="formData.formArr"
                placeholder="请选择form表单"
                clearable
                multiple
                :style="{ width: '100%' }"
              >
                <el-option
                  v-for="(item, index) in getModelName"
                  :key="index"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="其他参数">
              <div v-for="(item, index) in formData.options" :key="index" class="select-item">
                <el-input v-model="item.key" placeholder="参数名" size="small" />
                <el-input
                  style="margin-left: 10px"
                  placeholder="参数值"
                  size="small"
                  :value="item.value"
                  @input="setOptionValue(item, $event)"
                >
                  <elSelect v-model="item.content" slot="prepend" style="width: 130px">
                    <elOption
                      v-for="(item, index) in contentArr"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    ></elOption>
                  </elSelect>
                </el-input>
                <div class="close-btn select-line-icon" @click="formData.options.splice(index, 1)">
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
            </el-form-item>
            <el-form-item label="参数转换" prop="useCode">
              <elSwitch v-model="formData.useCode"></elSwitch>
            </el-form-item>
            <el-form-item
              label="自定义函数"
              prop="optionSlotCode"
              v-if="formData.useCode === true"
              ><CodeIcon v-model="formData.optionSlotCode" :desc="{ defaultName: 'javascript' }" />
            </el-form-item>
            <el-divider></el-divider>
            <el-form-item label="请求前二次确认">
              <el-form-item label="文案">
                <el-input
                  v-model="formData.confirmText"
                  type="text"
                  placeholder="请输入请求前确认文案"
                  clearable
                  :style="{ width: '100%' }"
                >
                </el-input>
              </el-form-item>
            </el-form-item>
            <el-form-item
              v-if="formData.actionType === 'form'"
              label="成功后是否清空"
              props="reset"
            >
              <elSwitch v-model="formData.reset"></elSwitch>
            </el-form-item>
            <el-divider></el-divider>
            <el-form-item label="结果转换" prop="useCBCode">
              <elSwitch v-model="formData.useCBCode"></elSwitch>
            </el-form-item>
            <el-form-item label="自定义代码" prop="paramCode" v-if="formData.useCBCode">
              <CodeIcon v-model="formData.paramCode" :desc="{ defaultName: 'javascript' }" />
            </el-form-item>
            <el-form-item label="请求后关闭弹框" prop="afterCloseDialogName">
              <el-select
                v-model="formData.afterCloseDialogName"
                placeholder="请选择关闭弹框"
                clearable
                multiple
                :style="{ width: '100%' }"
              >
                <el-option
                  v-for="(item, index) in dialogList"
                  :key="index"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="请求后刷新页面">
              <el-form-item label="刷新">
                <elSwitch v-model="formData.reload"></elSwitch>
              </el-form-item>
            </el-form-item>
            <el-form-item label="请求后刷新组件">
              <el-form-item label="刷新组件">
                <EmitField v-model="formData.emitList"></EmitField>
              </el-form-item>
            </el-form-item>
            <!-- <el-form-item label="请求后打开url">
              <el-form-item label="地址">
                <el-input
                  v-model="formData.redirect"
                  type="text"
                  placeholder="请输入url地址"
                  clearable
                  :style="{ width: '100%' }"
                >
                </el-input>
              </el-form-item>
            </el-form-item> -->
            <!-- <el-form-item label="跳转页面">
              <el-form-item label="目标页面" prop="afterUrl">
                <elSelect v-model="formData.afterUrl">
                  <elOption
                    v-for="(item, index) in routeList"
                    :key="index"
                    :label="item.resourceName + '(' + item.resourceUrl + ')'"
                    :value="item.resourceId"
                  ></elOption>
                </elSelect>
              </el-form-item>
              <el-form-item label="跳转方式" prop="afterRouterType">
                <elSelect v-model="formData.afterRouterType">
                  <elOption label="push" value="push"></elOption>
                  <elOption label="replace" value="replace"></elOption>
                </elSelect>
              </el-form-item>
              <el-form-item label="其他参数">
                <div
                  v-for="(item, index) in formData.afterOptions"
                  :key="index"
                  class="select-item"
                >
                  <el-input v-model="item.key" placeholder="参数名" size="small" />
                  <el-input
                    style="margin-left: 10px"
                    placeholder="参数值"
                    size="small"
                    :value="item.value"
                    @input="setOptionValue(item, $event)"
                  >
                    <elSelect v-model="item.content" slot="prepend" style="width: 130px">
                      <elOption
                        v-for="(item, index) in contentArr"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                      ></elOption>
                    </elSelect>
                  </el-input>
                  <div
                    class="close-btn select-line-icon"
                    @click="formData.afterOptions.splice(index, 1)"
                  >
                    <i class="el-icon-remove-outline" />
                  </div>
                </div>
                <elButton
                  style="padding-bottom: 0"
                  icon="el-icon-circle-plus-outline"
                  type="text"
                  @click="addAfterParamItem"
                >
                  添加参数
                </elButton>
              </el-form-item>
            </el-form-item> -->
            <el-form-item label="请求后toast">
              <el-form-item>
                <div style="display: flex">
                  <el-tooltip class="item" effect="dark" placement="top">
                    <div slot="content">
                      系统默认res.code == 0 为接口返回成功<br />
                      如需显示文案为固定内容，请填写输入框<br />
                      如不填写，则显示文案为接口返回: res.msg || res.message<br />
                      若不填写固定文案，接口也没返回上述两个字段，则不显示toast
                    </div>
                    <span class="responseText">成功文案</span>
                  </el-tooltip>
                  <el-input
                    :disabled="formData.editText"
                    v-model="formData.message.success"
                    type="text"
                    placeholder="请输入成功文案"
                    clearable
                    :style="{ width: 'cala( 100% - 120px)' }"
                  >
                  </el-input>
                </div>
              </el-form-item>

              <el-form-item>
                <div style="display: flex">
                  <el-tooltip class="item" effect="dark" placement="top">
                    <div slot="content">
                      系统默认res.code != 0 为接口返回成功<br />
                      如需显示文案为固定内容，请填写输入框<br />
                      如不填写，则显示文案为接口返回:res.msg || res.message<br />
                      若不填写固定文案，接口也没返回上述两个字段，则不显示toast
                    </div>
                    <span class="responseText">失败文案</span>
                  </el-tooltip>

                  <el-input
                    :disabled="formData.editText"
                    v-model="formData.message.failed"
                    type="text"
                    placeholder="请输入失败文案"
                    clearable
                    :style="{ width: 'cala( 100% - 120px)' }"
                  >
                  </el-input>
                </div>
              </el-form-item>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <el-form-item label-width="100px" label="提醒:" required>
      <p>表格筛选的<b>查询</b>和<b>重置</b>动作，请使用<b>表格筛选容器</b>组件</p>
    </el-form-item>
    <template #footer>
      <elButton type="primary" @click="submitForm">确认</elButton>
      <elButton @click="onClose">取消</elButton>
    </template>
  </el-dialog>
</template>
<script>
import {
  UrlActionSchema,
  DialogActionSchema,
  FormActionSchema,
  CloseDialogActionSchema,
  AjaxActionSchema,
  MessageActionSchema,
  LinkActionSchema,
  customActionSchema,
  storeDataSchema,
} from '@/config/action';
import { deepClone } from '@/utils/index';
import { mapGetters } from 'vuex';
import { isNumberStr } from '@/utils/index';

import { getHostOptions } from '@/config/config';
import EmitField from './EmitField';
import CodeIcon from '../CodeIcon.editor';

export default {
  components: { CodeIcon, EmitField },
  props: ['actionList', 'index'],
  inject: ['cloneComponent', 'drawingList'],
  computed: {
    ...mapGetters(['getModelName', 'getRouteInfo', 'getServerName']),
    hostOptions: function() {
      return getHostOptions();
    },
    contentArr: function() {
      let arr = this.getModelName.map((item) => {
        return {
          label: item,
          value: item
        };
      });
      return [...this.selectOptions, ...arr, ...this.getServerName];
    },
    dialogList: function() {
      const list = this.drawingList();
      return list
        .filter((item) => {
          return item.__config__.tag === 'el-dialog';
        })
        .map((item) => item.__config__.componentName);
    },
    routeList: function() {
      return this.getRouteInfo(this.$route.query.projectId);
    }
  },
  data() {
    let action = {
      actionType: ''
    };
    if (this.index >= 0) {
      action = this.actionList[this.index];
    }
    return {
      loading: false,
      mioneApis: [],
      formData: action,
      dialogVisible: true,
      rules: {
        actionType: [
          {
            required: true,
            message: '请选择内置动作',
            trigger: 'change'
          }
        ],
        url: [
          {
            required: true,
            message: '请输入url',
            trigger: 'blur'
          }
        ],
        type: [
          {
            required: true,
            message: '请选择消息类型',
            trigger: 'change'
          }
        ],
        linkUrl: [
          {
            required: true,
            message: '请输入url地址',
            trigger: 'blur'
          }
        ],
        msgContent: [
          {
            required: true,
            message: '请输入消息内容',
            trigger: 'blur'
          }
        ]
      },
      actionTypeOptions: [
        {
          label: '打开弹框',
          value: 'dialog'
        },
        {
          label: '关闭弹框',
          value: 'closeDialog'
        },
        {
          label: '请求ajax',
          value: 'ajax'
        },
        // {
        //   label: '跳转页面',
        //   value: 'url'
        // },
        // {
        //   label: '打开url',
        //   value: 'link'
        // },
        {
          label: '提交表单',
          value: 'form'
        },
        {
          label: '消息提醒',
          value: 'message'
        },
        {
          label: '存储数据',
          value: 'store'
        },
        {
          label: '自定义事件',
          value: 'custom'
        }
      ],
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
          label: 'checkedTable',
          value: 'checkedTable'
        },
        {
          label: 'state',
          value: 'state'
        }
      ],
      messageTypeOptions: [
        {
          label: 'success',
          value: 'success'
        },
        {
          label: 'warning',
          value: 'warning'
        },
        {
          label: 'info',
          value: 'info'
        },
        {
          label: 'error',
          value: 'error'
        }
      ],
      contentTypeOptions: [
        {
          label: 'application/json',
          value: 'json'
        },
        {
          label: 'application/x-www-form-urlencoded;charset=UTF-8;',
          value: 'form'
        }
      ]
    };
  },
  watch: {
    'formData.url': {
      handler(newVal, oldVal) {
        const tmp = this.routeList.filter((item) => {
          return item.resourceId == newVal;
        });
        if (tmp && tmp.length) {
          this.formData.resourceUrl = tmp[0].resourceUrl;
        }
      }
    },
    'formData.afterUrl': {
      handler(newVal, oldVal) {
        const tmp = this.routeList.filter((item) => {
          return item.resourceId == newVal;
        });
        if (tmp && tmp.length) {
          this.formData.resourceUrl = tmp[0].resourceUrl;
        }
      }
    },
    'formData.actionType': function(val) {
      let schema = null;
      switch (val) {
        case 'dialog':
          schema = deepClone(DialogActionSchema);
          break;
        case 'closeDialog':
          schema = deepClone(CloseDialogActionSchema);
          break;
        case 'ajax':
          schema = deepClone(AjaxActionSchema);
          break;
        case 'url':
          schema = deepClone(UrlActionSchema);
          break;
        case 'link':
          schema = deepClone(LinkActionSchema);
          break;
        case 'form':
          schema = deepClone(FormActionSchema);
          break;
        case 'message':
          schema = deepClone(MessageActionSchema);
          break;
        case 'custom':
          schema = deepClone(customActionSchema);
          break;
        case 'store':
          schema = deepClone(storeDataSchema);
          break;
        default:
          break;
      }
      this.formData = schema;
    }
  },
  methods: {
    submitForm(e) {
      e.preventDefault();
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          let cloneSchema = null;
          if (this.formData.actionType === 'dialog') {
            cloneSchema = deepClone(DialogActionSchema);
            const dialog = this.cloneComponent(cloneSchema.dialog);
            const footerBtn = dialog.__config__.footerBtn;
            const sureBtn = footerBtn[0];
            const cancelBtn = footerBtn[1];
            // 添加关闭弹框名称
            sureBtn.__config__.action.push({
              actionType: 'closeDialog',
              name: [dialog.__config__.componentName]
            });
            cancelBtn.__config__.action.push({
              actionType: 'closeDialog',
              name: [dialog.__config__.componentName]
            });
            cloneSchema.dialog = dialog;
          } else {
            cloneSchema = deepClone(this.formData);
          }
          // 编辑状态
          if (this.index >= 0) {
            this.actionList.splice(this.index, 1, cloneSchema);
          } else {
            this.actionList.push(cloneSchema);
          }
          this.$emit('update:visible', false);
        } else {
          return false;
        }
      });
    },
    setOptionValue(item, val) {
      item.value = isNumberStr(val) ? +val : val;
    },
    addParamItem(e) {
      e.preventDefault();
      this.formData.options.push({
        key: '',
        value: '',
        content: 'none'
      });
    },
    addAfterParamItem(e) {
      e.preventDefault();
      this.formData.afterOptions.push({
        key: '',
        value: '',
        content: 'none'
      });
    },
    onClose() {
      this.$emit('update:visible', false);
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
.responseText {
  width: 120px;
  text-align: right;
  font-size: 12px;
  padding-right: 12px;
  line-height: 32px;
}
</style>
