<template>
  <elDialog v-bind="$attrs" title="新建页面" @close="$emit('update:visible', false)">
    <el-form ref="elForm" :model="formData" :rules="rules" label-width="150px">
      <el-form-item label="页面名称" prop="resourceName">
        <el-input placeholder="请输入" v-model="formData.resourceName" clearable :style="{ width: '100%' }"></el-input>
      </el-form-item>
      <el-form-item label="页面英文名" prop="resourceUrl">
        <el-input v-model="formData.resourceUrl" placeholder="whiteList" clearable :style="{ width: '100%' }"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="submitForm">确认</el-button>
      <el-button @click="$emit('update:visible', false)">取消</el-button>
    </template>
  </elDialog>
</template>
<script>
import { resourceSave } from '@/api/user';
export default {
  inheritAttrs: false,
  components: {},
  data() {
    return {
      parentpage: [],
      formData: {
        resourceName: '',
        resourceUrl: '',
      },
      rules: {
        resourceName: [
          { required: true, message: '此项为必填项', trigger: 'blur' },
        ],
        resourceUrl: [{ required: true, message: '此项为必填项', trigger: 'blur' }],
      }
    };
  },
  methods: {
    submitForm(e) {
      e.preventDefault();
      this.$refs.elForm.validate(async (valid) => {
        if (!valid) return;
        let { projectTag } = this.$route?.query;
        if (!projectTag) {
          return;
        }
        await resourceSave({
          projectTag: projectTag,
          resourceName: this.formData.resourceName.trim(),
          resourceUrl: this.formData.resourceUrl.trim(),
        })
        this.$emit('addSuccess')
        this.$emit('update:visible', false)
      });
    }
  }
};
</script>
