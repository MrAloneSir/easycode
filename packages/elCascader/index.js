import index from './index.vue';
import { RequiredSchema, TypeSchema } from '../utils/ruleSchema';
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
    def: index,
    label: '级联选择',
    desc: '',
    showLabel: true,
    labelWidth: null,
    tag: 'el-cascader',
    tagIcon: 'nested-arrows',
    layout: 'colFormItem',
    defaultValue: [],
    separator: '',
    span: 24,
    regList: [],
    changeTag: true,
    rules: [deepClone(RequiredSchema)],
    ...config,
    ...dataSourceConfig,
    ...dataTypeConfig,
    ...dynamicOptionsConfig,
    ...localDynamicOptionsConfig,
    ...apiHighConfig,
    url: '/v1/cascaderList'
  },
  options: [
    {
      id: 1,
      value: 1,
      label: '静态选项1',
      children: [
        {
          id: 2,
          value: 2,
          label: '静态选项1-1'
        }
      ]
    }
  ],
  placeholder: '请选择',
  style: { width: '100%' },
  props: {
    props: {
      multiple: false,
      label: 'label',
      value: 'value',
      children: 'children',
      checkStrictly: false
    }
  },
  'show-all-levels': true,
  ...props,
  clearable: true,
  filterable: false,
  separator: '/',
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
    {
      label: '选项分隔符',
      type: 'edString',
      model: 'separator'
    },
    ...dataSourceEdit,
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
      model: 'options',
      hasChildren: true,
      visibleOn: 'this.__config__.dataType === "static"'
    },
    {
      type: 'edString',
      model: 'props.props.label',
      label: 'label绑定'
    },
    {
      type: 'edString',
      model: 'props.props.value',
      label: 'value绑定'
    },
    {
      type: 'edString',
      model: 'props.props.children',
      label: '子级键名'
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
      type: 'edBoolean',
      model: 'props.props.checkStrictly',
      label: '任选层级'
    },
    {
      type: 'edBoolean',
      model: 'props.props.multiple',
      label: '是否多选'
    },
    {
      label: '值分隔符',
      type: 'edString',
      model: '__config__.separator',
      visibleOn: 'props.props.multiple===true'
    },
    {
      type: 'edBoolean',
      model: 'show-all-levels',
      label: '展示全路径'
    },
    {
      type: 'edBoolean',
      model: 'filterable',
      label: '可否筛选'
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
