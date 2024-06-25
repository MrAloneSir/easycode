import comps from './Index.vue';
export const menuChild = [
  {
    __config__: {
      disabled: false,
      divided: false,
      icon: ''
    },
    command: 'approve',
    label: '审核'
  },
  {
    __config__: {
      disabled: false,
      divided: false,
      icon: ''
    },
    command: 'reject',
    label: '驳回'
  },
  {
    __config__: {
      disabled: false,
      divided: false,
      icon: ''
    },
    command: 'detail',
    label: '查看'
  },
  {
    __config__: {
      disabled: false,
      divided: false,
      icon: ''
    },
    command: 'edit',
    label: '编辑'
  }
]
export default {
  __isVue3: true,
  __config__: {
    def: comps,
    rootData: true,
    tag: 'el-dropdown',
    tagIcon: 'drop-down-list',
    label: '下拉菜单',
    grid: false, // 不需要栅格
    children: menuChild,
    layout: 'colHtmlItem',
    draggGroup: 'blockGroup',
    visibleOn: '',
    tip: ''
  },
  domProps: {
    innerHTML: '更多'
  },
  trigger: '',
  style: { padding: '10px' },
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
      label: '名称',
      type: 'edString',
      model: 'domProps.innerHTML'
    },
    {
      label: '触发方式',
      type: 'edSelect',
      model: 'trigger',
      options: [
        {
          label: 'hover',
          value: ''
        },
        {
          label: 'click',
          value: 'click'
        }
      ]
    },
    {
      label: '菜单信息',
      type: 'edArray',
      model: '__config__.children',
      showLabel: 'label',
      item: {
        type: 'edObject',
        props: {
          label: {
            type: 'edString',
            label: '菜单名称'
          },
          command: {
            type: 'edString',
            label: '绑定指令'
          },
          '__config__.disabled': {
            type: 'edBoolean',
            label: '禁用'
          },
          '__config__.divided': {
            type: 'edBoolean',
            label: '显示分割线'
          },
          '__config__.icon': {
            type: 'edString',
            label: '图标类名'
          }
        }
      }
    }
  ]
};
