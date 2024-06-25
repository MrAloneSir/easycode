import comps from './index.vue';

export default {
  __config__: {
    def: comps,
    tag: 'el-breadcrumb',
    tagIcon: 'bread',
    label: '面包屑',
    child: [{
      name: '首页',
      href: '/',
      type: 'to'
    }],
    visibleOn: '',
  },
  separator: '/',
  'separatorClass': '',
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
      label: '分隔符',
      type: 'edString',
      model: 'separator'
    },
    {
      label: '分隔图标',
      type: 'edString',
      model: 'separatorClass'
    },
    {
      label: '信息编辑',
      type: 'edArray',
      model: '__config__.child',
      showLabel: 'name',
      item: {
        type: 'edObject',
        props: {
          name: {
            type: 'edString',
            label: '页面名称',
            model: 'name',
          },
          href: {
            type: 'edString',
            label: '跳转路由',
          },
          type: {
            type: 'edSelect',
            label: '跳转方式',
            options: [
              {
                label: 'to',
                value: 'to'
              },
              {
                label: 'replace',
                value: 'replace'
              }
            ]
          }
        }
      }
    }
  ]
};
