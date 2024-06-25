<template>
  <elDialog v-model="dialogVisible" v-bind="$attrs" title="添加数据源" v-on="$listeners">
    <el-form ref="elForm" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name" type="text" placeholder="请入输名称" clearable :style="{ width: '100%' }">
        </el-input>
      </el-form-item>
      <!-- <el-form-item label="自动请求" prop="antoSend">
        <elSwitch v-model="formData.antoSend" active-text="" />
      </el-form-item> -->
      <el-form-item v-if="!formData.antoSend" label="请求条件" prop="sendOn">
        <el-input v-model="formData.sendOn" type="text" placeholder="请输入请求条件" clearable
          :style="{ width: '100%' }"></el-input>
      </el-form-item>
      <el-form-item label="服务域名" prop="host">
        <elSelect v-model="formData.host" placeholder="下拉选择" default-first-option>
          <elOption v-for="(option, index) in hostOptions" :key="index" :label="option.label" :value="option.label">
            <el-tooltip class="item" effect="dark" :content="option.value" placement="left">
              <span style="float: left">{{ option.label }}</span>
            </el-tooltip>
          </elOption>
        </elSelect>
        <elButton style="margin-left: 20px" icon="el-icon-setting" @click="showHostDialog">设置域名</elButton>
      </el-form-item>
      <el-form-item label="地址" prop="url">
        <el-input v-model="formData.url" type="text" placeholder="/path/to/your/service" clearable
          :style="{ width: '100%' }">
        </el-input>
      </el-form-item>
      <el-form-item label="Content-Type" prop="contentType" required>
        <elSelect v-model="formData.contentType" placeholder="下拉选择" default-first-option>
          <elOption v-for="(option, index) in contentTypeOptions" :key="index" :label="option.label"
            :value="option.value"></elOption>
        </elSelect>
      </el-form-item>
      <el-form-item label="请求方法" prop="method">
        <elSelect v-model="formData.method">
          <elOption label="get" value="get"></elOption>
          <elOption label="post" value="post"></elOption>
        </elSelect>
      </el-form-item>
      <el-form-item label="参数">
        <draggable :list="formData.options" :animation="340" group="selectItem" handle=".option-drag">
          <div v-for="(item, index) in formData.options" :key="index" class="select-item">
            <el-input v-model="item.key" placeholder="参数名" size="small" />
            <el-input style="margin-left: 10px" placeholder="参数值" size="small" :value="item.value"
              @input="setOptionValue(item, $event)">
              <elSelect v-model="item.content" slot="prepend" style="width: 130px">
                <elOption v-for="(item, index) in contentArr" :key="index" :label="item.label" :value="item.value">
                </elOption>
              </elSelect>
            </el-input>
            <div class="close-btn select-line-icon" @click="formData.options.splice(index, 1)">
              <i class="el-icon-remove-outline" />
            </div>
          </div>
        </draggable>
        <elButton style="padding-bottom: 0" icon="el-icon-circle-plus-outline" type="text" @click="addParamItem">
          添加参数
        </elButton>
      </el-form-item>
      <el-form-item label="参数转换" prop="useCode">
        <elSwitch v-model="formData.useCode"></elSwitch>
      </el-form-item>
      <el-form-item label="自定义函数" prop="optionSlotCode" v-if="formData.useCode === true">
        <CodeIcon :value="formData.optionSlotCode" :desc="{ defaultName: 'javascript' }" @input="getNewCode" />
      </el-form-item>
      <el-form-item label="结果转换" prop="useCodeEditor">
        <elSwitch v-model="formData.useCodeEditor"></elSwitch>
      </el-form-item>
      <el-form-item label="自定义函数" prop="resultCode" v-if="formData.useCodeEditor === true">
        <CodeIcon :value="formData.resultCode" :desc="{ defaultName: 'javascript' }" @input="getResultCode" />
      </el-form-item>
    </el-form>
    <template #footer>
      <elButton type="primary" @click="submitForm">确认</elButton>
      <elButton @click="close">取消</elButton>
    </template>
    <env-dialog v-if="showEnvDialog" :visible.sync="showEnvDialog"></env-dialog>
  </elDialog>
</template>
<script>
import { isNumberStr } from '@/utils/index';
import { mapGetters, mapMutations } from 'vuex';
import { getHostOptions } from '@/config/config';
import EnvDialog from '../../RunTime/components/EnvDialog.vue';
import CodeIcon from '@/components/editor/CodeIcon.editor';

export default {
  inheritAttrs: false,
  components: {
    'env-dialog': EnvDialog,
    CodeIcon
  },
  props: ['type', 'dataSource', 'index'],
  data() {
    let formData = {
      name: undefined,
      antoSend: true,
      sendOn: undefined,
      host: 'VUE_APP_EEO_HOST',
      url: undefined,
      method: 'post',
      options: [],
      contentType: 'json',
      useCode: false,
      useCodeEditor: false,
      optionSlotCode: {
        htmlCode: '',
        cssCode: '',
        jsCode:
          '// data是全部接口请求参数,直接修改data,将修改后的data返回\nfunction dataPipe(data) {\n\treturn data;\n}\n'
      },
      resultCode: {
        htmlCode: '',
        cssCode: '',
        jsCode:
          '// data是全部接口请求参数,直接修改data,将修改后的data返回\nfunction dataPipe(data) {\n\treturn data;\n}\n'
      }
    };
    if (this.type === 'edit') {
      formData = {
        ...this.dataSource[this.index]
      };
    }
    return {
      showEnvDialog: false,
      dialogVisible: true,
      formData,
      rules: {
        name: [
          {
            required: true,
            message: '请入输名称',
            trigger: 'blur'
          }
        ],
        antoSend: [
          {
            required: true,
            message: '自动请求不能为空',
            trigger: 'change'
          }
        ],
        sendOn: [
          {
            required: true,
            message: '请输入请求条件',
            trigger: 'blur'
          }
        ],
        url: [
          {
            required: true,
            message: '请输入url',
            trigger: 'blur'
          }
        ],
        method: [
          {
            required: true,
            message: '请求方法不能为空',
            trigger: 'change'
          }
        ]
      },
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
  computed: {
    ...mapGetters(['getModelName']),
    hostOptions: function () {
      return getHostOptions();
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
  created() { },
  methods: {
    ...mapMutations(['setOriginServer']),
    submitForm() {
      this.$refs['elForm'].validate((valid) => {
        // eslint-disable-next-line no-useless-return
        if (!valid) return;
        // TODO 提交表单
        this.$emit('update:visible', false);
        const clone = JSON.parse(JSON.stringify(this.formData));

        if (this.type === 'add') {
          this.dataSource.push(clone);
          this.setOriginServer(this.dataSource);
        } else {
          this.dataSource.splice(this.index, 1, clone);
          this.setOriginServer(this.dataSource);
        }
      });
    },
    getNewCode(data) {
      this.formData.optionSlotCode = data;
    },
    getResultCode(data) {
      this.formData.resultCode = data;
    },
    addParamItem(e) {
      e.preventDefault();
      this.formData.options.push({
        key: '',
        value: '',
        content: 'none'
      });
    },
    setOptionValue(item, val) {
      item.value = isNumberStr(val) ? +val : val;
    },
    close(e) {
      this.$emit('update:visible', false);
    },
    showHostDialog(e) {
      e.preventDefault();
      this.showEnvDialog = true;
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

  & .el-input+.el-input {
    margin-left: 4px;
  }
}

.select-item+.select-item {
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
