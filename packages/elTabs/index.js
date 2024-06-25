import comps from './Index.vue';
const tabChild = [
  {
    __config__: {
      tag: 'el-tab-pane',
      children: []
    },
    name: 'first',
    label: '用户管理'
  },
  {
    __config__: {
      tag: 'el-tab-pane',
      children: []
    },
    name: 'second',
    label: '配置管理'
  },
  {
    __config__: {
      tag: 'el-tab-pane',
      children: []
    },
    name: 'third',
    label: '角色管理'
  },
  {
    __config__: {
      tag: 'el-tab-pane',
      children: []
    },
    name: 'fourth',
    label: '定时任务补偿'
  }
];

export default {
  __isVue3: true,
  __config__: {
    def: comps,
    rootData: true,
    tag: 'el-tabs',
    tagIcon: 'app-switch',
    label: '标签页',
    needBorder: true,
    grid: true, // 不需要栅格
    span: 24,
    children: tabChild,
    defaultValue: 'first',
    layout: 'colHtmlItem',
    draggGroup: 'blockGroup',
    visibleOn: '',
    tip: ''
  },
  __vModel__: 'activeName',
  'node-key': 'id',
  accordion: false,
  draggable: false,
  type: '',
  style: { width: '100%' },
  edit: [
    {
      type: 'divider',
      name: '基础信息'
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
    {
      label: '标签页信息',
      type: 'edArray',
      showLabel: 'label',
      model: '__config__.children',
      item: {
        type: 'edObject',
        props: {
          label: {
            type: 'edString',
            label: '标签名信息'
          },
          name: {
            type: 'edString',
            label: 'name信息'
          }
        }
      }
    },
    {
      type: 'divider',
      name: '样式信息'
    },
    {
      label: '样式类型',
      type: 'edSelect',
      model: 'type',
      options: [
        {
          label: '默认样式',
          value: ''
        },
        {
          label: '选项卡样式',
          value: 'card'
        },
        {
          label: '卡片化样式',
          value: 'border-card'
        }
      ]
    }
  ]
};
