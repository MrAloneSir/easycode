import comps from './index.vue';

export default {
  __config__: {
    def: comps,
    label: '超链接',
    tag: 'el-link',
    tagIcon: 'link',
    grid: false, // 不需要栅格
    action: [],
    visibleOn: '',
    tip: ''
  },
  domProps: {
    innerHTML: '超链接'
  },
  type: 'primary',
  disabled: false,
  underline: true,
  style: { marginLeft: '10px', marginTop: '0px', marginBottom: '10px' },
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
      label: '文字',
      type: 'edString',
      model: 'domProps.innerHTML'
    },
    {
      label: '是否禁用',
      type: 'edBoolean',
      model: 'disabled'
    },
    {
      type: 'divider',
      name: '样式信息'
    },
    {
      label: 'type',
      type: 'edSelect',
      model: 'type',
      options: [
        {
          label: 'success',
          value: 'success'
        },
        {
          label: 'primary',
          value: 'primary'
        },
        {
          label: 'warning',
          value: 'warning'
        },
        {
          label: 'danger',
          value: 'danger'
        },
        {
          label: 'info',
          value: 'info'
        }
      ]
    },
    {
      label: '下划线',
      type: 'edSelect',
      model: 'underline',
      options: [
        {
          label: '是',
          value: true
        },
        {
          label: '否',
          value: false
        },
      ]
    },
    {
      label: '左边距',
      type: 'edString',
      model: 'style.marginLeft'
    },
    {
      label: '上边距',
      type: 'edString',
      model: 'style.marginTop'
    },
    {
      type: 'divider',
      name: '动作设置'
    },
    {
      type: 'edAction',
      model: '__config__.action'
    }
  ]
};

