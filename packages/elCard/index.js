import comps from './index.vue';
import button from '../elButton';

export default {
  __config__: {
    def: comps,
    tag: 'el-card',
    tagIcon: 'bank-card-two',
    label: '卡片',
    needBorder: true, // 需要border
    children: [],
    draggGroup: 'blockGroup',
    header: [],
    showTitle: true,
    title: '卡片名称',
    showOptButton: true,
    optButtonName: '操作按钮',
    visibleOn: '',
    tip: ''
  },
  shadow: 'always',
  edit: [
    // 编辑项
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
      label: '显示标题',
      type: 'edBoolean',
      model: '__config__.showTitle'
    },
    {
      label: '标题',
      type: 'edString',
      model: '__config__.title'
    },
    {
      label: '操作按钮',
      type: 'edBoolean',
      model: '__config__.showOptButton',
    },
    {
      label: '按钮名称',
      type: 'edString',
      model: '__config__.optButtonName'
    },
    {
      type: 'divider',
      name: '样式信息'
    },
    {
      label: '阴影效果',
      type: 'edSelect',
      model: 'shadow',
      options: [
        {
          label: 'always',
          value: 'always'
        },
        {
          label: 'hover',
          value: 'hover'
        },
        {
          label: 'never',
          value: 'never'
        }
      ]
    }
  ]
};

