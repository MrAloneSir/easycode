<template>
  <elDialog v-bind="$attrs" title="导入页面配置" @close="$emit('update:visible', false)" append-to-body>
    <el-form ref="elForm" :model="formData" label-width="150px">
      <el-form-item label="页面配置" prop="formConfJson" required>
        <elInput v-model="formData.formConfJson" type="textarea" placeholder="请输入页面配置" clearable
          :autosize="{ minRows: 20, maxRows: 20 }" :style="{ width: '100%' }"></elInput>
      </el-form-item>
    </el-form>
    <template #footer>
      <elButton type="primary" @click="submitForm">导入</elButton>
      <elButton @click="$emit('update:visible', false)">取消</elButton>
    </template>
  </elDialog>
</template>
<script>
import { pageUpdate } from '@/api/user.js';
import { deepClone } from '@/utils/index';

export default {
  inheritAttrs: false,
  components: {},
  data() {
    return {
      dialogVisible: false,
      formData: {
        formConfJson: ''
      }
    };
  },
  created() { },
  methods: {
    submitForm(e) {
      e?.preventDefault();
      let projectTag = this.$route?.query?.projectTag;
      let resourceUrl = this.$route?.query?.resourceUrl;
      if (!projectTag || !resourceUrl) {
        this.$message({
          message: '缺少必要参数',
          type: 'error'
        });
        return;
      }
      this.$refs.elForm.validate(async (valid) => {
        if (!valid) return;
        const formConf = JSON.parse(this.formData.formConfJson);
        const formConfClone = deepClone(formConf);
        delete formConfClone.fields
        const data = {
          projectTag,
          resourceUrl,
          resourceContent: JSON.stringify(formConf.fields),
          formConf: JSON.stringify(formConfClone),
        };
        pageUpdate(data).then((res) => {
          if (res.code === 0) {
            this.$message({
              message: '导入成功',
              type: 'success'
            });
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            });
          }
        });
        this.$emit('update:visible', false)
      });
    }
  }
};
</script>
