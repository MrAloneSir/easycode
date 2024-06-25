<template>
  <div class="wrap">
    <div class="menu">
      <el-menu :default-active="defaultActive" @select="handleSelect">
        <el-menu-item v-for="item in menus" :index="item.resourceUrl" :key="item.resourceUrl">
          <template #title>
            <div class="flex items-center justify-between">
              <span>
                <el-tooltip v-if="judgeStrLength(item)" effect="dark" :content="item.resourceName" placement="top-end">
                  <span>{{ item.resourceName }}</span>
                </el-tooltip>
                <span v-else>{{ item.resourceName }}</span>
              </span>
              <div v-if="defaultActive === item.resourceUrl" class="flex items-center">
                <div class="w-10 h-10 flex items-center justify-end" @click.stop="editPage">
                  <i class="el-icon-edit-outline"></i>
                </div>
              </div>
            </div>
          </template>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="add">
      <el-button icon="el-icon-setting" @click="showEnvDialog = true">域名</el-button>
      <el-button icon="el-icon-plus" style="margin-left: 10px" @click="addPage">页面</el-button>
    </div>
    <env-dialog v-if="showEnvDialog" :visible.sync="showEnvDialog"></env-dialog>
    <add-page-dialog v-if="addPageDialog" :visible.sync="addPageDialog" @addSuccess="getMenuData"></add-page-dialog>
  </div>
</template>

<script>
import { getPageList, onlinePage } from '@/api/user';
import EnvDialog from './EnvDialog.vue';
import addPageDialog from './AddPageDialog';
import { formConf } from '@/config/config.js';
import { EventBus } from '../../../EventBus'
import { isOnlineBranch } from '@/utils/index.js';
import { delPage } from '../../../api/user';


export default {
  components: {
    'env-dialog': EnvDialog,
    'add-page-dialog': addPageDialog
  },
  data() {
    return {
      menus: [],
      backupmenus: [],
      defaultActive: '',
      showEnvDialog: false,
      addPageDialog: false,
      isOnlineBranch: isOnlineBranch(),
      formConf: {
        fields: [],
        ...formConf
      },
    };
  },
  mounted() {
    this.getMenuData();
  },
  methods: {
    async getMenuData() {
      const projectTag = this.$route.query.projectTag
      let resourceUrl = this.$route.query.resourceUrl
      const result = await getPageList({
        projectTag
      })
      if (result.code === 0) {
        this.menus = result.data
        if (this.menus.length) {
          if (!resourceUrl) {
            resourceUrl = this.menus[0].resourceUrl
          }
          this.defaultActive = resourceUrl
          this.$router.replace({
            name: 'runtime',
            query: {
              projectTag,
              resourceUrl
            }
          })
        }
      }
    },
    addPage() {
      this.addPageDialog = true;
    },
    judgeStrLength(item) {
      let flag = false;
      //中文且长度大于6则tooltip提示
      if (/^[\u4e00-\u9fa5]*$/.test(item.resourceName)) {
        if (item.resourceName.length > 6) {
          flag = true;
        }
      }
      return flag;
    },
    async deletePage() {
      try {
        await this.$confirm('确定是否删除', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });
        const projectTag = this.$route.query.projectTag
        const resourceUrl = this.$route.query.resourceUrl
        const result = await delPage({
          projectTag,
          resourceUrl,
        })
        if (result.code === 0) {
          this.$message.success('删除成功!')
          window.location.reload()
        }
      } catch (error) {

      }
    },
    handleSelect(key) {
      const projectTag = this.$route.query.projectTag
      this.defaultActive = key
      this.$router.replace({
        name: 'runtime',
        query: {
          projectTag,
          resourceUrl: key

        }
      })
    },
    // 编辑页面
    editPage() {
      EventBus.$emit('editPage')
    }
  }
};
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  width: 0;
}

.wrap {
  height: 100%;
}

.add {
  position: fixed;
  bottom: 10px;
  left: 10px;
  height: 60px;
  width: 250px;
  display: flex;
  align-items: center;
  padding-left: 10px;
  border-top: 1px solid #f0f0f0;
  background-color: white;
}

.menu {
  height: calc(100vh - 80px);
  width: 250px;
  overflow-y: scroll;
}

.el-menu {
  border-right: none;
}
</style>
