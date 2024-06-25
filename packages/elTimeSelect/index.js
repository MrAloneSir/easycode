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
    tag: 'el-time-select',
    tagIcon: 'time',
    label: '时间选择',
    desc: '',
    // needBorder: true,
    grid: true,
    span: 24,
    layout: 'colFormItem', //表单组件
    children: [],
    header: [],
    showLabel: true,
    labelWidth: null,
    defaultValue: null,
    ...config,
    ...dataSourceConfig,
    rules: deepClone(ruleArr),
    optionSlotCode: {
      htmlCode: '',
      cssCode: '',
      jsCode:
        "// 自定义默认值,返回值为一个字符串,例如:'11:08'\nfunction dataPipe() {\n\treturn '11:08';\n}\n"
    },
    useCodeFilter: false
  },
  ...props,
  clearable: false,
  step: '00:30',
  min: '00:00',
  max: '24:00',
  placeholder: '选择时间',
  __vModel__: 'selectedTime',
  style: { width: '100%' },
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
      explain: '填写默认值格式如: 11:08',
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
      label: '时间间隔',
      type: 'edString',
      model: 'step'
    },
    {
      label: '最小时间',
      type: 'edString',
      model: 'min'
    },
    {
      label: '最大',
      type: 'edString',
      model: 'max'
    },
    {
      type: 'divider',
      name: '属性配置'
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
