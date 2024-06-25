import comps from './Index.vue'

const descriptionsChild = [
  {
    __config__: {
      tag: 'el-descriptions-item',
      type: 'content',
      // 绑定数据信息
      dataSourceType: 'static',
      dataServerContent: '',
      dataServerInfo: '',
      visibleOn: '',
      defaultValue: '',
    },
    label: '用户名',
    text: '具体内容具体内容具体内容具体内容',
    span: 1,
    icon: ''
  },
  {
    __config__: {
      tag: 'el-descriptions-item',
      type: 'content',
      // 绑定数据信息
      dataSourceType: 'static',
      dataServerContent: '',
      dataServerInfo: '',
      defaultValue: '',
      visibleOn: '',
    },
    label: '手机号',
    text: '具体内容具体内容具体内容具体内容',
    span: 1,
    icon: ''
  },
  {
    __config__: {
      tag: 'el-descriptions-item',
      type: 'content',
      // 绑定数据信息
      dataSourceType: 'static',
      dataServerContent: '',
      dataServerInfo: '',
      defaultValue: '',
      visibleOn: '',
    },
    label: '居住地址',
    text: '具体内容具体内容具体内容具体内容',
    span: 1,
    icon: ''
  }
]

export default {
  __config__: {
    def: comps,
    label: '描述列表',
    tag: 'el-descriptions',
    tagIcon: 'list',
    action: [],
    children: descriptionsChild,
    span: 24,
    // 绑定数据信息
    dataSourceType: 'static',
    dataServerContent: '',
    visibleOn: '',
    tip: '',
  },
  title: '这里可以写标题也可删除',
  border: false,
  column: 3,
  direction: 'horizontal',
  size: '',
  colon: true,
  edit: [
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
      type: 'divider',
      name: '属性'
    },
    {
      label: '是否带有边框',
      type: 'edBoolean',
      model: 'border'
    },
    {
      label: '做上方标题',
      type: 'edString',
      model: 'title'
    },
    {
      label: '一行有几列',
      type: 'edNumber',
      model: 'column'
    },
    {
      label: '排列的方向',
      type: 'edSelect',
      model: 'direction',
      options: [
        {
          label: 'horizontal',
          value: 'horizontal'
        },
        {
          label: 'vertical',
          value: 'vertical'
        }
      ]
    },
    {
      label: '列表的尺寸',
      type: 'edSelect',
      model: 'size',
      options: [
        {
          label: '大号',
          value: 'medium'
        },
        {
          label: '中号',
          value: 'small'
        },
        {
          label: '小号',
          value: 'mini'
        }
      ]
    },
    {
      label: '是否显示冒号',
      type: 'edBoolean',
      model: 'colon'
    },
    {
      label: '数据来源类型',
      type: 'edSelect',
      model: '__config__.dataSourceType',
      options: [
        {
          label: '静态数据',
          value: 'static'
        },
        {
          label: '远程数据',
          value: 'dynamic'
        }
      ]
    },
    {
      label: '数据源选取',
      type: 'edSelect',
      source: 'dynamic',
      model: '__config__.dataServerContent',
      visibleOn: 'this.__config__.dataSourceType === "dynamic"'
    },
    {
      label: '信息编辑',
      type: 'edArray',
      model: '__config__.children',
      showLabel: 'label',
      valueType: {
        label: '类型',
        options: [
          {
            label: 'content',
            value: '0',
            default: {
              __config__: {
                tag: 'el-descriptions-item'
              },
              label: '标题',
              defaultValue: '',
              text: '具体内容',
              span: 1,
              icon: '',
              // 绑定数据信息
              dataSourceType: 'static',
              dataServerContent: '',
              dataServerInfo: '',
              visibleOn: '',
            }
          }
        ]
      },
      item: {
        type: 'edObject',
        props: {
          label: {
            type: 'edString',
            label: '标题'
          },
          text: {
            label: '具体内容',
            type: 'edString',
            visibleOn: 'this.__config__.dataSourceType === "static"'
          },
          span: {
            label: '列的数量',
            type: 'edNumber',
          },
          icon: {
            label: '饿了么图标',
            type: 'edString',
          },
          dataSourceType: {
            label: '数据来源类型',
            type: 'edSelect',
            model: '__config__.dataSourceType',
            options: [
              {
                label: '静态数据',
                value: 'static'
              },
              {
                label: '远程数据',
                value: 'dynamic'
              }
            ]
          },
          dataServerContent: {
            label: '数据源选取',
            type: 'edSelect',
            source: 'dynamic',
            model: '__config__.dataServerContent',
            visibleOn: 'this.__config__.dataSourceType === "dynamic"'
          },
          dataServerInfo: {
            label: '数据绑定',
            type: 'edString',
            model: '__config__.dataServerInfo',
            visibleOn: 'this.__config__.dataSourceType === "dynamic"'
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
    }
  ]
}
