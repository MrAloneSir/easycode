import comps from './index.vue'


export default {
  // 组件的自定义配置
  __config__: {
    def: comps,
    label: '图片',
    tag: 'img',
    tagIcon: 'pic',
    span: 24,
    visibleOn: '',
    tip: ''
  },
  src: 'https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/6d0a3e7acc3e91e2cfd83dbbe1d1c029.jpg?thumb=1&w=400&h=400&f=webp&q=90',
  // 其余的为可直接写在组件标签上的属性
  style: {
    width: '100px'
  },
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
      label: '链接',
      type: 'edString',
      model: 'src',
      source: 'upload'
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
    }
  ]
}

