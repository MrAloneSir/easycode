<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import { deepClone, resetForm } from '@/utils/index';
import api from '@/api/request';
import { parseFunction } from '../../../../packages/utils/utils.js';
import { EventBus } from '../../../../packages/utils/event-bus';
import action from '@/utils/action';
import { splitResource } from '../utils';
function renderFrom(h) {
  // totalModel不能删除，用于watch totalModel字段
  const { formConfCopy, totalModel, state } = this;
  let disabled = false;
  if (formConfCopy.disabledExpress) {
    disabled = this.storeEvalExpress(formConfCopy.disabledExpress);
  }
  return (
    <el-row gutter={formConfCopy.gutter}>
      <el-form
        size={formConfCopy.size}
        label-position={formConfCopy.labelPosition}
        disabled={disabled}
        label-width={`${formConfCopy.labelWidth}px`}
        ref={formConfCopy.formRef}
        // model不能直接赋值 https://github.com/vuejs/jsx/issues/49#issuecomment-472013664
        props={{ model: this[formConfCopy.formRef] }}
        validate-on-rule-change={false}
      >
        {renderFormItem.call(this, h, formConfCopy.fields)}
      </el-form>
      <div v-show={false}>
        {{ totalModel }} {{ state }}
      </div>
    </el-row>
  );
}

function renderFormItem(h, elementList) {
  return elementList.map((scheme, index) => {
    scheme.__config__.parentRef = this.formConf?.formRef;
    scheme.__config__.parentFormModel = this[this.formConfCopy.formRef];
    return this.getComps(h, scheme, { index });
  });
}

export default {
  props: {
    formConf: {
      type: Object,
      required: true
    },
    state: {
      type: Object,
      required: true
    },
    type: {
      type: String
    }
  },
  data() {
    return {
      formConfCopy: deepClone(this.formConf),
      [this.formConf.formRef]: {},
      [this.formConf.formRules]: {},
      disableShow: false,
      valueIsArrayComps: ['el-group', 'ew-upload']
    };
  },
  computed: {
    ...mapGetters([
      'getComDef',
      'getStoreValue',
      'getRef',
      'getModelRef',
      'getServerRef',
      'getcheckedTableColumns',
      'storeEvalExpress'
    ]),
    totalModel: function() {
      let total = {
        [this.formConf.formRef]: this[this.formConf.formRef]
      };
      // 获取model
      this.getModel(this.formConfCopy.fields, total);
      this.setModelRef(total);
      return total;
    }
  },
  mounted() {
    action.setGlobalState({ done: true });
    // 不知为何计算属性第一次没有计算，所以需要在mounted里面先算一次
    if (this.type !== 'body') {
      return;
    }
    this.clearModel();
    try {
      // mounted钩子函数
      if (this.formConfCopy.mountedCode) {
        this.customFunction({
          code: this.formConfCopy.mountedCode
        });
      }
    } catch (error) {
      console.error(error);
    }
    // 设置window,ls,route的数据
    this.setOtherContentValue(this.formConfCopy.fields);
    this.$nextTick(() => {
      this.initServe({
        formConf: this.formConfCopy
      }).then((contentArr) => {
        this.contentArr = contentArr;
        this.setDynamicValue(this.formConfCopy.fields, contentArr);
      });
    });
  },
  provide() {
    return {
      getComps: this.getComps,
      formConf: () => this.formConf,
      handleAction: this.handleAction,
      drawingList: () => this.formConfCopy.fields,
      deleteItem: this.deleteItem,
      setDynamicValue: this.setDynamicValue,
      setOtherContentValue: this.setOtherContentValue,
      contentArr: this.contentArr,
      state: this.state,
      customFunction: this.customFunction
    };
  },
  methods: {
    ...mapActions(['initServe', 'changeServe']),
    ...mapMutations(['setModelRef', 'clearModel', 'clearInterval']),
    getModel(componentList, total) {
      componentList.forEach((cur) => {
        const config = cur.__config__;
        if (cur.formRef) {
          total[cur.formRef] = cur.formModel;
        }
        if (config.children) this.getModel(config.children, total);
      });
    },
    setValue(content = '', value) {
      const { formName, comsName } = this.findFormAndComsNodeName(content);
      if (!formName) {
        console.log('setValue no formName!!');
        return;
      }
      const rootArr = this.formConfCopy.fields;
      let formNode = null;
      if (formName === this.formConfCopy.formRef) {
        formNode = {
          __config__: {
            children: this.formConfCopy.fields
          }
        };
      } else {
        formNode = this.findFormNode(rootArr, formName);
      }
      if (!formNode) {
        console.log('setValue failed to find form:', formName);
        return;
      }
      this.setComsValue(formNode.__config__.children, comsName, value);
    },
    findFormAndComsNodeName(content = '') {
      let contentArr = content.split('.');
      if (contentArr.length === 2) {
        return {
          formName: contentArr[0],
          comsName: contentArr[1]
        };
      }
      return {
        formName: '',
        comsName: ''
      };
    },
    findFormNode(componentList, formName) {
      let result;
      for (let i = 0; i < componentList.length; i++) {
        const cur = componentList[i];
        const { __config__: config, formRef } = cur;
        if (formRef === formName) {
          return cur;
        }
        if (config.children) {
          result = this.findFormNode(config.children, formName);
          if (result) {
            break;
          }
        }
      }
      return result;
    },
    setComsValue(componentList, comsName, value) {
      componentList.forEach((cur) => {
        const { __config__: config, __vModel__ } = cur;
        if (__vModel__ === comsName) {
          this.$set(config, 'defaultValue', value);
        }
        if (config.children) this.setComsValue(config.children, comsName, value);
      });
    },
    setDynamicValue(componentList, contentArr = []) {
      componentList.forEach((cur) => {
        const config = cur.__config__;
        const { dataServerContent, dataSourceType, dataServerInfo, tag } = config;
        let emptyValue = '';
        if (this.valueIsArrayComps.includes(tag)) {
          emptyValue = [];
        }
        if (dataSourceType === 'dynamic' && contentArr.includes(dataServerContent)) {
          if (tag === 'el-switch') {
            let switchValue = this.getStoreValue(dataServerContent, dataServerInfo);
            this.$set(config, 'defaultValue', switchValue == true ? true : false);
          } else {
            let value = this.getStoreValue(dataServerContent, dataServerInfo)
            if (value === undefined || value === null) {
              value = emptyValue
            }
            this.$set(
              config,
              'defaultValue',
              value
            );
          }
        }
        if (config.children) this.setDynamicValue(config.children, contentArr);
      });
    },
    setOtherContentValue(componentList) {
      componentList.forEach((cur) => {
        const config = cur.__config__;
        const __vModel__ = cur.__vModel__;
        const { dataSourceType, dataServerInfo } = config;
        if (['window', 'Route', 'ls', 'state', 'currentScope'].includes(dataSourceType)) {
          if (dataSourceType === 'state') {
            if (config.watch) {
              config.watch()
            }
          const watch = this.$watch('state.' + dataServerInfo, () => {
              this.$set(config, 'defaultValue', this.getStoreValue(dataSourceType, dataServerInfo));
            }, {
              deep: true
          })
            config.watch = watch
          }
          this.$set(config, 'defaultValue', this.getStoreValue(dataSourceType, dataServerInfo));
        }
        if (config.children) this.setOtherContentValue(config.children);
      });
    },
    async handleAction(action, scopeInfo = null) {
      switch (action.actionType) {
        case 'dialog':
          this.formConfCopy.fields.push(action.dialog);
          break;
        case 'closeDialog':
          this.closeDialog(action.name);
          break;
        case 'url':
          const {
            url: actionUrl,
            options: actionOptions,
            resourceUrl,
            routerType = 'push'
          } = action;
          this.goToPage(actionUrl, actionOptions, resourceUrl, routerType);
          break;
        case 'store':
          const { options: storeOptions, target } = action;
          let param = this.getParam(storeOptions);
          for (const key in param) {
            if (Object.hasOwnProperty.call(param, key)) {
              const value = param[key];
              if (target === 'window') {
                window[key] = value;
              } else if (target === 'localStorage') {
                window.localStorage.setItem(key, value);
              }
            }
          }
          break;
        case 'interval':
          this.clearInterval(action.target);
          break;

        case 'ajax':
        case 'form':
          const {
            api: apiInfo,
            formArr = [],
            options = [],
            useCode = false
          } = action;

          const { url, method, host = 'VUE_APP_EEO_HOST', contentType = 'form' } = apiInfo;
          try {
            // 发起请求前弹框
            let {confirmText} = action;
            if (confirmText) {
              // 目前表格中的开关组件会传入scopeInfo对象，以便动态设置二次确认文案。
              // 示例支持语法: ${row.status===true?'下线':'上线'}
              if(scopeInfo) {
                const MUSTACHE_REG = /\$\{.*?\}/gi;
                const KEY_REG = /(?<=\$\{(\s*?)).*?(?=(\s*?)\})/gi;
                confirmText = confirmText.replace(MUSTACHE_REG, function(match = '') {
                  let content = match.match(KEY_REG)[0].trim();
                  let result = new Function('obj', 'with (obj) { return ' + content + '}')(scopeInfo);
                  return result;
                });
              }
              await this.$confirm(confirmText, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              });
            }
          } catch (error) {
            console.log(error);
            return;
          }
          let data = {};
          data.__url = url;
          data.__method = method;
          data.__host = host;
          data.__contentType = contentType;
          formArr.forEach((item) => {
            let formatItem = this.formatModel(item, this.getModelRef[item]);
            data = {
              ...formatItem,
              ...data
            };
          });
          let temParam = this.getParam(options);
          data = Object.assign({}, data, temParam);
          // 自定义校验参数
          if (useCode) {
            try {
              const customFunc = this.customFunction({
                code: action.optionSlotCode,
                type: 'bind'
              });
              data = customFunc(data);
              // 如果自定义函数返回的是false则不继续向下执行
              if (!data) {
                return;
              }
            } catch (error) {
              console.log('自定义表单参数格式函数执行出错：', error);
            }
          }
          if (action.actionType === 'ajax') {
            this.requestApi(data, action);
          } else if (action.actionType === 'form') {
            this.submitForm(formArr, data, action);
          }
          break;
        case 'message':
          this.$message({
            message: action.msgContent,
            type: action.type
          });
          break;
        case 'link':
          window.open(action.linkUrl, '_blank');
          break;
        case 'custom':
          this.customFunction({
            code: action.paramCode
          });
          break;
        default:
          break;
      }
    },
    deleteItem(index) {
      this.formConfCopy.fields.splice(index, 1);
    },
    formatModel(formName, model) {
      const { isFilterEmpty, emptyDefault } = this.formConfCopy;
      const result = {};
      for (const key in model) {
        const value = model[key];
        let resultValue = '';
        if (Array.isArray(value)) {
          const formChild = this.getFormChild(formName);
          resultValue = this.getNodeValue(key, formChild);
        } else {
          resultValue = value;
        }
        if (resultValue !== '') {
          result[key] = resultValue;
        } else if (!isFilterEmpty) {
          result[key] = emptyDefault || '';
        }
      }
      return result;
    },
    getFormChild(formName) {
      let formChild = [];
      if (formName === this.formConfCopy.formRef) {
        formChild = this.formConfCopy.fields;
      } else {
        this.__formNodeChildren = [];
        this.getFormNode(formName, this.formConfCopy.fields);
        formChild = this.__formNodeChildren;
      }
      return formChild;
    },
    getFormNode(formName, nodeChildren = []) {
      for (let i = 0; i < nodeChildren.length; i++) {
        const item = nodeChildren[i];
        const { tag, children } = item.__config__;
        if (tag === 'el-form' && item.formRef === formName) {
          this.__formNodeChildren = children;
          break;
        }
        if (tag !== 'el-table' && children && children.length) {
          this.getFormNode(formName, children);
        }
      }
    },
    getNodeValue(key, list = []) {
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        const { children, separator, defaultValue } = item.__config__;
        if (item.__vModel__ === key) {
          if (separator && Array.isArray(defaultValue)) {
            return defaultValue.join(separator);
          }
          return defaultValue;
        }
        if (children && children.length) {
          this.getNodeValue(key, children);
        }
      }
      return '';
    },
    getParam(param) {
      let newQuery = {};
      param.forEach((obj) => {
        let { key, value, content } = obj;
        if (content == 'checkedTable') {
          newQuery[key] = this.getcheckedTableColumns;
        } else {
          // 读取不同参数
          newQuery[key] = this.getStoreValue(content, value);
        }
      });
      return newQuery;
    },
    requestApi(data, action) {
      api.post('/proxy/index', data).then((res) => {
        this.afterAction(action, res);
      });
    },
    submitForm(formArr, data, action) {
      // 提交表单
      this.$refs = {
        ...this.$refs,
        ...this.getRef
      };
      let formPromise = formArr.map((formName) => {
        return new Promise((resolve) => {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              resolve(valid);
            } else {
              resolve(valid);
            }
          });
        });
      });
      Promise.all(formPromise).then((res) => {
        const result = res.every((item) => item === true);
        if (result) {
          api.post('/proxy/index', data).then((res) => {
            this.afterAction(action, res);
          });
        }
      });
    },
    afterAction(action, res) {
      // 请求后toast
      if (!res) return;
      if (res.code === 0 && (action?.message?.success || res?.msg || res?.message)) {
        this.$message.success(action?.message?.success || res?.msg || res?.message);
      } else if (res.code !== 0 && !res.msg && !res.message && action.message.failed) {
        // 如果服务端返回message或者msg，在request里面已经toast，如果没有取action里面的去toast
        this.$message.error(action.message.failed);
      }
      if (action.useCBCode) {
        const afterFunc = this.customFunction({
          code: action.paramCode,
          otherContent: {
            toast: this.$message,
            res
          },
          type: 'bind'
        });
        afterFunc(res);
      }

      // 接口返回失败，仅toast
      if (res.code !== 0) {
        return;
      }
      if (action.afterCloseDialogName && action.afterCloseDialogName.length) {
        this.closeDialog(action.afterCloseDialogName);
      }
      if (action?.reset) {
        if (res.code === 0) {
          resetForm(this.formConfCopy.fields, action.formArr);
        }
      }

      // 刷新页面
      if (action.reload) {
        let timer = setTimeout(() => {
          this.$router.go(0);
          clearTimeout(timer);
        }, 1500);
      } else if (action.emitList && action.emitList.length) {
        this.emitComps(action.emitList);
      } else if (action.redirect) {
        // 跳出站外
        let timer = setTimeout(() => {
          window.open(action.redirect, '_blank');
          clearTimeout(timer);
        }, 1500);
      } else if (action.afterUrl) {
        // 路由到其他页面
        let timer = setTimeout(() => {
          let { afterUrl, afterOptions, resourceUrl, afterRouterType } = action;
          this.goToPage(afterUrl, afterOptions, resourceUrl, afterRouterType);
          clearTimeout(timer);
        }, 1500);
      }
    },
    closeDialog(dialogNameArr) {
      dialogNameArr.forEach((closeName) => {
        let index = this.formConfCopy.fields.findIndex((item) => {
          return closeName === item.__config__.componentName;
        });
        if (index >= 0) {
          this.$nextTick(() => {
            this.formConfCopy.fields.splice(index, 1);
          });
        }
      });
    },
    emitComps(emitList) {
      emitList.forEach((event) => {
        EventBus.$emit(event, {}, 'reload');
      });
    },
    goToPage(url, options, resourceUrl, routerType = 'push') {
      if (url === '-1') {
        //TODO: 这里是否也需要用主应用的router?
        this.$router.back();
        return;
      }
      let newQuery = this.getParam(options);
      let oldQuery = this.$router.currentRoute.query;
      const { resourceId, resourceTag, resourceName } = splitResource(url);
      newQuery = Object.assign({}, newQuery, {
        projectId: oldQuery.projectId,
        projectTag: oldQuery.projectTag,
        resourceId,
        resourceTag,
        resourceName
      });
      if (window.__POWERED_BY_QIANKUN__SUB) {
        // 判断是否为原生页面
        let isNativePage = false;
        const menuList = JSON.parse(sessionStorage.getItem('menus'));
        console.log('gotoPage get called, url=', url);
        for (const key in menuList) {
          if (menuList[key].resourceTag === newQuery.resourceTag) {
            if (menuList[key].isLowcode !== undefined) {
              isNativePage = menuList[key].isLowcode !== '1';
            }
            break;
          }
        }

        if (resourceUrl) {
          // 1. 非低代码不需要前缀
          // 2. 低代码，使用主应用的router, 要确保有/lingji/runtime前缀
          // 3. 低代码，使用自己的router，要确保有/runtime前缀
          const prefix = isNativePage ? '' : this.parentRouter ? '/lingji/runtime' : '/runtime';
          if (resourceUrl[0] !== '/') resourceUrl = `/${resourceUrl}`;
          resourceUrl = resourceUrl.startsWith('/lingji') ? resourceUrl.substr(7) : resourceUrl;
          resourceUrl = resourceUrl.startsWith('/runtime') ? resourceUrl.substr(8) : resourceUrl;
          let path = prefix + resourceUrl;
          let router = this.parentRouter ? this.parentRouter : this.$router;

          if (isNativePage) {
            // 非低代码页面，需要去掉低代码默认的几个query字段
            delete newQuery.projectId;
            delete newQuery.projectTag;
            delete newQuery.resourceId;
            delete newQuery.resourceName;
            delete newQuery.resourceTag;
          }
          router[routerType]({ path, query: newQuery });
        } else {
          console.error('gotoPage with no resourceUrl');
        }
      } else {
        this.$router[routerType]({
          query: newQuery
        });
      }
    },
    customFunction({ code, otherContent = {}, type = 'call' }) {
      // type  call立即执行函数，  bind返回一个自定义函数，手动执行
      const { content, params } = parseFunction(code?.jsCode);
      let paramsArr = [];
      if (params) {
        paramsArr = params.replace(/\s/g, '').split(',');
      }
      try {
        return new Function(...paramsArr, content)[type]({
          setValue: this.setValue,
          model: this.getModelRef,
          $message: this.$message,
          $set: this.$set,
          state: this.state,
          $route: this.$route,
          $router: this.$router,
          ...otherContent
        });
      } catch (error) {
        console.error(error, 'customFunction');
        return;
      }
    },
    getComps(h, currentItem, options) {
      const config = currentItem.__config__;
      const def = this.getComDef(currentItem);
      const { visibleOn, parentFormModel } = config;
      //table scope 解析
      const { scope } = options;
      if (Object.keys(scope || {}).length) {
        if (
          visibleOn &&
          !this.storeEvalExpress(visibleOn, {
            row: scope.row,
            $index: scope.$index
          })
        ) {
          return null;
        }
      } else if (visibleOn && !this.storeEvalExpress(visibleOn)) {
        return null;
      }
      if (
        parentFormModel &&
        currentItem.__vModel__ &&
        visibleOn &&
        !this.storeEvalExpress(visibleOn)
      ) {
        this.$delete(parentFormModel, currentItem.__vModel__);
      } else if (
        parentFormModel &&
        currentItem.__vModel__ &&
        parentFormModel[currentItem.__vModel__] !== config.defaultValue
      ) {
        this.$set(parentFormModel, currentItem.__vModel__, config.defaultValue);
      }
      let params = {
        props: {
          currentItem: currentItem,
          layout: 'Parser',
          index: options.index,
          groupVModel: options.groupVModel || ''
        },
        on: {
          buttonAction: function() {
            options.callback && options.callback();
          }
        }
      };
      const child = h(def, params);

      let className = '';
      const autosize = { minRows: 4, maxRows: 12 };
      if (config.footer) {
        className += ' footer';
        return <div class={className}>{child}</div>;
      }
      const popover = (
        <el-popover
          placement="bottom"
          width="500"
          trigger="hover"
          v-show={child?.data?.props?.currentItem?.__config__?.tip}
        >
          <el-input
            type="textarea"
            autosize={autosize}
            placeholder="在此编辑注释内容"
            v-model={child.data.props.currentItem.__config__.tip}
            readonly={true}
          ></el-input>
          <span slot="reference" class="tipBorder">
            <i class="el-icon-chat-dot-square" />
          </span>
        </el-popover>
      );
      if (config.parentTag === 'el-filter') {
        return (
          <section style="display: inline">
            {popover}
            {child}
          </section>
        );
      } else if (config.grid === false) {
        className += ' raw-item';
        return (
          <div class={className}>
            {popover}
            {child}
          </div>
        );
      }
      return (
        <el-col span={config.span}>
          {popover}
          {child}
        </el-col>
      );
    }
  },
  render(h) {
    return renderFrom.call(this, h);
  }
};
</script>

<style lang="scss" scoped>
.form-item-right {
  margin-top: 5px;
  float: right;
}

.card-header {
  min-height: 50px;
  padding: 0;
}

.tipBorder {
  color: rgb(243, 166, 66);
  cursor: pointer;
}

.raw-item {
  // display: flex;
  // align-items: flex-start;
  float: left;
}

.footer {
  position: fixed;
  bottom: 10px;
  left: 240px;
  right: 10px;
  background: white;
  z-index: 100;
  min-height: 50px;
  padding-top: 11px;
  border-top: 10px solid rgb(240, 240, 240);
  box-sizing: border-box;
}

.el-table .el-table__cell {
  min-width: 80px !important;
}</style>
