import comps from './index.vue';
import { styleEdit, props, actionEdit, config, baseEdit } from '../baseConfig';

export default {
  __config__: {
    def: comps,
    label: '按钮',
    tag: 'el-button',
    tagIcon: 'click-tap',
    grid: false, // 不需要栅格
    action: [],
    ...config,
    style: { marginLeft: '10px', marginTop: '0px', marginBottom: '10px' },
  },
  domProps: {
    innerHTML: '按钮'
  },
  type: 'primary',
  size: 'medium',
  ...props,
  disabledExpress: '',
  edit: [
    ...baseEdit,
    {
      label: '文字',
      type: 'edString',
      model: 'domProps.innerHTML'
    },
    ...styleEdit,
    {
      label: 'type',
      type: 'edSelect',
      model: 'type',
      options: [
        {
          label: 'primary',
          value: 'primary'
        },
        {
          label: 'success',
          value: 'success'
        },
        {
          label: 'info',
          value: 'info'
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
          label: 'text',
          value: 'text'
        },
        {
          label: 'none',
          value: 'none'
        }
      ]
    },
    {
      label: 'size',
      type: 'edSelect',
      model: 'size',
      options: [
        {
          label: 'medium',
          value: 'medium'
        },
        {
          label: 'small',
          value: 'small'
        },
        {
          label: 'mini',
          value: 'mini'
        }
      ]
    },
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
    ...actionEdit,
    {
      type: 'edAction',
      model: '__config__.action'
    }
  ]
};

