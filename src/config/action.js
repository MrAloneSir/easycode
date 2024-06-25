import { dialogSchema } from '~/index';
import { deepClone } from '@/utils/index';

const cloneDialogSchema = deepClone(dialogSchema);

cloneDialogSchema.__config__.type = 'action';

export const DialogActionSchema = {
  actionType: 'dialog',
  dialog: cloneDialogSchema
};

export const CloseDialogActionSchema = {
  actionType: 'closeDialog',
  name: []
};

export const UrlActionSchema = {
  actionType: 'url',
  url: '',
  routerType: 'push',
  options: [],
  resourceUrl: ''
};

export const ReloadActionSchema = {
  actionType: 'reload',
  target: ''
};

export const CopyActionSchema = {
  actionType: 'copy',
  copy: ''
};

const ajaxAndFormSchema = {
  options: [],
  confirmText: '',
  mioneApi: 1,
  api: {
    method: 'post', // 'get' | 'post' | 'put' | 'delete' | 'patch' | 'jsonp';
    url: '',
    data: {},
    host: 'VUE_APP_EEO_HOST',
    contentType: 'json'
  },
  reload: false,
  emitList: [],
  redirect: '',
  afterUrl: '',
  afterOptions: [],
  resourceUrl: '',
  afterRouterType: 'push',
  afterCloseDialogName: [],
  message: {
    success: '',
    failed: ''
  },
  useCode: false,
  optionSlotCode: {
    htmlCode: '',
    cssCode: '',
    jsCode:
      "// data是全部接口请求参数,直接修改data,将修改后的data返回\n \
      // this.$message可以用来展示toast, 例如this.$message.success('xxx')\n \
      // 页面变量通过this.model暴露。例如要访问表单elForm下的select，可以写为this.model.elForm.select\n \
// 改变变量值需通过this.setValue方法实现。this.setValue\('elForm.name', 1\)\n \
// (目前仅支持访问添到到form内的组件，且仅能访问一级)\n \
// element的this.$message方法可以调用 \n \
//如果自定义函数返回的是false, 则不继续向下执行请求函数 \n \
function dataPipe(data) {\n\treturn data;\n}\n"
  },
  useCBCode: false,
  paramCode: {
    htmlCode: '',
    cssCode: '',
    jsCode:
      "// res是全部接口返回json数据,返回值应为一个对象\n \
      // this.$message可以用来展示toast, 例如this.$message.success('xxx')\n \
      // 页面变量通过this.model暴露。例如要访问表单elForm下的select，可以写为this.model.elForm.select\n \
// 改变变量值需通过this.setValue方法实现。this.setValue('elForm.name', 1)\n \
// (目前仅支持访问添到到form内的组件，且仅能访问一级)\n \
// element的this.$message方法可以调用 \n \
function dataPipe(res) {\n\n}\n"
  }
};

export const AjaxActionSchema = {
  actionType: 'ajax',
  ...ajaxAndFormSchema
};

export const FormActionSchema = {
  actionType: 'form',
  formArr: [],
  reset: false,
  ...ajaxAndFormSchema
};

export const MessageActionSchema = {
  actionType: 'message',
  type: '',
  msgContent: ''
};

export const LinkActionSchema = {
  actionType: 'link',
  linkUrl: ''
};

export const customActionSchema = {
  actionType: 'custom',
  paramCode: {
    htmlCode: '',
    cssCode: '',
    jsCode:
      "// 页面变量通过this.model暴露。例如要访问表单elForm下的select，可以写为this.model.elForm.select\n \
//改变变量值需通过this.setValue方法实现。this.setValue('elForm.name', 1)\n \
//(目前仅支持访问添到到form内的组件，且仅能访问一级)\n \
function dataPipe() {\n\n}\n"
  }
};

export const storeDataSchema = {
  actionType: 'store',
  options: [],
  target: '',
}
