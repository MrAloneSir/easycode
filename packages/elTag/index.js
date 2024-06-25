import comps from './Index.vue';

export default {
  __config__: {
    def: comps,
    tag: 'el-tag',
    tagIcon: 'tag-one',
    label: '标签',
    // needBorder: true,
    grid: false, // 不需要栅格
    children: [],
    header: [],
    visibleOn: '',
    tip: ''
  },
  tagText: 'elTag',
  type: '', // 'add'
  disabled: false,
  checked: false,
  closable: false,
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
      label: '文字',
      type: 'edString',
      model: 'tagText'
    },
    {
      type: 'divider',
      name: '属性'
    },
    {
      label: 'Tag类型',
      type: 'edSelect',
      model: 'type',
      options: [
        {
          label: '普通',
          value: ''
        },

        {
          label: '可选中',
          value: 'checkable'
        },
        {
          label: '添加',
          value: 'add'
        }
      ]
    },
    {
      label: '是否禁用',
      type: 'edBoolean',
      model: 'disabled'
    },
    {
      label: '是否选中',
      type: 'edBoolean',
      model: 'checked',
      visibleOn: 'this.type==="checkable"'
    },
    {
      label: '是否可删除',
      type: 'edBoolean',
      model: 'closable',
      visibleOn: 'this.type===""'
    }
  ]
};
