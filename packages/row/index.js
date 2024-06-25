import index from './index.vue';
export default {
  __config__: {
    def: index,
    span: 24,
    layout: 'rowFormItem',
    tag: 'el-row',
    tagIcon: 'square',
    label: '行容器',
    labelWidth: null,
    showLabel: true,
    draggGroup: 'rowGroup',
    gutter: 15,
    needBorder: true, // 需要border
    visibleOn: '',
    tip: '',
    style: {
      marginTop: '',
      marginRight: '',
      marginBottom: '',
      marginLeft: '',
      paddingTop: '',
      paddingRight: '',
      paddingBottom: '',
      paddingLeft: ''
    }
  },
  type: 'default',
  justify: 'start',
  align: 'top',
  edit: [
    {
      type: 'divider',
      name: '基础信息'
    },
    {
      label: '标题',
      type: 'edString',
      model: '__config__.label',
      visibleOn: 'this.__config__.showLabel'
    },
    {
      label: '是否显示',
      type: 'edString',
      model: '__config__.visibleOn'
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
      label: '布局模式',
      type: 'edSelect',
      model: 'type',
      options: [
        {
          label: 'default',
          value: 'default'
        },
        {
          label: 'flex',
          value: 'flex'
        }
      ]
    },
    {
      label: '水平排列',
      type: 'edSelect',
      model: 'justify',
      visibleOn: 'this.type === "flex"',
      options: [
        {
          label: 'start',
          value: 'start'
        },
        {
          label: 'end',
          value: 'end'
        },
        {
          label: 'center',
          value: 'center'
        },
        {
          label: 'space-around',
          value: 'space-around'
        },
        {
          label: 'space-between',
          value: 'space-between'
        }
      ]
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
      label: 'Top',
      type: 'edString',
      visibleOn: 'this.__config__.distanceSet === "margin"',
      model: '__config__.style.marginTop'
    },
    {
      label: 'Right',
      type: 'edString',
      visibleOn: 'this.__config__.distanceSet === "margin"',
      model: '__config__.style.marginRight'
    },
    {
      label: 'Bottom',
      type: 'edString',
      visibleOn: 'this.__config__.distanceSet === "margin"',
      model: '__config__.style.marginBottom'
    },
    {
      label: 'Left',
      type: 'edString',
      visibleOn: 'this.__config__.distanceSet === "margin"',
      model: '__config__.style.marginLeft'
    },
    {
      label: 'Top',
      type: 'edString',
      visibleOn: 'this.__config__.distanceSet === "padding"',
      model: '__config__.style.paddingTop'
    },
    {
      label: 'Right',
      type: 'edString',
      visibleOn: 'this.__config__.distanceSet === "padding"',
      model: '__config__.style.paddingRight'
    },
    {
      label: 'Bottom',
      type: 'edString',
      visibleOn: 'this.__config__.distanceSet === "padding"',
      model: '__config__.style.paddingBottom'
    },
    {
      label: 'Left',
      type: 'edString',
      visibleOn: 'this.__config__.distanceSet === "padding"',
      model: '__config__.style.paddingLeft'
    },
    {
      type: 'divider',
      name: '属性'
    },
    {
      label: '显示标签',
      type: 'edBoolean',
      model: '__config__.showLabel'
    }
  ]
};
