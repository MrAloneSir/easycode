import comps from './index.vue';
import ruleTrigger from '../utils/ruleTrigger';
import {
  styleEdit,
  config,
  baseEdit,
  dataSourceEdit,
  dataSourceConfig
} from '../baseConfig';

export default {
  // 组件的自定义配置
  __config__: {
    def: comps,
    label: '表单文本',
    labelWidth: null,
    showLabel: true,
    required: true,
    tag: 'span',
    tagIcon: 'view-grid-list',
    span: 24,
    isPre: false,
    ...config,
    ...dataSourceConfig,
  },
  domProps: {
    innerHTML: '这是一段文字这是一段文字这是一段文字这是一段文字'
  },
  // 其余的为可直接写在组件标签上的属性
  style: {
    width: '100%',
    color: '#333',
    fontSize: '12px',
    lineHeight: '36px'
  },
  edit: [
    ...baseEdit,
    ...dataSourceEdit,
    {
      label: '文字',
      type: 'edString',
      model: 'domProps.innerHTML',
      visibleOn: 'this.__config__.dataSourceType === "static"'
    },
    {
      type: 'divider',
      name: '属性配置'
    },
    {
      label: '显示标签',
      type: 'edBoolean',
      model: '__config__.showLabel'
    },
    {
      label: '是否必填',
      type: 'edBoolean',
      model: '__config__.required'
    },
    {
      label: 'json格式',
      type: 'edBoolean',
      model: '__config__.isPre'
    },
    ...styleEdit,
    {
      label: '行高',
      type: 'edString',
      model: 'style.lineHeight'
    },
    {
      label: '内容颜色',
      type: 'edString',
      model: 'style.color'
    },
    {
      label: '内容大小',
      type: 'edString',
      model: 'style.fontSize'
    }
  ]
};
