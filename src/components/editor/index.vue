<template>
  <el-form-item v-if="isShow" :label="desc.label" :label-width="labelWidth">
    <template v-if="desc.explain" slot="label">
      <el-tooltip placement="top">
        <div v-if="desc.linkUrl" slot="content">
          <a :href="desc.linkUrl()" target="_blank" style="color:#fff">{{ desc.explain }} </a>
        </div>
        <div v-else-if="desc.explain" slot="content" v-html="desc.explain"></div>
        <span>{{ desc.label }}</span>
      </el-tooltip>
    </template>

    <component :is="desc.type" :desc="desc" v-model="value"></component>
  </el-form-item>
</template>

<script>
import edArray from './Array.editor.vue';
import edNumber from './Number.editor.vue';
import edBoolean from './Boolean.editor.vue';
import edCode from './Code.editor.vue';
import edObject from './Object.editor.vue';
import edString from './String.editor.vue';
import edCodeIcon from './CodeIcon.editor.vue';
import edSelect from './Select.editor.vue';
import edTree from './Tree.editor.vue';
import divider from './divider.vue';
import edSlider from './Slider.editor.vue';
import edAction from './Action.editor.vue';
import edAddComp from './AddComp.editor.vue';
import edColor from './Color.editor.vue';
import edParam from './Param.editor.vue';
import edRule from './Rule.editor.vue';
import edEnv from './Env.editor.vue';
import edSwitch from './Switch.editor.vue';
import upcSelect from './upcSelect.editor.vue';
import edWatch from './Watch.editor';
import edTag from './Tag.editor';
import edStatus from './Status.editor';
import iconSelect from './iconSelect.editor';

export default {
  components: {
    edArray,
    edBoolean,
    edCode,
    edObject,
    edCodeIcon,
    edString,
    edSelect,
    edTree,
    divider,
    edSlider,
    edAction,
    edAddComp,
    edNumber,
    edColor,
    edParam,
    edRule,
    edEnv,
    edSwitch,
    upcSelect,
    edWatch,
    edTag,
    edStatus,
    iconSelect
  },
  props: {
    desc: {
      type: Object,
      default: () => ({
        label: 'Error',
        type: 'Error',
        model: 'model'
      })
    },
    model: {
      type: [Object, Array],
      default: () => ({})
    }
  },
  computed: {
    value: {
      get() {
        return this.parsePath(`${this.desc.model}`)(this.model);
      },
      set(val) {
        let model = this.model;
        try {
          if (this.desc.model) {
            // 支持带横杠的show-password赋值
            const arr = this.desc.model.toString().split('.');
            const newArr = arr.map((item) => {
              let hasBar = item.indexOf('-');
              if (hasBar >= 0) {
                item = `['${item}']`;
              }
              return item;
            });
            let descModel = newArr.join('.');
            descModel.replace(/.(?=\[)/, '');
            const firstBraces = descModel.indexOf('[');
            if (firstBraces !== 0) {
              descModel = `.${descModel}`;
            }
            eval(`model${descModel}=val`);
          } else {
            model = val;
          }
        } catch (err) {
          console.error(err, 'error');
        }
        // this.$set(this.model, this.desc.model, val)
      }
    },
    labelWidth: function() {
      if (!this.desc.label) {
        return '0';
      }
    },
    isShow: function() {
      if (this.desc.visibleOn) {
        return this.evalExpression(this.desc.visibleOn, this.model);
      } else {
        return true;
      }
    }
  },
  methods: {
    evalExpression(expression, data) {
      if (!expression || typeof expression !== 'string') {
        return true;
      }
      try {
        let fn = new Function('data', `with(data) {return !!(${expression});}`);
        return fn.call(data, data);
      } catch (error) {
        return true;
      }
    },
    parsePath(path) {
      if (/[^\w.\-$]/.test(path)) {
        return function() {};
      }
      const segments = path.split('.');
      return (obj) => {
        for (let i = 0; i < segments.length; i++) {
          if (!obj) return;
          const key = segments[i];
          if (obj[key] === undefined) {
            if (key === 'disabled') {
              this.$set(obj, key, false);
            } else {
              this.$set(obj, key, '');
            }
          }
          obj = obj[key];
        }
        return obj;
      };
    }
  }
};
</script>

<style scoped>
.el-form-item {
  margin-bottom: 5px;
}
</style>
