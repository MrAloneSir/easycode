import comps from './Index.vue'

const stepsChild = [
  {
    __config__: {
      tag: 'el-step',
      type: 'content'
    },
    label: '待审核',
    desc: '这里是描述文案这里是描述文案',
    icon: 'el-icon-edit',
    status: ''
  },
  {
    __config__: {
      tag: 'el-step',
      type: 'content'
    },
    label: '已审核',
    desc: '这里是描述文案这里是描述文案',
    icon: '',
    status: ''
  },
  {
    __config__: {
      tag: 'el-step',
      type: 'content'
    },
    label: '已完成',
    desc: '这里是描述文案这里是描述文案',
    icon: '',
    status: ''
  }
]


export default {
  __config__: {
    def: comps,
    label: '步骤条',
    tag: 'el-steps',
    tagIcon: 'pie',
    grid: false, // 不需要栅格
    action: [],
    children: stepsChild,
    visibleOn: '',
    tip: ''
  },
  active: '0',
  type: 'normal',
  direction: 'horizontal',
  processStatus: 'process',
  finishStatus: 'finish',
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
      label: '类型',
      type: 'edSelect',
      model: 'type',
      options: [
        {
          label: '不带描述类型',
          value: 'simple'
        },
        {
          label: '带描述类型', // 带描述
          value: 'normal'
        }
      ]
    },
    {
      label: '显示方向',
      type: 'edSelect',
      model: 'direction',
      options: [
        {
          label: '水平',
          value: 'horizontal'
        },
        {
          label: '垂直', // 带描述
          value: 'vertical'
        }
      ]
    },
    {
      type: 'edString',
      model: 'active',
      label: '当前激活步骤'
    },
    {
      label: '当前步骤的状态',
      type: 'edSelect',
      model: 'processStatus',
      options: [
        {
          label: 'wait',
          value: 'wait'
        },
        {
          label: 'process',
          value: 'process'
        },
        {
          label: 'finish',
          value: 'finish'
        },
        {
          label: 'error',
          value: 'error'
        },
        {
          label: 'success',
          value: 'success'
        }
      ]
    },
    {
      label: '结束步骤的状态',
      type: 'edSelect',
      model: 'finishStatus',
      options: [
        {
          label: 'wait',
          value: 'wait'
        },
        {
          label: 'process',
          value: 'process'
        },
        {
          label: 'finish',
          value: 'finish'
        },
        {
          label: 'error',
          value: 'error'
        },
        {
          label: 'success',
          value: 'success'
        }
      ]
    },
    {
      label: '步骤信息编辑',
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
                tag: 'el-step'
              },
              label: '步骤标题',
              desc: '具体描述···',
              icon: '',
              status: ''
            }
          }
        ]
      },
      item: {
        type: 'edObject',
        props: {
          label: {
            type: 'edString',
            label: '步骤标题'
          },
          desc: {
            type: 'edString',
            label: '步骤描述'
          },
          icon: {
            type: 'edString',
            label: '饿了么icon'
          },
          status: {
            label: '当前步骤的状态',
            type: 'edSelect',
            options: [
              {
                label: 'wait',
                value: 'wait'
              },
              {
                label: 'process',
                value: 'process'
              },
              {
                label: 'finish',
                value: 'finish'
              },
              {
                label: 'error',
                value: 'error'
              },
              {
                label: 'success',
                value: 'success'
              }
            ]
          }
        }
      }
    }
  ]
}
