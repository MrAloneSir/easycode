<template>
  <div class="object-editor flex items-center" style="height: 32px;">
    <div class="btn-control" @click.stop="insertCode()">
      <Code theme="outline" size="14" fill="#409eff" />
    </div>
    <Monaco
      v-if="monacoVisiable"
      :codeString="codeString"
      :visiable="monacoVisiable"
      :defaultName="desc.defaultName"
      @actionMonaco="actionMonaco"
    />
  </div>
</template>

<script>
import Monaco from './coms/Monaco.vue';
export default {
  props: ['value', 'desc'],
  components: {
    Code: () => {
      return new Promise((resolve) => {
        import(/* webpackChunkName: "icon-pack-code" */ '@icon-park/vue').then((iconPark) => {
          resolve(iconPark.Code)
        });
      });
    },
    Monaco
  },
  data() {
    return {
      monacoVisiable: false
    };
  },
  methods: {
    insertCode() {
      this.codeString = this.value;
      this.monacoVisiable = true;
    },
    actionMonaco({ code, visiable }) {
      if (code === '') {
        this.monacoVisiable = visiable;
      } else {
        const { html, javascript, css, json } = code;
        this.monacoVisiable = visiable;
        this.$emit('input', {
          htmlCode: html,
          jsCode: javascript,
          cssCode: css,
          jsonCode: json
        });
      }
    }
  }
};
</script>
