import comps from './index.vue';
import { RequiredSchema } from '../utils/ruleSchema';
import { deepClone } from '../utils/utils';
import {
  styleEdit,
  config,
  baseEdit,
  props,
  dataSourceEdit,
  dataSourceConfig,
  optionsEdit,
  dynamicOptionsEdit,
  dataTypeConfig,
  localDynamicOptionsEdit,
  localDynamicOptionsConfig,
  dynamicOptionsConfig,
  apiHighConfig,
  apiHighEdit,
  attrEdit
} from '../baseConfig';
export default {
  __config__: {
    label: '多选框',
    def: comps,
    tag: 'el-checkbox',
    tagIcon: 'full-selection',
    dataType: 'static',
    defaultValue: [],
    separator: '',
    span: 24,
    labelWidth: 100,
    layout: 'colFormItem',
    showLabel: true,
    changeTag: true,
    desc: '',
    type: 'Checkbox',
    indeterminate: false, //only Checkbox
    checkAll: false, //是否全选
    checkAllShow: false,
    grid: true, // 不需要栅格

    ...config,
    ...dataSourceConfig,
    ...dataTypeConfig,
    ...dynamicOptionsConfig,
    ...localDynamicOptionsConfig,
    ...apiHighConfig,
    rules: deepClone([RequiredSchema]),
    dynamicLabel: '',
    dynamicValue: ''
  },
  style: { width: '100%' },
  __vModel__: '',
  __slot__: {
    options: [
      {
        label: '选项一',
        value: 1
      },
      {
        label: '选项二',
        value: 2
      }
    ]
  },
  ...props,
  edit: [
    ...baseEdit,
    {
      label: '描述',
      type: 'edString',
      model: '__config__.desc'
    },
    {
      label: '字段名',
      type: 'edString',
      explain: '提交表单时,提交的json对象中<br/>该组件对应的字段名称',
      model: '__vModel__'
    },
    {
      label: '值分隔符',
      type: 'edCode',
      model: '__config__.separator'
    },
    ...dataSourceEdit,
    {
      label: '默认值',
      type: 'edCode',
      model: '__config__.defaultValue',
      visibleOn: 'this.__config__.dataSourceType === "static"'
    },
    {
      type: 'divider',
      name: '选项配置'
    },
    ...optionsEdit,
    ...dynamicOptionsEdit,
    ...localDynamicOptionsEdit,
    {
      label: '选项',
      type: 'edTree',
      visibleOn: 'this.__config__.dataType === "static"',
      model: '__slot__.options'
    },
    {
      type: 'edString',
      model: '__config__.dynamicLabel',
      visibleOn: 'this.__config__.dataType !== "static"',
      explain: '返回数据结构中，显示对应的字段名',
      label: 'label绑定'
    },
    {
      type: 'edString',
      model: '__config__.dynamicValue',
      visibleOn: 'this.__config__.dataType !== "static"',
      explain: '返回数据结构中，取值对应的字段名',
      label: 'value绑定'
    },

    {
      type: 'divider',
      name: '高级配置'
    },
    ...apiHighEdit,

    {
      type: 'divider',
      name: '属性配置'
    },
    {
      label: '是否禁用',
      type: 'edBoolean',
      model: 'disabled'
    },
    {
      label: '是否只读',
      type: 'edBoolean',
      model: 'readonly'
    },
    {
      label: '全选按钮',
      type: 'edBoolean',
      model: '__config__.checkAllShow'
    },
    // {
    //   label: '是否显示边框',
    //   type: 'edBoolean',
    //   model: 'border',
    //   visibleOn: '__config__.indeterminate===false'
    // },
    {
      label: '显示标签',
      type: 'edBoolean',
      model: '__config__.showLabel'
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

