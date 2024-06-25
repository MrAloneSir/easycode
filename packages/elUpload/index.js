import { actionEdit, baseEdit, config, props, styleEdit } from '../baseConfig';
import comps from './index.vue';

export default {
  __config__: {
    def: comps,
    label: '上传',
    tag: 'el-upload',
    layout: 'colFormItem', //表单组件
    span: 24,
    showLabel: true,
    defaultValue: [],
    tagIcon: 'click-tap',
    grid: false, // 不需要栅格
    action: [],
    ...config,
    flag: '2',
    eeoHost: 'VUE_APP_EEO_HOST',
    cosHost: 'VUE_APP_COS_HOST',
    dataListInfo: 'data',
    style: { marginLeft: '10px', marginTop: '0px', marginBottom: '10px' },
    accept: '',
    multiple: false,
    limit: 1,
    tip: '',
    showFileList: true,
    listType: 'text',
    __vModel__: ''
  },
  ...props,
  disabledExpress: '',
  edit: [
    ...baseEdit,
    {
      label: '字段名',
      type: 'edString',
      explain: '提交表单时,提交的json对象中<br/>该组件对应的字段名称',
      model: '__vModel__'
    },
    ...styleEdit,
    {
      label: '是否禁用',
      type: 'edString',
      model: 'disabledExpress',
      placeholder: "Route.type === 'look'",
      explain: ` Route或者表单名.关联组件的字段名 === 值<br/>
      例如Route.type === 'look'<br/>
      上下文有:<br/>
      Route,ls(localStorage),ss(sessionStorage),state,window,model,server(server__0)
      `
    },
    {
      type: 'divider',
      name: '属性'
    },
    {
      label: '支持类型',
      type: 'edString',
      explain: '填写默认值格式如: image/*',
      model: '__config__.accept',
    },
    {
      label: '是否多选',
      type: 'edBoolean',
      model: '__config__.multiple'
    },
    {
      label: '最大个数',
      type: 'edNumber',
      model: '__config__.limit',
      visibleOn: 'this.__config__.multiple === true'
    },
    {
      label: '提示说明',
      type: 'edString',
      explain: '填写默认值格式如: 只能上传jpg/png文件，且不超过500kb',
      model: '__config__.tip',
    },
    {
      label: '显示列表',
      type: 'edBoolean',
      model: '__config__.showFileList'
    },
    {
      label: '列表类型',
      type: 'edSelect',
      model: '__config__.listType',
      options: [
        {
          label: 'text',
          value: 'text'
        },
        {
          label: 'picture',
          value: 'picture'
        },
        {
          label: 'picture-card',
          value: 'picture-card'
        },
      ],
      visibleOn: 'this.__config__.showFileList === true'
    },
    {
      label: '显示标签',
      type: 'edBoolean',
      model: '__config__.showLabel'
    },
    ...actionEdit,
    {
      type: 'edAction',
      model: '__config__.action'
    }
  ]
};
