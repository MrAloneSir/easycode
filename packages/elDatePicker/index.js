import comps from './Index.vue';
import ruleTrigger from '../utils/ruleTrigger';
import { formatDate } from '../utils/utils';
import { RequiredSchema } from '../utils/ruleSchema';
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
ruleArr.push(RequiredSchema);

export default {
  __config__: {
    def: comps,
    label: '日期选择',
    desc: '',
    tag: 'el-date-picker',
    tagIcon: 'calendar',
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
        "//自定义默认时间,return值需为字符串形式,例如: '2022-08-06'\nfunction dataPipe() {\n\treturn '2022-03-09';\n}\n"
    },
    useCodeFilter: false
  },
  placeholder: '请选择',
  type: 'date',
  style: {
    width: '100%'
  },
  ...props,
  clearable: true,
  format: 'yyyy-MM-dd',
  'value-format': 'yyyy-MM-dd',
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
      explain: '填写默认值格式如: 2023-08-06',
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
      visibleOn: 'this.__config__.useCodeFilter && this.__config__.dataSourceType === "static"'
    },
    {
      label: '显示类型',
      type: 'edSelect',
      model: 'type',
      options: [
        {
          label: '日(date)',
          value: 'date'
        },
        {
          label: '周(week)',
          value: 'week'
        },
        {
          label: '月(month)',
          value: 'month'
        },
        {
          label: '年(year)',
          value: 'year'
        },
        {
          label: '日期时间(datetime)',
          value: 'datetime'
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
