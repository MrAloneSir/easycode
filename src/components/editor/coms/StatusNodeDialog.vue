<template>
  <div>
    <el-dialog
      v-bind="$attrs"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      v-on="$listeners"
      @open="onOpen"
    >
      <el-row :gutter="0">
        <el-form ref="elForm" :model="formData" :rules="rules" size="small" label-width="100px">
          <el-col :span="24">
            <el-form-item label="label值" prop="label">
              <el-input v-model="formData.label" placeholder="请输入选项名" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="颜色" prop="type">
              <el-radio-group v-model="formData.type">
                <el-radio label="primary">
                  <elStatus label="" type="primary" />
                </el-radio>
                <el-radio label="info">
                  <elStatus label="" type="info" />
                </el-radio>
                <el-radio label="success">
                  <elStatus label="" type="success" />
                </el-radio>
                <el-radio label="warning">
                  <elStatus label="" type="warning" />
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="value值" prop="value">
              <el-input v-model="formData.value" placeholder="请输入选项值" clearable>
                <el-select slot="append" v-model="valueType" :style="{ width: '100px' }">
                  <el-option
                    v-for="(item, index) in valueTypeOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled"
                  />
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer">
        <el-button type="primary" @click="handelConfirm"> 确定 </el-button>
        <el-button @click="close"> 取消 </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { isNumberStr } from '@/utils/index';

export default {
  props: ['dataLabel', 'dataValue', 'dataType', 'type'],
  data() {
    return {
      formData: {
        label: undefined,
        value: undefined
      },
      rules: {
        label: [
          {
            required: true,
            message: '请输入label',
            trigger: 'blur'
          }
        ],
        type: [
          {
            required: true,
            message: '请选择type',
            trigger: 'blur'
          }
        ],
        value: [
          {
            required: true,
            message: '请输入value',
            trigger: 'blur'
          }
        ]
      },
      valueType: 'string',
      valueTypeOptions: [
        {
          label: '字符串',
          value: 'string'
        },
        {
          label: '数字',
          value: 'number'
        }
      ]
    };
  },
  watch: {
    // eslint-disable-next-line func-names
    'formData.value': function (val) {
      this.valueType = isNumberStr(val) ? 'number' : 'string';
    }
  },
  methods: {
    onOpen() {
      // 修改
      if (this.type === 'edit') {
        this.formData = {
          label: this.dataLabel,
          value: this.dataValue,
          type: this.dataType
        };
      } else {
        this.formData = {
          label: undefined,
          value: undefined
        };
      }
    },
    close() {
      this.$emit('update:visible', false);
    },
    handelConfirm() {
      this.$refs.elForm.validate((valid) => {
        if (!valid) return;
        if (this.valueType === 'number') {
          this.formData.value = parseFloat(this.formData.value);
        }
        this.formData.id = Math.floor(Math.random() * 1000) + 3;
        if (this.type === 'edit') {
          this.$emit('edit', this.formData);
        } else {
          this.$emit('commit', this.formData);
        }
        this.close();
      });
    }
  }
};
</script>
