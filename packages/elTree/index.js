import comps from './Index.vue';
import ruleTrigger from '../utils/ruleTrigger';
import { deepClone } from '../utils/utils';
import {
  styleEdit,
  config,
  baseEdit,
  props,
  dataSourceEdit,
  dataSourceConfig,
  optionsEdit,
  dynamicOptionsEdit,
  dataTypeConfig,
  localDynamicOptionsEdit,
  localDynamicOptionsConfig,
  dynamicOptionsConfig,
  apiHighConfig,
  apiHighEdit,
  attrEdit
} from '../baseConfig';

export default {
  __isVue3: true,
  __config__: {
    def: comps,
    rootData: true,
    tag: 'el-tree',
    tagIcon: 'tree-diagram',
    label: '树形控件',
    needBorder: true,
    grid: true, // 不需要栅格
    span: 24,
    children: [],
    header: [],
    defaultValue: [],

    ...config,
    ...dataSourceConfig,
    ...dataTypeConfig,
    ...dynamicOptionsConfig,
    ...localDynamicOptionsConfig,
    ...apiHighConfig,
    dynamicLabel: '',
    dynamicValue: 'children'
  },
  options: [
    {
      label: '静态选项1',
      children: [
        {
          label: '静态选项1-1',
          children: [
            {
              label: '静态选项1-2'
            }
          ]
        }
      ]
    }
  ],
  __vModel__: '',
  'show-checkbox': false,
  'node-key': 'id',
  accordion: false,
  draggable: false,
  style: { width: '100%' },
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
      label: '字段名',
      type: 'edString',
      explain: '提交表单时,提交的json对象中<br/>该组件对应的字段名称',
      model: '__vModel__'
    },
    {
      type: 'divider',
      name: 'api请求信息'
    },
    ...optionsEdit,
    ...dynamicOptionsEdit,
    ...localDynamicOptionsEdit,
    {
      label: '选项',
      type: 'edTree',
      visibleOn: 'this.__config__.dataType === "static"',
      model: 'options'
    },
    {
      type: 'edString',
      model: '__config__.dynamicLabel',
      visibleOn: 'this.__config__.dataType !== "static"',
      explain: '返回数据结构中，显示对应的字段名',
      label: 'label绑定'
    },
    {
      type: 'edString',
      model: '__config__.dynamicValue',
      visibleOn: 'this.__config__.dataType !== "static"',
      explain: '返回数据结构中，取值对应的字段名',
      label: 'children绑定'
    },

    {
      type: 'divider',
      name: '高级配置'
    },
    ...apiHighEdit,
    {
      type: 'divider',
      name: '属性'
    },
    {
      label: '可勾选',
      type: 'edBoolean',
      model: 'show-checkbox'
    },
    {
      label: '手风琴模式',
      type: 'edBoolean',
      model: 'accordion'
    },
    {
      label: '可拖拽',
      type: 'edBoolean',
      model: 'draggable'
    },
    {
      label: '节点ID',
      type: 'edString',
      model: 'node-key'
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
      label: '组件宽度',
      type: 'edString',
      model: 'style.width'
    }
  ]
};

