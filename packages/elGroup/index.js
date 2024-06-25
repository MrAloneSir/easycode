import index from './index.vue';
import { dataSourceEdit } from '../baseConfig';

export default {
  __config__: {
    def: index,
    span: 24,
    layout: 'colFormItem',
    tag: 'el-group',
    tagIcon: 'connection-box',
    defaultValue: [],
    label: '组',
    labelWidth: null,
    showLabel: true,
    draggGroup: 'elGroup',
    gutter: 15,
    needBorder: true, // 需要border
    dataSourceType: 'static',
    dataServerContent: '',
    dataServerInfo: '',
    visibleOn: '',
    tip: '',
    children: [],
    parseChildren: [],
    maxCount: 50,
    showNumber: false
  },
  type: 'default',
  justify: 'start',
  align: 'top',
  __vModel__: '',
  edit: [
    {
      type: 'divider',
      name: '基础信息'
    },
    {
      label: '标题',
      type: 'edString',
      model: '__config__.label',
      visibleOn: 'this.__config__.showLabel'
    },
    {
      label: '是否显示',
      type: 'edString',
      model: '__config__.visibleOn'
    },
    {
      label: '字段名',
      type: 'edString',
      explain: '提交表单时,提交的json对象中<br/>该组件对应的字段名称',
      model: '__vModel__'
    },
    ...dataSourceEdit,
    {
      type: 'divider',
      name: '样式信息'
    },
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
      label: '布局模式',
      type: 'edSelect',
      model: 'type',
      options: [
        {
          label: 'default',
          value: 'default'
        },
        {
          label: 'flex',
          value: 'flex'
        }
      ]
    },
    {
      label: '水平排列',
      type: 'edSelect',
      model: 'justify',
      visibleOn: 'this.type === "flex"',
      options: [
        {
          label: 'start',
          value: 'start'
        },
        {
          label: 'end',
          value: 'end'
        },
        {
          label: 'center',
          value: 'center'
        },
        {
          label: 'space-around',
          value: 'space-around'
        },
        {
          label: 'space-between',
          value: 'space-between'
        }
      ]
    },
    {
      type: 'divider',
      name: '属性'
    },
    {
      label: '显示标签',
      type: 'edBoolean',
      model: '__config__.showLabel'
    },
    {
      label: '最大数量',
      type: 'edNumber',
      model: '__config__.maxCount'
    },
    {
      label: '展示序号',
      type: 'edBoolean',
      model: '__config__.showNumber'
    }
  ]
};
