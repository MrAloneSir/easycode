<template>
  <el-main class="detail-container">
    <div v-if="isLowcodeEdit">
      <div class="flex justify-end">
        <el-button @click="showImportJson = true">导入页面配置</el-button>
        <el-button @click="copyJson">复制页面配置</el-button>
        <el-button @click="copyRoute">复制路由</el-button>
        <el-button type="primary" @click="handlePublish">发布</el-button>
      </div>
      <hr style="margin: 10px 0;" />
    </div>
    <parser :key="key" v-if="formConf && formConf.fields && formConf.fields.length" :form-conf="formConf" type="body"
      :state="state" />
    <import-json v-if="showImportJson" :visible.sync="showImportJson"></import-json>
  </el-main>
</template>

<script>
import Parser from './Parser';
import { getPageInfo, envDetail, onlinePage } from '@/api/user';
import { formConf } from '@/config/config.js';
import { mapMutations } from 'vuex';
import { saveDrawingList, saveIdGlobal, saveFormConf } from '@/utils/db';
import { deepClone } from '@/utils/index';
import { mapGetters } from 'vuex';
import { mergeWith, isArray } from 'lodash';
import { EventBus } from '../../../EventBus';
import ImportJson from './ImportJson.vue';

export default {
  components: {
    Parser,
    ImportJson,
  },
  data() {
    return {
      key: new Date().getTime(),
      isLowcodeEdit: window.SDK?.parentInfo?.isLowcodeEdit || window.location.href.includes('127.0.0.1'),
      formConf: {
        fields: [],
        ...formConf
      },
      state: {},
      showImportJson: false,
      runtimeEnv: window.SDK?.parentInfo?.env || 'feat',
    };
  },
  watch: {
    $route: {
      deep: true,
      async handler(to, from) {
        if (to.query.resourceUrl !== from.query.resourceUrl) {
          this.state = {};
          await this.init();
        }
      }
    },
    state: {
      handler: function (value) {
        this.changeState(value);
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters(['getComSchema']),
  },
  beforeCreate() {
    this.$store.dispatch('registerProjectLib');
  },
  async mounted() {
    EventBus.$on('editPage', this.editPage)
    await this.handleEnv()
    await this.init();
  },
  onMounted() {
    EventBus.$off('editPage')
  },
  methods: {
    ...mapMutations(['changeState']),
    async init() {
      const { projectTag, resourceUrl } = this.$route.query;
      if (projectTag && resourceUrl) {
        try {
          const res = await getPageInfo(projectTag, resourceUrl, this.runtimeEnv);
          const { code, data } = res
          if (code === 0 && data.formConf && data.resourceContent) {
            this.formConf = JSON.parse(data.formConf);
            this.formConf.fields = JSON.parse(data.resourceContent) || [];
          } else {
            this.formConf = {
              fields: [],
              ...formConf
            };
          }
          this.key = new Date().getTime();
        } catch (error) {
          console.log(error);
        }
      }
    },
    async handleEnv() {
      const res = await envDetail({
        projectTag: this.$route?.query?.projectTag
      })
      let { code, data } = res;
      if (code === 0) {
        if (data) {
          let api = {
            development: data.development,
            pre: data.pre,
            pro: data.pro,
            devtest: data.devtest
          };
          sessionStorage.setItem('envConfig', JSON.stringify(api));
        }
      } else {
        this.$message.error(res.msg);
      }
    },
    // 编辑页面
    editPage() {
      const { resourceUrl, projectTag } = this.$route.query;
      if (resourceUrl) {
        let oldQuery = this.$router.currentRoute.query;
        let newQuery = Object.assign({}, oldQuery, {
          projectTag,
          resourceUrl
        });
        this.saveJson();
        sessionStorage.setItem('projectTag', projectTag);
        sessionStorage.setItem('resourceUrl', resourceUrl);
        this.$router.push({
          path: '/edit',
          query: newQuery
        });
      }
    },
    saveJson() {
      const formConfClone = deepClone(this.formConf);
      // 保存conf
      saveFormConf(Object.assign({}, formConf, formConfClone));
      const fieldsClone = deepClone(this.formConf?.fields || []);
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
    async copyJson() {
      await navigator.clipboard.writeText(JSON.stringify(this.formConf));
      this.$message({
        type: 'success',
        message: '复制成功'
      })
    },
    async copyRoute() {
      await navigator.clipboard.writeText(this.$route.query.resourceUrl);
      this.$message({
        type: 'success',
        message: '复制成功'
      })
    },
    async handlePublish() {
      try {
        await this.$confirm('确定是否发布', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });
        const projectTag = this.$route.query.projectTag
        const resourceUrl = this.$route.query.resourceUrl
        const result = await onlinePage({
          projectTag,
          resourceUrl,
          env: this.runtimeEnv
        })
        if (result.code === 0) {
          this.$message.success(`发布${this.runtimeEnv}环境成功!`)
        }
      } catch (error) {
      }
    },
  }
};
</script>

<style scoped>
.detail-container {
  background-color: white;
  margin-left: 10px;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
