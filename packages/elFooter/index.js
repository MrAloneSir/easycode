import index from './index.vue';

export default {
  __config__: {
    def: index,
    tag: 'to-bottom',
    tagIcon: 'bottom-bar',
    label: '底部容器',
    draggGroup: 'footerGroup',
    needBorder: true, // 需要border
    visibleOn: '',
    footer: true,
    tip: '',
    children: []
  },
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
      label: '拖拽范围',
      type: 'edString',
      model: '__config__.draggGroup'
    }
  ]
};
