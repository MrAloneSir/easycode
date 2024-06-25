<template>
  <div class="edit">
    <div class="header">
      <div class="logo" @click="handleList">
        <a>项目列表</a>
      </div>
      <div class="flex items-center mr-5">
        <el-button icon="el-icon-document-checked" type="text" size="medium" @click="updateThrottle(true)">
          保存
        </el-button>
        <el-button class="delete-btn" style="color: #f56c6c;" icon="el-icon-delete" size="medium" type="text"
          @click="empty">
          清空
        </el-button>
      </div>
    </div>
    <div class="body">
      <div class="left-area">
        <div class="left-tab" @click="handleComponents">
          <svg-icon icon-class="components" class-name="icon-class" />
          <div>组件库</div>
        </div>
        <div class="left-tab" @click="handleTree">
          <svg-icon icon-class="tree" class-name="icon-class" />
          <div>大纲树</div>
        </div>
        <div class="left-tab" @click="handleData">
          <svg-icon icon-class="data" class-name="icon-class" />
          <div>数据源</div>
        </div>
        <div class="left-tab" @click="handleJS">
          <svg-icon icon-class="js" class-name="icon-class" />
          <div>JS</div>
        </div>
        <!-- <div class="left-tab" @click="handleSchema">
          <svg-icon icon-class="S" class-name="icon-class" />
          <div>Schema</div>
        </div> -->
      </div>
      <div v-show="showComponents" class="left-board components-list">
        <div v-for="(item, listIndex) in allLib" :key="listIndex">
          <div class="components-title">
            {{ item.title }}
          </div>
          <draggable class="components-draggable" :list="item.list" :group="{
            name: dragableGroup,
            pull: 'clone',
            put: false
          }" :clone="cloneComponent" draggable=".components-item" :sort="false" @end="onEnd">
            <div v-for="(element, index) in item.list" :key="index" class="components-item"
              @click="addComponent(element)">
              <div class="components-body">
                <el-icon style="vertical-align: top" :type="element.__config__.tagIcon" />
                <div class="text-center">
                  <p v-for="(line, lineIndex) in element.__config__.label.split(/\s+/g)" :key="lineIndex">
                    {{ line }}
                  </p>
                </div>
              </div>
            </div>
          </draggable>
        </div>
      </div>
      <div v-show="showTree" class="left-board">
        <outline-tree :drawing-list="drawingList" @getCopyList="getCopyList" @getNewCode="getNewCode"
          :active-id="activeId"></outline-tree>
      </div>
      <div v-show="showData" class="left-board">
        <data-list :formConf="formConf"></data-list>
      </div>
      <div class="center-board" @click="activeFormItem()">
        <Content :has-footer="formConf.hasFooter">
          <template #main>
            <el-row class="center-board-row" :gutter="formConf.gutter">
              <el-form :size="formConf.size" :label-position="formConf.labelPosition" :disabled="formDisabled"
                :label-width="formConf.labelWidth + 'px'" :model="homeModel">
                <draggable class="drawing-board" :list="drawingList" :animation="340" group="componentsGroup">
                  <draggable-item v-for="(item, index) in drawingList" :key="index" :drawing-list="drawingList"
                    :current-item="item" :index="index" :active-id="activeId" @activeItem="activeFormItem"
                    @copyItem="drawingItemCopy" @addItem="addItem" @deleteItem="drawingItemDelete">
                  </draggable-item>
                </draggable>
                <div v-show="!drawingList.length" class="empty-info">
                  从左侧拖入或点选组件进行页面设计
                </div>
              </el-form>
            </el-row>
          </template>
        </Content>
      </div>
      <right-panel :active-data="activeData" :form-conf="formConf" :show-field="!!drawingList.length" />
    </div>
    <Monaco v-if="showJS" :codeString="formConf.mountedCode" :visiable="showJS" defaultName="javascript"
      @actionMonaco="handleMountedCode" />
    <Monaco v-if="showSchema" :codeString="drawingListObj" :visiable="showSchema" defaultName="json"
      @actionMonaco="handleSchemaAction" />
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import { debounce, throttle } from 'throttle-debounce';
import ClipboardJS from 'clipboard';
import DraggableItem from './components/DraggableItem';
import RightPanel from './components/RightPanel';
import OutlineTree from './components/OutlineTree.vue';
import { pageUpdate, getPageInfo } from '@/api/user';
import { formConf, allowPutChild } from '@/config/config';
import logo from '@/assets/icon-logo.png';
import Content from './components/Content.vue';
import { mapMutations, mapActions, mapGetters } from 'vuex';
import lib from '../../../packages/index';
import { deepClone } from '@/utils/index';
import Monaco from '../../components/editor/coms/Monaco.vue';
import DataList from './components/DataList';
import {
  getDrawingList,
  saveDrawingList,
  getIdGlobal,
  saveIdGlobal,
  getFormConf,
  saveFormConf,
  getFormName
} from '@/utils/db';
import loadBeautifier from '@/utils/loadBeautifier';
import { mergeWith, isArray } from 'lodash';
import { parseFunction } from '../../../packages/utils/utils';
import loader from '@monaco-editor/loader';

let oldActiveId;
let tempActiveData;

export default {
  name: 'Home',
  components: {
    draggable,
    RightPanel,
    DraggableItem,
    Content,
    Monaco,
    OutlineTree,
    DataList
  },
  data() {
    return {
      showSchema: false,
      monaco: {},
      state: {}, // 初始化state
      name: '',
      initDialogVisible: false,
      showComponents: true,
      showTree: false,
      showData: false,
      showJS: false,
      resourceUrl: this.$route.query.resourceUrl,
      resourceId: this.$route.query.resourceId,
      logo,
      idGlobal: 100,
      formConf,
      labelWidth: 100,
      drawingList: [],
      drawingData: {},
      activeId: -1,
      drawerVisible: false,
      formData: {},
      dialogVisible: false,
      jsonDrawerVisible: false,
      generateConf: null,
      showFileName: false,
      activeData: {},
      saveDrawingListDebounce: debounce(340, saveDrawingList),
      saveIdGlobalDebounce: debounce(340, saveIdGlobal),
      updateThrottle: throttle(2000, this.update),
      leftComponents: lib.libs,
      isSave: false,
      dragableGroup: 'componentsGroup',
      homeModel: {},
      centerTipVisible: false,
      tipText: '',
      tipObject: {}
    };
  },
  watch: {
    // eslint-disable-next-line func-names
    'activeData.__config__.label': function (val, oldVal) {
      if (
        this.activeData.placeholder === undefined ||
        !this.activeData.__config__.tag ||
        oldActiveId !== this.activeId
      ) {
        return;
      }
      this.activeData.placeholder = this.activeData.placeholder.replace(oldVal, '') + val;
    },
    activeId: {
      handler(val) {
        oldActiveId = val;
      },
      immediate: true
    },
    drawingList: {
      handler(val) {
        const { tableArr, bindArr } = this.handleDrawingList(val);
        // 表格和筛选器绑定
        if (tableArr.length === 1 && bindArr.length === 1) {
          const bindItem = bindArr[0];
          const tableItem = tableArr[0];
          // 自动绑定
          bindItem.tableVModel = tableItem.__vModel__;
          tableItem.filterVModel = bindItem.formRef;
        } else if (tableArr.length === 0 || bindArr.length === 1) {
          const bindItem = bindArr[0];
          bindItem && (bindItem.tableVModel = '');
        } else if (tableArr.length === 1 || bindArr.length === 0) {
          const tableItem = tableArr[0];
          tableItem && (tableItem.filterVModel = '');
        }
        this.saveDrawingListDebounce(val);
        if (val.length === 0) this.idGlobal = 100;
        this.changeServe({
          formConf: this.formConf
        });
        if (val.length === 0) {
          this.activeFormItem();
        }
      },
      deep: true
    },
    idGlobal: {
      handler(val) {
        this.saveIdGlobalDebounce(val);
      },
      immediate: true
    },
    activeData: function (activeData) {
      if (activeData && activeData.__config__ && activeData.__config__.draggGroup) {
        this.dragableGroup = activeData.__config__.draggGroup;
      } else {
        this.dragableGroup = 'componentsGroup';
      }
    },
    formConf: {
      handler(val, oldVal) {
        this.deleteModel(oldVal.formRef);
        this.addModel({ key: this.formConf.formRef });
        this.handleDrawingList(this.drawingList);
        saveFormConf(val);
      },
      deep: true
    },
    state: function (value) {
      this.changeState(value);
    }
  },
  computed: {
    ...mapGetters(['getComSchema', 'storeEvalExpress']),
    allLib: function () {
      const projectLib = this.$store.getters.getProjectLib;
      if (projectLib && projectLib.libs) {
        return lib.libs.concat(projectLib.libs);
      }
      // diaLog组件自身拖拽有问题，无需显示在组件列表，所以左侧列表渲染时进行过滤
      lib.libs?.map((item) => {
        if (item.title == '数据展示') {
          item.list?.forEach((listItem, index) => {
            if (listItem?.__config__?.tag == 'el-dialog') {
              item?.list?.splice(index, 1);
            }
          });
        }
      });
      return lib.libs;
    },
    formDisabled: function () {
      return this.storeEvalExpress(this.formConf.disabledExpress);
    },
    drawingListObj: function () {
      return { jsonCode: JSON.stringify(this.drawingList) };
    }
  },
  async beforeCreate() {
    this.$store.dispatch('registerProjectLib');
    loader.config({
      paths: {
        vs: 'https://cdn.cnbj3-fusion.fds.api.mi-img.com/flybird/frontend/vs'
      }
    });
    try {
      const monaco = await loader.init();
      this.$set(this.monaco, 'monaco', monaco);
    } catch (error) {
      console.log(error);
    }
  },
  async mounted() {
    this.addModel({ key: this.formConf.formRef });
    let drawingListInDB = getDrawingList();
    const { projectTag, resourceUrl } = this.$route.query;
    const sessionProjectTag = sessionStorage.getItem('projectTag');
    const sessionresourceUrl = sessionStorage.getItem('resourceUrl');
    if (
      !drawingListInDB ||
      sessionProjectTag !== projectTag ||
      sessionresourceUrl !== resourceUrl
    ) {
      await this.initPage();
    }
    drawingListInDB = getDrawingList();
    const idGlobal = getIdGlobal();
    this.idGlobal = idGlobal;

    const formConfInDB = getFormConf();
    this.name = getFormName();
    if (Array.isArray(drawingListInDB) && drawingListInDB.length > 0) {
      this.drawingList = drawingListInDB;
    }
    if (formConfInDB) {
      this.formConf = formConfInDB;
    }
    loadBeautifier((btf) => {
      beautifier = btf;
    });
    const clipboard = new ClipboardJS('#copyNode', {
      text: (trigger) => {
        const codeStr = this.generateCode();
        this.$notify({
          title: '成功',
          message: '代码已复制到剪切板，可粘贴。',
          type: 'success'
        });
        return codeStr;
      }
    });
    clipboard.on('error', (e) => {
      this.$message.error('代码复制失败');
    });
    this.handleDrawingList(this.drawingList);
    const isProduction = process.env.NODE_ENV === 'production';
    if (isProduction) {
      window.onbeforeunload = (e) => this.handleBeforeunload(e);
    }

    if (this.resourceId && Array.isArray(drawingListInDB) && drawingListInDB.length === 0) {
      this.initDialogVisible = true;
    }
    window.sessionStorage.setItem('md5Components', '');
    window.sessionStorage.setItem('md5Page', '');
    // 执行自定义mounted钩子函数
    if (this.formConf.mountedCode) {
      this.customFunction({
        code: this.formConf.mountedCode
      });
    }
    this.$nextTick(() => {
      // 注册服务
      this.initServe({
        formConf: this.formConf
      });
    });
  },
  beforeDestroy() {
    clearInterval(this.timer);
    clearInterval(this.timerOneHour);
  },
  destroyed() {
    window.onbeforeunload = null;
  },
  provide() {
    return {
      addItem: this.addItem,
      cloneComponent: this.cloneComponent,
      activeData: () => this.activeData,
      formConf: () => this.formConf,
      drawingList: () => this.drawingList,
      deleteItem: this.drawingItemDelete,
      state: this.state,
      monacoObj: this.monaco,
      customFunction: this.customFunction
    };
  },
  beforeRouteLeave(to, from, next) {
    // 离开前提醒保存
    if (this.resourceId && this.drawingList.length && !this.isSave) {
      this.$confirm('是否保存当前编辑后离开当前页面？', '警告', {
        confirmButtonText: '保存并离开',
        cancelButtonText: '直接离开',
        type: 'info'
      })
        .then(() => {
          const formConfClone = deepClone(this.formConf);
          delete formConfClone.fields
          const data = {
            projectTag: this.$route.query.projectTag,
            resourceUrl: this.$route.query.resourceUrl,
            resourceContent: JSON.stringify(this.drawingList),
            formConf: JSON.stringify(formConfClone),
          };
          pageUpdate(data).then((res) => {
            if (res.code === 0) {
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              this.isSave = true;
              next();
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              });
            }
          });
        })
        .catch(() => {
          next();
        });
    } else {
      next();
    }
  },
  methods: {
    ...mapMutations(['addModel', 'clearModel', 'changeModel', 'deleteModel', 'changeState']),
    ...mapActions(['initServe', 'changeServe']),
    async initPage() {
      const { projectTag, resourceUrl } = this.$route.query;
      if (projectTag && resourceUrl) {
        try {
          const res = await getPageInfo(projectTag, resourceUrl);
          const data = res?.data?.pageInfoList?.[0];
          this.pageCallBack(res, data);
        } catch (error) {
          console.log(error);
        }
      }
      sessionStorage.setItem('projectTag', projectTag);
      sessionStorage.setItem('resourceUrl', resourceUrl);
    },
    pageCallBack(res, data) {
      if (res.code === 0 && data && data.pageConfig && data.components) {
        this.saveJson(JSON.parse(data.pageConfig), JSON.parse(data.components));
      }
    },
    saveJson(conf, fields) {
      const formConfClone = deepClone(conf);
      delete formConfClone.edit;
      // 保存conf
      saveFormConf(Object.assign({}, formConf, formConfClone));
      const fieldsClone = deepClone(fields);
      fieldsClone.length &&
        fieldsClone.forEach((item, index) => {
          let baseSchema = this.getComSchema(item);
          baseSchema = deepClone(baseSchema);
          // 有些属性不需要默认merge 所以需要删除掉
          const newSchema = mergeWith(baseSchema, item, ($1, $2) => {
            if (isArray($1) && isArray($2)) {
              return $2;
            }
          });
          fieldsClone[index] = newSchema;
          this.mergeSchema(item);
        });

      const max = this.getTreeMaxFormId(fieldsClone);
      saveIdGlobal(max + 1);
      saveDrawingList(fieldsClone);
    },
    getTreeMaxFormId(arr = [], formIdArr = []) {
      let max = 100,
        childMax = 100,
        headerMax = 100;
      arr.forEach((node) => {
        while (formIdArr.includes(node.__config__.formId)) {
          node.__config__.formId = node.__config__.formId + parseInt(Math.random() * 100 + 100, 10);
        }
        formIdArr.push(node.__config__.formId);

        if (node.__config__.children) {
          childMax = this.getTreeMaxFormId(node.__config__.children, formIdArr);
        }
        if (node.__config__.header) {
          headerMax = this.getTreeMaxFormId(node.__config__.header, formIdArr);
        }
        max = Math.max(node.__config__.formId || 0, childMax, headerMax, max);
      });
      return max;
    },
    mergeSchema(node) {
      if (node.__config__.children && node.__config__.children.length > 0) {
        node.__config__.children.forEach((item, index) => {
          let baseSchema = this.getComSchema(item);
          // const newSchema = merge({}, baseSchema, item);
          baseSchema = deepClone(baseSchema);
          const newSchema = mergeWith(baseSchema, item, ($1, $2) => {
            if (isArray($1) && isArray($2)) {
              return $2;
            }
          });
          node.__config__.children[index] = newSchema;
          this.mergeSchema(item);
        });
      }
    },
    getCopyList(data) {
      this.drawingList = this.drawingList.concat(data);
    },
    getNewCode(data) {
      this.resetCode(data);
    },
    resetCode(data) {
      this.drawingList.forEach((item) => {
        if (item.id == data.id) {
          if (data.actionType) {
            item.__config__.action.forEach((actionItem) => {
              if (actionItem.actionType == data.actionType) {
                if (data.actionType == 'custom')
                  actionItem.paramCode.jsCode = data?.value?.javascript;
                if (data.actionType == 'ajax' || data.actionType == 'form') {
                  if (data.funcType == 'useCode') {
                    actionItem.optionSlotCode.jsCode = data?.value?.javascript;
                  }
                  if (data.funcType == 'useCBCode') {
                    actionItem.paramCode.jsCode = data?.value?.javascript;
                  }
                }
              }
            });
          } else {
            if (data.funcType == 'useCodeFilter') {
              item.__config__.optionSlotCode.jsCode = data?.value?.javascript;
            }
            if (data.funcType == 'useParamCode') {
              item.__config__.paramCode.jsCode = data?.value?.javascript;
            }
          }
          if (item.__children__) {
            this.resetCode(item.__children__);
          }
        }
      });
    },
    handleBeforeunload(e) {
      if (this.resourceId && this.drawingList.length && !this.isSave) {
        e = e || window.event;
        // 兼容IE8和Firefox 4之前的版本
        if (e) {
          e.returnValue = '关闭提示';
        }
        // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
        return '关闭提示';
      } else {
        window.onbeforeunload = null;
      }
    },
    handleDrawingList(arr, parentItem) {
      const tableArr = arr.filter((item) => item.__config__.tag === 'el-table');
      const bindArr = arr.filter((item) => item.__config__.tag === 'el-filter');
      arr.forEach((item) => {
        // 添加模型
        if (item.formRef) {
          this.addModel({ key: item.formRef });
        }
        // 修改模型
        if (item.__vModel__) {
          const { defaultValue } = item.__config__;
          const parentRef = parentItem?.formRef || '';
          if (parentRef) {
            this.changeModel({
              key: parentRef,
              __vModel__: item.__vModel__,
              value: defaultValue
            });
          } else {
            this.changeModel({
              key: this.formConf.formRef,
              __vModel__: item.__vModel__,
              value: defaultValue
            });
          }
        }
        const children = item.__config__.children;
        if (children && children.length) {
          const { tableArr: childTableArr, bindArr: childBindArr } = this.handleDrawingList(
            children,
            item
          );
          tableArr.push(...childTableArr);
          bindArr.push(...childBindArr);
        }
      });
      return {
        tableArr,
        bindArr
      };
    },
    activeFormItem(currentItem) {
      if (currentItem) {
        this.activeData = currentItem;
        this.activeId = currentItem.__config__.formId;
      } else {
        this.activeData = {};
        this.activeId = '';
      }
    },
    onEnd(obj) {
      if (obj.from !== obj.to) {
        this.activeData = tempActiveData;
        this.activeId = this.idGlobal;
      }
    },
    addComponent(item) {
      const clone = this.cloneComponent(item);
      if (!clone) {
        return;
      }
      const { children, tag } = this.activeData?.__config__ || {};
      if (
        (item.__config__.tag !== 'el-table' || tag !== 'el-filter') &&
        allowPutChild.includes(tag) &&
        children
      ) {
        children.push(clone);
      } else {
        this.drawingList.push(clone);
        this.activeFormItem(clone);
      }
    },
    cloneComponent(origin) {
      const clone = deepClone(origin);
      const config = clone.__config__;
      delete config.def;
      delete clone.edit;
      // config.span = this.formConf.span // 生成代码时，会根据span做精简判断
      this.createIdAndKey(clone);
      clone.placeholder !== undefined && (clone.placeholder += config.label);
      tempActiveData = clone;
      return tempActiveData;
    },
    createIdAndKey(item) {
      const config = item.__config__;
      config.formId = ++this.idGlobal;
      config.renderKey = `${config.formId}${+new Date()}`; // 改变renderKey后可以实现强制更新组件
      // 注：componentName仅为大纲树显示用
      if (config.layout === 'colFormItem') {
        item.__vModel__ = `field${this.idGlobal}`;
      } else if (config.layout === 'rowFormItem') {
        config.componentName = `row${this.idGlobal}`;
        !Array.isArray(config.children) && (config.children = []);
        // delete config.label; // rowFormItem无需配置label属性
      } else if (config.layout === 'tableRowItem') {
        item.formRef = `elFilter${this.idGlobal}`;
        !Array.isArray(config.children) && (config.children = []);
        delete config.label; // rowFormItem无需配置label属性
      } else if (config.layout === 'colTableItem') {
        item.__vModel__ = `table${this.idGlobal}`;
      } else if (config.layout === 'elForm') {
        item.formRef = `elForm${this.idGlobal}`;
      } else {
        config.componentName = `myVar${this.idGlobal}`;
      }
      if (Array.isArray(config.children)) {
        config.children = config.children.map((childItem) => this.createIdAndKey(childItem));
      }
      return item;
    },
    empty() {
      this.clearModel();
      this.$confirm('确定要清空所有组件吗？', '提示', { type: 'warning' }).then(() => {
        this.drawingList = [];
        this.idGlobal = 100;
      });
    },
    drawingItemCopy(item, list) {
      let clone = deepClone(item);
      clone = this.createIdAndKey(clone);
      list.push(clone);
      this.activeFormItem(clone);
    },
    addItem(item, list) {
      list.push(item);
      this.activeFormItem(item);
    },
    drawingItemDelete(index, list) {
      list.splice(index, 1);
      this.$nextTick(() => {
        const len = this.drawingList.length;

        if (len) {
          this.activeFormItem(this.drawingList[len - 1]);
        }
      });
    },
    //手动保存
    update(flag) {
      if (!this.checkSameKey()) {
        this.$alert('表单组件中，同级有绑定相同【字段名】的组件，请检查更改', '字段名称相同', {
          confirmButtonText: '确定'
        });
        return;
      }
      const formConfClone = deepClone(this.formConf);
      delete formConfClone.fields
      const data = {
        projectTag: this.$route.query.projectTag,
        resourceUrl: this.$route.query.resourceUrl,
        resourceContent: JSON.stringify(this.drawingList),
        formConf: JSON.stringify(formConfClone),
      };
      pageUpdate(data).then((res) => {
        if (res.code === 0) {
          this.$message({
            message: '保存成功',
            type: 'success'
          });
          this.isSave = true;
          if (flag) {
            let newQuery = JSON.parse(JSON.stringify(this.$route.query));
            delete newQuery.versionId;
            this.$router.replace({
              path: '/runtime',
              query: newQuery
            });
          }
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          });
        }
      });
    },
    handleList() {
      this.$router.push({
        name: 'list'
      });
    },
    handleComponents() {
      this.showComponents = true;
      this.showTree = false;
      this.showData = false;
    },
    handleTree() {
      this.showTree = true;
      this.showComponents = false;
      this.showData = false;
    },
    handleData() {
      this.showData = true;
      this.showComponents = false;
      this.showTree = false;
    },
    handleJS() {
      this.showJS = true;
    },
    handleMountedCode({ code, visiable }) {
      if (code) {
        this.$set(this.formConf, 'mountedCode', {
          jsCode: code.javascript,
          htmlCode: code.html,
          cssCode: code.css,
          jsonCode: code.json
        });
      }
      this.showJS = visiable;
    },
    checkSameKey() {
      let flag = true;
      function _(data) {
        let count = 0;
        let set = new Set();
        for (const item of data || []) {
          if (item?.__vModel__) {
            count++;
            set.add(item?.__vModel__);
            if (count !== set.size) {
              flag = false;
              return;
            }
          }
          if (item.__children__) {
            _(item.__children__);
          }
        }
      }
      _(this?.drawingList);
      return flag;
    },
    customFunction({ code, otherContent = {}, type = 'call' }) {
      // type  call立即执行函数，  bind返回一个自定义函数，手动执行
      const { content, params } = parseFunction(code?.jsCode);
      let paramsArr = [];
      if (params) {
        paramsArr = params.replace(' ', '').split(',');
      }
      try {
        return new Function(...paramsArr, content)[type]({
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
    handleSchema() {
      this.showSchema = true;
    },
    handleSchemaAction({ code, visiable }) {
      try {
        if (code.json) {
          this.drawingList = JSON.parse(code.json);
          this.saveDrawingListDebounce(JSON.parse(code.json));
          this.updateThrottle(true);
        }
      } catch (error) {
        console.log(error);
        this.$message({
          message: '修改失败',
          type: 'error'
        });
      }
      this.showSchema = visiable;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/home';

.edit {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.header-drawing-board {
  min-height: 250px;
}

.header {
  display: flex;
  height: 42px;
  border-bottom: 1px solid #f1e8e8;
  box-sizing: border-box;
  justify-content: space-between;
}

.body {
  display: flex;
  justify-content: space-between;
}

.left-area {
  width: 48px;
  border-right: solid 1px rgb(241, 232, 232);

  &:first-child {
    padding-top: 5px;
  }
}

.left-tab {
  width: 48px;
  height: 60px;

  div {
    text-align: center;
    font-size: 11px;
    color: #777;
  }
}

.icon-class {
  width: 20px !important;
  height: 20px !important;
  margin-top: 14px;
  margin-left: 14px;
}

.el-table {
  width: 100%;

  .el-table__header-wrapper table,
  .el-table__body-wrapper table {
    width: 100% !important;
  }

  .el-table__body,
  .el-table__footer,
  .el-table__header {
    table-layout: auto;
  }
}

.el-scrollbar {
  height: 100%;
}

.tipIcon {
  position: absolute;
  top: -4px;
  left: 6px;
  color: rgb(243, 166, 66);
  cursor: pointer;
}

.right-board {
  .v-modal {
    width: calc(100vw - 669px);
    left: 309px;
  }
}
</style>
