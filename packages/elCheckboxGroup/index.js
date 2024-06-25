import comps from './index.vue';
// import { layouts } from '../utils/layout';
import { formItemWrapper } from '../utils/html';
import { attrBuilder, colWrapper } from '../utils/html';
import { RequiredSchema } from '../utils/ruleSchema';
import { deepClone } from '../utils/utils';
// import { config } from 'vuedraggable';
import { styleEdit, actionEdit, config, baseEdit, props } from '../baseConfig';

const ruleArr = [];
ruleArr.push(RequiredSchema);
export default {
  __config__: {
    label: '多选框--废弃',
    def: comps,
    tag: 'el-checkbox-group',
    tagIcon: 'checkbox',
    defaultValue: [1],
    span: 24,
    // needBorder: true,
    labelWidth: 100,
    layout: 'colFormItem',
    showLabel: true,
    changeTag: true,
    type: 'Checkbox',
    desc: '',
    grid: true, // 不需要栅格
    // visibleOn: '',
    // tip: '',
    ...config,
    rules: deepClone(ruleArr)
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
  // disabled: false,
  ...props,
  min: 0,
  max: 0,
  edit: [
    ...baseEdit,

    {
      label: '标签名称',
      type: 'edString',
      model: '__config__.label'
    },
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
      label: '默认值',
      type: 'edCode',
      model: '__config__.defaultValue'
    },
    {
      type: 'divider',
      name: '属性'
    },
    {
      label: '选项',
      type: 'edTree',
      model: '__slot__.options'
    },
    {
      label: '选择样式',
      type: 'edSelect',
      options: [
        {
          label: '默认',
          value: 'Checkbox'
        },
        {
          label: '按钮',
          value: 'Checkbox-Button'
        }
      ],
      model: '__config__.type'
    },
    {
      label: '显示标签',
      type: 'edBoolean',
      model: '__config__.showLabel'
    },

    {
      label: 'min',
      type: 'edNumber',
      model: 'min'
    },
    {
      label: 'max',
      type: 'edNumber',
      model: 'max'
    },
    ...styleEdit,
    {
      label: '表格栅格',
      type: 'edSlider',
      model: '__config__.span',
      options: {
        max: 24,
        min: 1,
        marks: { 12: '' }
      }
    },
    {
      label: '组件宽度',
      type: 'edString',
      model: 'style.width'
    },
    {
      label: '标签宽度',
      type: 'edString',
      model: '__config__.labelWidth'
    },
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

