import comps from './index.vue';
import { RequiredSchema } from '../utils/ruleSchema';
import { deepClone } from '../utils/utils';


import {
  styleEdit,
  config,
  dataSourceConfig,
  baseEdit,
  props,
  dataSourceEdit,
  optionsEdit,
  dynamicOptionsEdit,
  localDynamicOptionsEdit,
  dynamicOptionsConfig,
  localDynamicOptionsConfig,
  apiHighConfig,
  apiHighEdit,
  dataTypeConfig,
  attrEdit
} from '../baseConfig';

export default {
  __config__: {
    label: '选择器',
    def: comps,
    tag: 'el-select',
    tagIcon: 'down-square',
    defaultValue: '',
    separator: '',
    span: 24,
    labelWidth: null,
    placeholder: '请输入',
    selectValue: '',
    layout: 'colFormItem',
    showLabel: true,
    changeTag: true,
    type: 'Option',
    desc: '',
    grid: true, // 不需要栅格
    rules: [deepClone(RequiredSchema)],
    dynamicLabel: '',
    dynamicValue: '',
    searchTipText: '更多门店请通过关键字搜索',
    searchTip: false,
    ...config,
    ...dataSourceConfig,
    ...dataTypeConfig,
    ...dynamicOptionsConfig,
    ...localDynamicOptionsConfig,
    ...apiHighConfig
  },
  style: {
    width: '177px'
  },
  __vModel__: '',
  __vModel1__: '',
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
  filterable: false,
  remote: false,
  multiple: false,
  collapseTags: false,
  multipleLimit: 0,
  clearable: true,
  edit: [
    ...baseEdit,
    {
      label: '字段名',
      type: 'edString',
      explain: '提交表单时,提交的json对象中<br/>该组件对应的字段名称',
      model: '__vModel__'
    },
    // {
    //   label: 'label字段名',
    //   type: 'edString',
    //   explain: '提交表单时,提交的json对象中<br/>该组件对应的label字段名称，为空时不带',
    //   model: '__vModel1__'
    // },
    {
      label: '占位提示',
      type: 'edString',
      model: '__config__.placeholder'
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
      visibleOn: 'multiple===false && this.__config__.dataSourceType === "static"'
    },
    {
      label: '默认值',
      type: 'edCode',
      model: '__config__.defaultValue',
      visibleOn: 'multiple===true && this.__config__.dataSourceType === "static"'
    },
    {
      type: 'divider',
      name: 'options配置'
    },
    ...optionsEdit,
    ...dynamicOptionsEdit,
    ...localDynamicOptionsEdit,
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
      label: '选项',
      type: 'edTree',
      visibleOn: 'this.__config__.dataType === "static"',
      model: '__slot__.options'
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
    ...attrEdit,
    {
      label: '是否多选',
      type: 'edBoolean',
      model: 'multiple'
    },
    {
      label: '值分隔符',
      type: 'edString',
      model: '__config__.separator',
      visibleOn: 'multiple===true'
    },
    {
      label: '用tags展示',
      type: 'edBoolean',
      model: 'collapseTags',
      visibleOn: 'multiple===true'
    },
    {
      label: '可选项目数',
      type: 'edNumber',
      model: 'multipleLimit',
      visibleOn: 'multiple===true'
    },
    {
      label: '本地搜索',
      type: 'edBoolean',
      model: 'filterable',
      visibleOn: 'this.__config__.dataType === "static"'
    },
    {
      label: '远程搜索',
      type: 'edBoolean',
      model: 'remote',
      visibleOn: 'this.__config__.dataType === "dynamic"'
    },
    {
      label: '远程搜索key',
      type: 'edString',
      model: '__config__.selectValue',
      visibleOn: 'this.__config__.dataType === "dynamic" && this.remote === true'
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

