import comps from './Index.vue';

export default {
  __isVue3: true,
  __config__: {
    def: comps,
    tag: 'el-title',
    tagIcon: 'h',
    label: '标题',
    // needBorder: true,
    grid: true,
    span: 24,
    children: [],
    header: [],
    visibleOn: '',
    tip: ''
  },
  title: '我是标题',
  tip: '描述文字',
  style: { width: '100%' },
  edit: [
    {
      type: 'divider',
      name: '基础信息'
    },
    {
      label: '是否显示',
      type: 'edString',
      model: '__config__.visibleOn',
    },
    {
      label: '标题',
      type: 'edString',
      model: 'title'
    },
    {
      label: '补充文字',
      type: 'edString',
      model: 'tip'
    },
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
      label: '组件宽度',
      type: 'edString',
      model: 'style.width'
    }
  ]
};
