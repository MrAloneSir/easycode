import comp from './index.vue';

const sureBtn = {
  __config__: {
    label: '按钮',
    tag: 'el-button',
    tagIcon: 'click-tap',
    grid: false, // 不需要栅格
    layout: 'raw',
    action: [],
    tip: '',
    style: { marginLeft: '0px' },
  },
  __slot__: {
    default: '确认'
  },
  domProps: {
    innerHTML: '确认'
  },
  type: 'primary',
  size: 'small'
};

const cancelBtn = {
  __config__: {
    label: '按钮',
    tag: 'el-button',
    tagIcon: 'click-tap',
    grid: false, // 不需要栅格
    layout: 'raw',
    action: [],
    style: { marginLeft: '10px' },
  },
  __slot__: {
    default: '取消'
  },
  domProps: {
    innerHTML: '取消'
  },
  type: '',
  size: 'small'
};

export default {
  __config__: {
    def: comp,
    layout: 'dialogItem',
    tagIcon: 'airplay',
    tag: 'el-dialog',
    label: '弹框',
    showList: false, // 是否显示到左侧
    showCopyDelete: false,
    children: [],
    draggGroup: 'dialogGroup',
    footerBtn: [sureBtn, cancelBtn],
    width: ''
  },
  title: '标题',
  edit: [
    {
      label: '标题',
      type: 'edString',
      model: 'title'
    },
    {
      label: '弹框名',
      type: 'edString',
      model: '__config__.componentName'
    },
    {
      type: 'divider',
      name: '样式信息'
    },
    {
      label: '宽度',
      type: 'edString',
      model: '__config__.width'
    }
  ]
};
