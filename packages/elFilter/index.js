import comp from './index.vue';

export default {
  __config__: {
    def: comp,
    layout: 'tableRowItem',
    tag: 'el-filter',
    tagIcon: 'filter',
    needBorder: true, // 需要border
    label: '表格筛选容器',
    children: [],
    draggGroup: 'filterGroup',
    visibleOn: '',
    tip: '',
    isFilterEmpty: true,
    emptyDefault: 'null',
    allowPagePut: false,
    optionSlotCode: {
      htmlCode: '',
      cssCode: '',
      jsCode:
        '// data是整个表单数据集合,需直接改变data的值,并且将data返回\nfunction dataPipe(data) {\n\treturn [{label:"", value:""}];\n}\n'
    },
    useCodeFilter: false
  },
  formRef: 'elForm',
  formModel: {},
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
      type: 'edString',
      label: '过滤器名',
      model: 'formRef'
    },
    {
      label: '选择table',
      type: 'edString',
      explain: '填写对应表格的字段名<br/>(表格组件->基础信息->字段名)',
      model: 'tableVModel'
    },
    // {
    //   label: '过滤空值',
    //   type: 'edBoolean',
    //   explain: '开启后,在提交的json对象中,将不会出现,没有值的选项',
    //   model: '__config__.isFilterEmpty'
    // },
    // {
    //   label: '设置空值',
    //   type: 'edString',
    //   model: '__config__.emptyDefault',
    //   visibleOn: '!this.__config__.isFilterEmpty'
    // },
  ]
};
