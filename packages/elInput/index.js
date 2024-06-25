import comps from './index.vue';
import { ruleArr } from '../utils/ruleSchema';
import { deepClone } from '../utils/utils';
import {
  styleEdit,
  config,
  baseEdit,
  props,
  dataSourceEdit,
  attrEdit,
  dataSourceConfig
  // submitFieldEdit
} from '../baseConfig';

export default {
  // 组件的自定义配置
  __config__: {
    def: comps,
    label: '输入框',
    labelWidth: null,
    showLabel: true,
    changeTag: true,
    tag: 'el-input',
    tagIcon: 'edit',
    defaultValue: '',
    desc: '',
    preDesc: '',
    layout: 'colFormItem',
    span: 24,
    // 正则校验规则
    regList: [],
    ...config,
    ...dataSourceConfig,
    rules: deepClone(ruleArr),
    modelModifier: '',
    preDescStyle: {
      color: '#aaa'
    }
  },
  // 组件的插槽属性
  __slot__: {
    prepend: '',
    append: ''
  },
  // 其余的为可直接写在组件标签上的属性
  placeholder: '请输入',
  style: {
    width: '100%'
  },
  clearable: true,
  'prefix-icon': '',
  'suffix-icon': '',
  maxlength: null,
  'show-word-limit': false,
  'show-password': false,
  ...props,
  type: 'text',
  autosize: {
    minRows: 4,
    maxRows: 4
  },
  __vModel__: '',
  edit: [
    ...baseEdit,
    {
      label: 'type类型',
      type: 'edSelect',
      model: 'type',
      options: [
        {
          label: 'text',
          value: 'text'
        },
        {
          label: 'textarea',
          value: 'textarea'
        }
      ]
    },
    {
      label: '密码框',
      type: 'edBoolean',
      model: 'show-password'
    },
    {
      label: '字段名',
      type: 'edString',
      explain: '提交表单时,提交的json对象中<br/>该组件对应的字段名称',
      model: '__vModel__'
    },
    {
      label: '前置描述',
      type: 'edString',
      model: '__config__.preDesc'
    },
    {
      label: '描述',
      type: 'edString',
      model: '__config__.desc'
    },
    {
      label: '占位提示',
      type: 'edString',
      model: 'placeholder'
    },
    {
      label: '修饰符',
      type: 'edSelect',
      model: '__config__.modelModifier',
      options: [
        {
          label: '空',
          value: ''
        },
        {
          label: 'lazy',
          value: 'lazy'
        },
        {
          label: 'number',
          value: 'number'
        },
        {
          label: 'trim',
          value: 'trim'
        }
      ]
    },
    ...dataSourceEdit,
    {
      label: '默认值',
      type: 'edString',
      model: '__config__.defaultValue',
      visibleOn: 'this.__config__.dataSourceType === "static"'
    },
    {
      type: 'divider',
      name: '统计字符数'
    },
    {
      label: '显示统计',
      type: 'edBoolean',
      model: 'show-word-limit'
    },
    {
      label: '最多字符数',
      type: 'edString',
      model: 'maxlength'
    },
    {
      type: 'divider',
      name: '属性'
    },
    ...attrEdit,
    {
      type: 'divider',
      name: 'textarea属性',
      visibleOn: 'this.type === "textarea"'
    },
    {
      label: '最小行数',
      type: 'edNumber',
      model: 'autosize.minRows',
      visibleOn: 'this.type === "textarea"'
    },
    {
      label: '最大行数',
      type: 'edNumber',
      model: 'autosize.maxRows',
      visibleOn: 'this.type === "textarea"'
    },
    ...styleEdit,
    {
      label: '前置描述色',
      type: 'edString',
      model: '__config__.preDescStyle.color',
    },
    {
      label: '前图标',
      type: 'edString',
      model: 'prefix-icon'
    },
    {
      label: '后图标',
      type: 'edString',
      model: 'suffix-icon'
    },
    {
      type: 'divider',
      name: '校验'
    },
    {
      type: 'edRule',
      model: '__config__.rules'
    }
  ]
};
