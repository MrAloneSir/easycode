import comps from './Index.vue';
import { RequiredSchema } from '../utils/ruleSchema';
import { deepClone } from '../utils/utils';
import { styleEdit, attrEdit, config, baseEdit, props, dataSourceEdit, dataSourceConfig } from '../baseConfig';

const ruleArr = [];
ruleArr.push(RequiredSchema);

export default {
  __isVue3: true,
  __config__: {
    def: comps,
    tag: 'el-timerange-picker',
    tagIcon: 'list-numbers',
    label: '时间范围',
    desc: '',
    // needBorder: true,
    grid: true,
    span: 24,
    children: [],
    header: [],
    layout: 'colFormItem', //表单组件
    showLabel: true,
    labelWidth: null,
    defaultValue: null,
    ...config,
    ...dataSourceConfig,
    selectableRange: '00:00:00 - 23:59:59',
    rules: deepClone(ruleArr),
    optionSlotCode: {
      htmlCode: '',
      cssCode: '',
      jsCode:
        "//自定义默认时间,函数需返回数组格式,例如:['11:08:00','13:08:06']\nfunction dataPipe() {\n\treturn ['11:08:00','13:08:06'];\n}\n"
    },
    useCodeFilter: false
  },
  ...props,
  clearable: true,
  'start-placeholder': '选择开始时间',
  'end-placeholder': '选择结束时间',
  __vModel__: 'selectedTimeRange',
  style: { width: '100%' },
  'value-format': 'HH:mm:ss',
  format: 'HH:mm:ss',
  edit: [
    ...baseEdit,
    {
      label: '字段名',
      type: 'edString',
      explain: '提交表单时,提交的json对象中<br/>该组件对应的字段名称',
      model: '__vModel__'
    },
    {
      label: '开始占位',
      type: 'edString',
      model: 'start-placeholder'
    },
    {
      label: '结束占位',
      type: 'edString',
      model: 'end-placeholder'
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
      explain: '填写默认值格式如: 12:09:08,13:08:06',
      model: '__config__.defaultValue',
      visibleOn: 'this.__config__.dataSourceType === "static"'
    },
    {
      type: 'edBoolean',
      label: '值代码编辑',
      model: '__config__.useCodeFilter',
      visibleOn: 'this.__config__.dataSourceType === "static"'
    },
    {
      type: 'edCodeIcon',
      label: '代码编辑',
      model: '__config__.optionSlotCode',
      defaultName: 'javascript',
      visibleOn: 'this.__config__.useCodeFilter && this.__config__.dataSourceType === "static"',
    },
    {
      label: '时间范围',
      type: 'edString',
      model: '__config__.selectableRange'
    },
    {
      label: '显示格式',
      type: 'edString',
      model: 'format'
    },
    {
      label: '值格式',
      type: 'edString',
      model: 'value-format'
    },
    {
      type: 'divider',
      name: '属性'
    },
    ...attrEdit,
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
