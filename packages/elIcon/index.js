import comps from './index.vue';
import { actionEdit } from '../baseConfig';
export default {
  __config__: {
    def: comps,
    tag: 'el-icon',
    tagIcon: 'home',
    label: '图标',
    // needBorder: true,
    grid: false, // 不需要栅格
    // children: [],
    // header: []
    action: [],
    visibleOn: '',
    tip: ''
  },
  tagText: '',
  type: 'home',
  fill: '#457bfc',
  size: '40px',
  theme: 'outline',
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
      label: '图标类型',
      type: 'iconSelect',
      model: 'type',
      explain: '点击查看全部图标',
      linkUrl: () => 'https://iconpark.oceanengine.com/official'
    },
    {
      label: '填充颜色',
      type: 'edColor',
      model: 'fill'
    },
    {
      label: '图标大小',
      type: 'edString',
      model: 'size'
    },
    {
      label: '图标风格',
      type: 'edSelect',
      model: 'theme',
      options: [
        {
          label: '线性',
          value: 'outline'
        },

        {
          label: '填充',
          value: 'filled'
        },
        {
          label: '双色',
          value: 'two-tone'
        },
        {
          label: '多色',
          value: 'multi-color'
        }
      ]
    },
    ...actionEdit,
    {
      type: 'edAction',
      model: '__config__.action'
    }
  ]
};
