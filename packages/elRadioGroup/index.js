import comps from './index.vue';
import { RequiredSchema, TypeSchema } from '../utils/ruleSchema';
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
    label: '单选框',
    def: comps,
    tag: 'el-radio-group',
    tagIcon: 'radio-two',
    defaultValue: '',
    span: 24,
    labelWidth: null,
    layout: 'colFormItem',
    showLabel: true,
    changeTag: true,
    type: 'Radio',
    desc: '',
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
  style: {
    width: '100%'
  },
  __vModel__: 'radioGroup',
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
  border: false,
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
    ...dataSourceEdit,
    {
      label: '默认值',
      type: 'edCode',
      model: '__config__.defaultValue',
      visibleOn: 'this.__config__.dataSourceType === "static"'
    },
    {
      type: 'divider',
      name: 'options配置'
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
      label: '显示标签',
      type: 'edBoolean',
      model: '__config__.showLabel'
    },
    // {
    //   label: '是否显示边框',
    //   type: 'edBoolean',
    //   model: 'border',
    //   visibleOn: '__config__.type==="Radio"'
    // },
    {
      label: '选择样式',
      type: 'edSelect',
      options: [
        {
          label: '默认',
          value: 'Radio'
        },
        {
          label: '按钮',
          value: 'Radio-Button'
        }
      ],
      model: '__config__.type'
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
