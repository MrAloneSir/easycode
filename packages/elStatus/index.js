import comps from './index.vue'

export default {
  __config__: {
    def: comps,
    label: '状态标识',
    tag: 'el-status',
    tagIcon: 'dot',
    grid: false, // 不需要栅格
    action: [],
    options: [
      {
        label: 'primary',
        value: 'primary'
      },
      {
        label: 'info',
        value: 'info'
      },
      {
        label: 'success',
        value: 'success'
      },
      {
        label: 'warning',
        value: 'warning'
      }
    ],
    visibleOn: '',
    tip: ''
  },
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
      label: '选项值参考',
      type: 'edSelect',
      options: [
        {
          label: 'primary',
          value: 'primary'
        },
        {
          label: 'info',
          value: 'info'
        },
        {
          label: 'success',
          value: 'success'
        },
        {
          label: 'warning',
          value: 'warning'
        }
      ]
    },
    {
      label: '选项配置',
      type: 'edTree',
      model: '__config__.options'
    },
  ]
}
