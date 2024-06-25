import comps from './index.vue';
import ruleTrigger from '../utils/ruleTrigger';
import { RequiredSchema } from '../utils/ruleSchema';
import { deepClone } from '../utils/utils';
import {
  styleEdit,
  config,
  baseEdit,
  props,
  dataSourceEdit,
  dataSourceConfig
} from '../baseConfig';

const ruleArr = [];
ruleArr.push(RequiredSchema);

export default {
  __config__: {
    def: comps,
    label: '开关',
    labelWidth: null,
    showLabel: true,
    defaultValue: true,
    tag: 'el-switch',
    tagIcon: 'switch-button',
    layout: 'colFormItem', //表单组件
    action: [],
    span: 24,
    desc: '',
    ...config,
    ...dataSourceConfig,
    rules: deepClone(ruleArr)
  },
  style: { width: '100%' },
  domProps: {},
  __vModel__: '',
  ...props,
  activeText: '',
  inactiveText: '',
  'active-value': true,
  'inactive-value': false,
  edit: [
    ...baseEdit,
    {
      label: '字段名',
      type: 'edString',
      explain: '提交表单时,提交的json对象中<br/>该组件对应的字段名称',
      model: '__vModel__'
    },
    {
      label: '描述',
      type: 'edString',
      model: '__config__.desc'
    },
    // {
    //   label: '打开时描述',
    //   type: 'edString',
    //   model: 'activeText'
    // },
    // {
    //   label: '关闭时描述',
    //   type: 'edString',
    //   model: 'inactiveText'
    // },
    ...dataSourceEdit,
    {
      label: '默认值',
      type: 'edString',
      model: '__config__.defaultValue',
      visibleOn: 'this.__config__.dataSourceType === "static"'
    },
    // {
    //   label: '开启值设置',
    //   type: 'edString',
    //   model: 'active-value'
    // },
    // {
    //   label: '关闭值设置',
    //   type: 'edString',
    //   model: 'inactive-value'
    // },
    {
      type: 'divider',
      name: '属性配置'
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
