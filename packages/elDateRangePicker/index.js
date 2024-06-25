import comps from './Index.vue';
import { formatDate } from '../utils/utils';
import { RequiredSchema } from '../utils/ruleSchema';
import { deepClone } from '../utils/utils';
import { styleEdit, attrEdit, config, baseEdit, props, dataSourceEdit, dataSourceConfig } from '../baseConfig';

const ruleArr = [];
ruleArr.push(RequiredSchema);

export default {
  __config__: {
    def: comps,
    label: '日期范围',
    desc: '',
    tag: 'el-daterange-picker',
    tagIcon: 'calendar-dot',
    defaultValue: null,
    grid: true,
    span: 24,
    children: [],
    header: [],
    showLabel: true,
    labelWidth: null,
    layout: 'colFormItem',
    regList: [],
    changeTag: true,
    ...config,
    ...dataSourceConfig,
    rules: deepClone(ruleArr),
    optionSlotCode: {
      htmlCode: '',
      cssCode: '',
      jsCode:
        "// 自定义默认时间,函数需返回数组格式,例如:['2022-03-09','2022-04-09']\nfunction dataPipe() {\n\treturn ['2022-03-09','2022-04-09'];\n}\n"
    },
    useCodeFilter: false
  },
  style: { width: '100%' },
  type: 'daterange',
  'range-separator': '至',
  'start-placeholder': '开始日期',
  'end-placeholder': '结束日期',
  clearable: true,
  format: 'yyyy-MM-dd',
  'value-format': 'yyyy-MM-dd',
  ...props,
  'picker-options': {
    disabledDate: {
      htmlCode: '',
      cssCode: '',
      jsCode: 'function disabledDate(time) {}'
    }

  },
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
      explain: '填写默认值格式如: 2022-07-06,2022-08-06',
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
      label: '显示类型',
      type: 'edSelect',
      model: 'type',
      options: [
        {
          label: '日期范围(daterange)',
          value: 'daterange'
        },
        {
          label: '月范围(monthrange)',
          value: 'monthrange'
        },
        {
          label: '日期时间范围(datetimerange)',
          value: 'datetimerange'
        }
      ]
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
      name: '日期弹框配置'
    },
    {
      type: 'edCodeIcon',
      label: '禁止选择',
      explain: '弹框中的每一个日期都会回调此自定义函数, 返回结果为true,则禁止该日期被选择',
      model: 'picker-options.disabledDate',
      defaultName: 'javascript',
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
