<template>
  <elDialog
    v-bind="$attrs"
    title="环境变量"
    @close="$emit('update:visible', false)"
    append-to-body
  >
    <el-form ref="elForm" :model="formData" :rules="rules" label-width="150px">
      <el-form-item label="master" prop="pro">
        <elInput
          v-model="formData.pro"
          type="textarea"
          placeholder="请输入master环境域名"
          clearable
          :autosize="{ minRows: 4, maxRows: 4 }"
          :style="{ width: '100%' }"
        ></elInput>
      </el-form-item>
      <el-form-item label="im" prop="pre">
        <elInput
          v-model="formData.pre"
          type="textarea"
          placeholder="请输入im环境域名"
          clearable
          :autosize="{ minRows: 4, maxRows: 4 }"
          :style="{ width: '100%' }"
        ></elInput>
      </el-form-item>
      <el-form-item label="14" prop="devtest">
        <elInput
          v-model="formData.devtest"
          type="textarea"
          placeholder="请输入14环境域名"
          clearable
          :autosize="{ minRows: 4, maxRows: 4 }"
          :style="{ width: '100%' }"
        ></elInput>
      </el-form-item>
      <el-form-item label="13" prop="development">
        <elInput
          v-model="formData.development"
          type="textarea"
          placeholder="请输入13环境域名"
          clearable
          :autosize="{ minRows: 4, maxRows: 4 }"
          :style="{ width: '100%' }"
        ></elInput>
      </el-form-item>
      <hr />
      <el-form-item label="登录Auth" prop="mock" class="mt-4">
        <elInput
          v-model="formData.Authorization"
          type="textarea"
          placeholder="请输入Authorization"
          clearable
          :autosize="{ minRows: 4, maxRows: 4 }"
          :style="{ width: '100%' }"
        ></elInput>
      </el-form-item>
    </el-form>
    <template #footer>
      <elButton type="primary" @click="submitForm">仅更新env</elButton>
      <elButton type="primary" @click="handleAuth">仅更新Auth</elButton>
      <elButton type="primary" @click="handleAll">全部更新</elButton>
    </template>
  </elDialog>
</template>
<script>
import { pageConfig } from '@/config/config';
import { envCreate } from '@/api/user.js';

export default {
  inheritAttrs: false,
  components: {},
  data() {
    let envConfig = sessionStorage.getItem('envConfig');
    const localAuthorization = localStorage.getItem('Authorization')
    let formData = {};
    if (envConfig) {
      envConfig = JSON.parse(envConfig);
      formData = { ...envConfig };
    } else {
      formData = { ...pageConfig.env };
    }
    if (localAuthorization) {
      formData.Authorization = localAuthorization
    }
    return {
      dialogVisible: false,
      formData,
      rules: {
        development: [],
        pre: [],
        pro: [],
        devtest: []
      }
    };
  },
  created() {},
  methods: {
    submitForm(e) {
      e?.preventDefault();
      let projectTag = this.$route?.query?.projectTag;
      if (!projectTag) {
        this.$message({
          message: '缺少必要参数',
          type: 'error'
        });
        return;
      }
      envCreate({
        projectTag,
        development: this.formData.development,
        pre: this.formData.pre,
        pro: this.formData.pro,
        devtest: this.formData.devtest
      }).then((res) => {
        if (res.code === 0) {
          sessionStorage.setItem('envConfig', JSON.stringify(this.formData));
        }
        this.$message({
          message: 'env' + res.message,
          type: res.code === 0 ? 'success' : 'error'
        });
        this.$emit('update:visible', false);
      });
    },
    handleAuth() {
      if (this.formData.Authorization) {
        localStorage.setItem('Authorization', this.formData.Authorization)
        this.$message({
          message: 'Auth更新成功',
          type: 'success'
        });
      }
      this.$emit('update:visible', false);

    },
    handleAll() {
      this.submitForm()
      this.handleAuth()
    }
  }
};
</script>
