<template>
  <el-dialog v-bind="$attrs" v-on="$listeners" :title="'校验' + formData.label" width="1200px">
    <el-form label-width="100px" :rules="rules" ref="formData" :model="formData">
      <div v-if="formData.ruleType === 'Type'">
        <el-form-item label="类型" prop="type" required>
          <el-input v-model="formData.type" placeholder="请填写数据类型" size="small" />
        </el-form-item>
      </div>
      <div v-if="formData.ruleType === 'Pattern'">
        <el-form-item label="正则" prop="pattern" required>
          <el-input v-model="formData.pattern" placeholder="请填写正则匹配" size="small" />
        </el-form-item>
      </div>
      <div v-if="formData.ruleType === 'validator'">
        <el-form-item label="函数" prop="validator" required>
          <el-input v-model="formData.validator" placeholder="请填写校验函数" size="small" />
        </el-form-item>
      </div>
      <div v-if="formData.ruleType === 'Range'">
        <el-form-item label="最小值" prop="min" required>
          <el-input-number v-model="formData.min" label="请填写最小值" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="最大值" prop="max" required>
          <el-input-number v-model="formData.max" label="请填写最大值" :min="0"></el-input-number>
        </el-form-item>
      </div>
      <div v-if="formData.ruleType === 'Length'">
        <el-form-item label="长度" prop="len" required>
          <el-input-number v-model="formData.len" label="请填写长度" :min="0"></el-input-number>
        </el-form-item>
      </div>
      <el-form-item label="错误提示" prop="message" required>
        <el-input v-model="formData.message" placeholder="请填写错误提示信息" size="small" />
      </el-form-item>
    </el-form>
    <template #footer>
      <elButton type="primary" @click="submitForm">确认</elButton>
      <elButton @click="onClose">取消</elButton>
    </template>
  </el-dialog>
</template>
<script>
import { deepClone } from '@/utils/index';

export default {
  props: ['rule', 'index', 'ruleList'],
  data() {
    return {
      formData: deepClone(this.rule),
      rules: {}
    };
  },
  methods: {
    submitForm(e) {
      e.preventDefault();
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          this.ruleList.splice(this.index, 1, this.formData);
          this.$emit('update:visible', false);
        } else {
          return false;
        }
      });
    },
    onClose() {
      this.$emit('update:visible', false);
    }
  }
};
</script>
