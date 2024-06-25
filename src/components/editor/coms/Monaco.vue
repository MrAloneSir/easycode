<template>
  <div>
    <el-dialog
      title="请输入要插入的代码"
      :visible="visiable"
      :before-close="closeMonaco"
      append-to-body
      width="60%"
      top="50px"
    >
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :disabled="!defaultName.includes('html')" label="html" name="html">
        </el-tab-pane>
        <!-- <el-tab-pane :disabled="!defaultName.includes('slotJs')" label="slotJs" name="slotJs">
        </el-tab-pane> -->
        <el-tab-pane
          :disabled="!defaultName.includes('javascript')"
          label="javascript"
          name="javascript"
        >
        </el-tab-pane>
        <el-tab-pane :disabled="!defaultName.includes('css')" label="css" name="css"> </el-tab-pane>
        <el-tab-pane :disabled="!defaultName.includes('json')" label="json" name="json">
        </el-tab-pane>
      </el-tabs>
      <div id="codeArea" v-loading="loading"></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeMonaco">取 消</el-button>
        <el-button type="primary" @click="action">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import loader from '@monaco-editor/loader';
export default {
  name: 'Editor',
  props: ['visiable', 'codeString', 'defaultName'],
  inject: ['monacoObj'],
  data() {
    return {
      loading: false,
      editor: null,
      monaco: null,
      activeName: this.defaultName?.split(',')?.[0] || 'html',
      code: {
        javascript: '',
        html: '',
        css: '',
        json: ''
      }
    };
  },
  mounted() {
    const { htmlCode, jsCode, cssCode, jsonCode } = this.codeString;
    this.code.javascript = jsCode || '';
    this.code.html = htmlCode || '';
    this.code.css = cssCode || '';
    this.code.json = jsonCode || '';

    setTimeout(() => {
      console.log('mount', this?.monacoObj?.monaco);
      this.monaco = this?.monacoObj?.monaco;
      this.initMonaco(this.monaco);
    });
  },
  methods: {
    initMonaco(monaco) {
      this.loading = true;
      const editorOptions = {
        language: this.defaultName?.split(',')?.[0] || 'html',
        value: this.code?.[this.defaultName?.split(',')?.[0]] || this.code.html,
        minimap: { enabled: false },
        lineNumbers: 'off',
        roundedSelection: false,
        scrollBeyondLastLine: false,
        readOnly: false,
        theme: 'vs-dark'
      };
      this.editor = monaco?.editor?.create?.(document.getElementById('codeArea'), editorOptions);

      if (monaco) {
        this.loading = false;
      }

      setTimeout(() => {
        this?.editor
          ?.getAction('editor.action.formatDocument')
          .run()
          .then();
      }, 200);
    },
    handleClick(val) {},
    closeMonaco() {
      const tmp = this.codeString;
      this.$emit('actionMonaco', {
        code: '',
        visiable: false
      });
    },
    action() {
      this.code[this.activeName] = this?.editor?.getValue();
      this.$emit('actionMonaco', { code: this.code, visiable: false });
    }
  },
  watch: {
    monacoObj(newVal) {
      console.log('new', newVal);
      this.monaco = newVal?.monaco;
      this.initMonaco(this.monaco);
    },
    async activeName(newVal, oldVal) {
      this.code[oldVal] = this?.editor?.getValue();
      if (this?.monaco?.editor) {
        this.monaco.editor.setModelLanguage(this?.editor?.getModel(), newVal);
      }
      if (this?.editor) {
        this.editor.setValue(this.code[newVal]);
      }
      setTimeout(() => {
        this?.editor
          ?.getAction('editor.action.formatDocument')
          .run()
          .then();
      }, 200);
    }
  }
};
</script>
<style scoped>
#codeArea {
  width: 100%;
  min-height: 600px;
}
</style>
