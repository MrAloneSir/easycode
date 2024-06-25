<template>
  <el-dialog v-bind="$attrs" title="新建页面" @close="$emit('update:visible', false)">
    <el-form ref="elForm" :model="formData" :rules="rules" label-width="150px">
      <el-form-item label="项目名称" prop="projectName">
        <el-input placeholder="请输入" v-model="formData.projectName" clearable :style="{ width: '100%' }"></el-input>
      </el-form-item>
      <el-form-item label="项目标签" prop="projectTag">
        <el-input v-model="formData.projectTag" placeholder="请输入" clearable :style="{ width: '100%' }"></el-input>
      </el-form-item>
      <el-form-item label="项目简介" prop="projectDesc">
        <el-input v-model="formData.projectDesc" placeholder="请输入" clearable :style="{ width: '100%' }"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <elButton type="primary" @click="submitForm">确认</elButton>
      <elButton @click="$emit('update:visible', false)">取消</elButton>
    </template>
  </el-dialog>
</template>
<script>
import { createProject, updateProject } from '@/api/user'
export default {
  inheritAttrs: false,
  props: {
    type: {
      type: String,
      default: 'add'
    },
    editData: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      formData: {
        projectName: this.type === 'add' ? '' : this.editData.projectName,
        projectTag: this.type === 'add' ? '' : this.editData.projectTag,
        projectDesc: this.type === 'add' ? '' : this.editData.projectDesc,
      },
      rules: {
        projectName: [
          { required: true, message: '此项为必填项', trigger: 'blur' },
        ],
        projectTag: [{ required: true, message: '此项为必填项', trigger: 'blur' }],
        projectDesc: [{ required: true, message: '此项为必填项', trigger: 'blur' }],
      }
    };
  },
  methods: {
    submitForm(e) {
      e.preventDefault();
      this.$refs.elForm.validate((valid) => {
        if (!valid) return;
        if (this.type === 'add') {
          this.create()
        } else {
          this.update()
        }
      });
    },
    async create() {
      const result = await createProject({
        ...this.formData
      })
      if (result.code === 0) {
        this.$message({
          message: '创建成功',
          type: 'success'
        })
        this.$emit('update:visible', false)
        this.$emit('success')
      }
    },
    async update() {
      const result = await updateProject({
        ...this.formData
      })
      if (result.code === 0) {
        this.$message({
          message: '更新成功',
          type: 'success'
        })
        this.$emit('update:visible', false)
        this.$emit('success')
      }
    }
  }
};
</script>
