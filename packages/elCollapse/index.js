import comps from './Index.vue'

const collapseChild = [
  {
    __config__: {
      tag: 'el-collapse-item',
      type: 'content',
    },
    label: '待审核',
    name: '1',
    disabled: false,
    text: '具体内容具体内容具体内容具体内容',
  },
  {
    __config__: {
      tag: 'el-collapse-item',
      type: 'content',
    },
    label: '已审核',
    name: '2',
    disabled: false,
    text: '具体内容具体内容具体内容具体内容具体内容'
  },
  {
    __config__: {
      tag: 'el-collapse-item',
      type: 'content',
    },
    label: '已完成',
    name: '3',
    disabled: false,
    text: '具体内容具体内容具体内容具体内容具体内容'
  }
]

export default {
  __config__: {
    def: comps,
    label: '折叠面板',
    tag: 'el-collapse',
    tagIcon: 'expand-left',
    action: [],
    children: collapseChild,
    span: 24,
    visibleOn: '',
    tip: ''
  },
  accordion: false,
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
      type: 'divider',
      name: '属性'
    },
    {
      label: '手风琴效果',
      type: 'edBoolean',
      model: 'accordion'
    },
    {
      label: '信息编辑',
      type: 'edArray',
      model: '__config__.children',
      showLabel: 'label',
      valueType: {
        label: '类型',
        options: [
          {
            label: 'content',
            value: '0',
            default: {
              __config__: {
                tag: 'el-collapse-item'
              },
              label: '标题',
              name: '唯一标志符',
              disabled: false,
              text: '具体内容'
            }
          }
        ]
      },
      item: {
        type: 'edObject',
        props: {
          label: {
            type: 'edString',
            label: '标题'
          },
          name: {
            type: 'edString',
            label: '唯一标志符'
          },
          disabled: {
            label: '是否禁用',
            type: 'edBoolean',
          },
          text: {
            label: '具体内容',
            type: 'edString',
          }
        }
      }
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
    }
  ]
}
