import comps from './index.vue';
import { RequiredSchema, TypeSchema, validatorSchema } from '../utils/ruleSchema';
import { deepClone } from '../utils/utils';
import {
  styleEdit,
  attrEdit,
  config,
  baseEdit,
  props,
  dataSourceEdit,
  dataSourceConfig
} from '../baseConfig';
const ruleArr = [];
ruleArr.push(deepClone(RequiredSchema), deepClone(validatorSchema));

export default {
  // 组件的自定义配置
  __config__: {
    def: comps,
    label: '计数器',
    labelWidth: null,
    showLabel: true,
    changeTag: true,
    tag: 'el-input-number',
    tagIcon: 'add-subtract',
    defaultValue: 1,
    desc: '',
    layout: 'colFormItem',
    span: 24,
    ...config,
    ...dataSourceConfig,
    rules: ruleArr
  },
  // 其余的为可直接写在组件标签上的属性
  placeholder: '',
  style: { width: '150px' },
  clearable: true,
  ...props,
  controls: true,
  'controls-position': '',
  step: 1,
  max: Infinity,
  min: -Infinity,
  'step-strictly': false,
  precision: null,
  __vModel__: '',
  edit: [
    ...baseEdit,
    {
      label: '字段名',
      type: 'edString',
      explain: '提交表单时,提交的json对象中<br/>该组件对应的字段名称',
      model: '__vModel__'
    },
    {
      label: '占位提示',
      type: 'edString',
      model: 'placeholder'
    },
    {
      label: '描述',
      type: 'edString',
      model: '__config__.desc'
    },
    ...dataSourceEdit,
    {
      label: '默认值',
      type: 'edString',
      model: '__config__.defaultValue',
      visibleOn: 'this.__config__.dataSourceType === "static"'
    },
    {
      label: '最大值',
      type: 'edNumber',
      model: 'max'
    },
    {
      label: '最小值',
      type: 'edNumber',
      model: 'min'
    },
    {
      label: '步数',
      type: 'edNumber',
      explain: 'step属性',
      model: 'step'
    },
    {
      label: '精度',
      type: 'edNumber',
      explain: 'precision属性',
      model: 'precision'
    },
    {
      label: '按钮位置',
      type: 'edSelect',
      model: 'controls-position',
      options: [
        {
          label: '两端',
          value: ''
        },
        {
          label: '右',
          value: 'right'
        }
      ]
    },
    {
      type: 'divider',
      name: '属性'
    },
    {
      label: '显示标签',
      type: 'edBoolean',
      model: '__config__.showLabel'
    },
    {
      label: '是否禁用',
      type: 'edBoolean',
      model: 'disabled'
    },
    {
      label: '控制按钮',
      type: 'edBoolean',
      model: 'controls'
    },
    {
      label: '严格步数',
      type: 'edBoolean',
      explain: 'step-strictly属性',
      model: 'step-strictly'
    },
    ...styleEdit,
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

