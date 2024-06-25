import comps from './index.vue';
import { dataSourceEdit } from '../baseConfig';

const textChild = [
  {
    __config__: {
      tag: 'text',
      type: 'content'
    },
    label: 1,
    text: '开票成功',
    color: '#333'
  }
];
export default {
  // 组件的自定义配置
  __config__: {
    def: comps,
    label: '文本',
    tag: 'p',
    tagIcon: 'text',
    dataSourceType: 'static',
    distanceSet: '',
    dataServerContent: '',
    dataServerInfo: '',
    span: 24,
    visibleOn: '',
    tip: '',
    textCustomize: false,
    children: textChild
  },
  domProps: {
    innerHTML: '这是一段文字这是一段文字这是一段文字这是一段文字'
  },
  // 其余的为可直接写在组件标签上的属性
  style: {
    width: '100%',
    color: '#333',
    fontSize: '12px',
    fontWeight: 'normal',
    marginTop: '',
    marginRight: '',
    marginBottom: '',
    marginLeft: '',
    paddingTop: '',
    paddingRight: '',
    paddingBottom: '',
    paddingLeft: '',
    textIndent: '0px'
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
    ...dataSourceEdit,
    {
      label: '文字',
      type: 'edString',
      model: 'domProps.innerHTML',
      visibleOn: 'this.__config__.dataSourceType === "static"'
    },
    {
      type: 'edBoolean',
      label: '文本显示修改',
      explain: '配置文本转换规则<br/>例如把服务端返回的"0"和"1",转换为"成功"和"失败"',
      model: '__config__.textCustomize',
      visibleOn: 'this.__config__.dataSourceType !== "static"'
    },
    {
      label: '转换规则',
      type: 'edArray',
      visibleOn:
        'this.__config__.textCustomize === true &&this.__config__.dataSourceType !== "static"',
      model: '__config__.children',
      showLabel: 'label',
      item: {
        type: 'edObject',
        props: {
          label: {
            type: 'edString',
            label: '原文本'
          },
          text: {
            type: 'edString',
            label: '显示文本'
          },
          color: {
            type: 'edColor',
            label: '颜色'
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
    },
    {
      label: '宽度',
      type: 'edString',
      model: 'style.width'
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
    },
    {
      label: '字重',
      type: 'edString',
      model: 'style.fontWeight'
    },
    {
      label: '间距设置',
      type: 'edSelect',
      model: '__config__.distanceSet',
      options: [
        {
          label: 'margin',
          value: 'margin'
        },
        {
          label: 'padding',
          value: 'padding'
        },
        {
          label: 'none',
          value: 'none'
        }
      ]
    },
    {
      label: 'marginTop',
      type: 'edString',
      visibleOn: 'this.__config__.distanceSet === "margin"',
      model: 'style.marginTop'
    },
    {
      label: 'marginRight',
      type: 'edString',
      visibleOn: 'this.__config__.distanceSet === "margin"',
      model: 'style.marginRight'
    },
    {
      label: 'marginBottom',
      type: 'edString',
      visibleOn: 'this.__config__.distanceSet === "margin"',
      model: 'style.marginBottom'
    },
    {
      label: 'marginLeft',
      type: 'edString',
      visibleOn: 'this.__config__.distanceSet === "margin"',
      model: 'style.marginLeft'
    },
    {
      label: 'paddingTop',
      type: 'edString',
      visibleOn: 'this.__config__.distanceSet === "padding"',
      model: 'style.paddingTop'
    },
    {
      label: 'paddingRight',
      type: 'edString',
      visibleOn: 'this.__config__.distanceSet === "padding"',
      model: 'style.paddingRight'
    },
    {
      label: 'paddingBottom',
      type: 'edString',
      visibleOn: 'this.__config__.distanceSet === "padding"',
      model: 'style.paddingBottom'
    },
    {
      label: 'paddingLeft',
      type: 'edString',
      visibleOn: 'this.__config__.distanceSet === "padding"',
      model: 'style.paddingLeft'
    },
    {
      label: 'textIndent',
      type: 'edString',
      model: 'style.textIndent'
    }
  ]
};
