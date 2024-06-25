<template>
  <div class="home-page">
    <el-button type="primary" class="add" @click="handleAdd">新增项目</el-button>
    <AddProjectDialog v-if="showAddDialog" :visible.sync="showAddDialog" :type="type" :editData="editData"
      @success="getProjects" />
    <h3 class="slogon">Easy Code，为了更极致的效率</h3>
    <div class="services">
      <div class="service" v-for="item in projects" :key="item.projectTag"
        @click="gotoSubApp(item.projectTag)">
        <h4 class="heading">{{ item.projectName }}</h4>
        <p class="description">
          {{ item.projectDesc }}
        </p>
        <!-- <elButton icon="el-icon-edit" class="edit" size="mini" @click.stop="handleEdit(item)">编辑</elButton>
        <elButton icon="el-icon-delete" class="del" size="mini" @click.stop="handleDel(item)">删除</elButton> -->
      </div>
    </div>
  </div>
</template>

<script>
import { getProjectList, deleteProject } from '@/api/user';
import AddProjectDialog from './components/AddProjectDialog'
export default {
  components: {
    AddProjectDialog
  },
  data() {
    return {
      projects: [],
      showAddDialog: false,
      type: 'add',
      editData: {}
    };
  },
  mounted() {
    this.getProjects()
  },
  methods: {
    async getProjects() {
      const result = await getProjectList();
      if (result.code === 0) {
        this.projects = result.data
      }
    },
    gotoSubApp(projectTag) {
      this.$router.push({
        name: 'runtime',
        query: {
          projectTag,
        }
      });
    },
    handleAdd() {
      this.showAddDialog = true
      this.type = 'add'
    },
    handleEdit(item) {
      this.type = 'edit'
      this.editData = item || {}
      this.showAddDialog = true
    },
    async handleDel(item) {
      const result = await deleteProject({
        projectTag: item.projectTag
      })
      if (result.code === 0) {
        this.getProjects()
        this.$message({
          message: '删除成功',
          type: 'success'
        })
      }
    }
  }
};
</script>

<style lang="scss" scoped>
$--color-dark: rgba(28, 36, 65, 0.93);

.home-page {
  background: url('../../assets/home-bg@2x.jpg') center bottom no-repeat #1a4d84;
  background-size: cover;
  position: relative;

  display: grid;
  grid-template-rows: auto 1fr auto;
  justify-content: center;
  height: 100vh;
  overflow-y: scroll;

  .add {
    position: absolute;
    width: 100px;
    height: 30px;
    top: 20px;
    right: 20px;
  }

  .slogon {
    color: #fff;
    font-size: 50px;
    font-weight: normal;
    margin: 90px 0 44px 0;
    text-align: center;
  }

  .services {
    width: 932px;
  }

  .service {
    background: url('../../assets/blind-bg.png') right top no-repeat #fff;
    background-size: cover;
    cursor: pointer;
    float: left;
    width: 221px;
    height: 144px;
    margin: 0 15px 16px 0;
    padding: 32px 40px;
    position: relative;
    top: 0;
    text-align: left;
    border-radius: 4px;
    box-shadow: 0px 2px 10px 0px rgba(26, 79, 207, 0.1);
    transition: all 300ms;
    box-sizing: border-box;

    &:nth-child(4n) {
      margin-right: 0;
    }

    &:hover {
      // transform: translateY(-10px);
      top: -10px;
    }

    .heading {
      margin-top: 20px;
      font-size: 16px;
      line-height: 19px;
      color: #3a3a60;
    }

    .description {
      margin-top: 8px;
      font-size: 13px;
      color: rgba(13, 22, 60, 0.65);
      line-height: 18px;

      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      padding-left: 8px;
      word-break: break-all;
      position: relative;

      &::before {
        content: '';
        display: block;
        width: 4px;
        height: 4px;
        border-radius: 2px;
        background: linear-gradient(180deg, #5eb2ff 0%, #307afe 100%);
        position: absolute;
        left: 0;
        top: 7px;
      }
    }
  }

  .home-footer {
    padding: 12px 0;
    color: #b1b5c1;
    font-size: 10px;
    text-align: center;
  }
}

// 注：一行5个是用这个类名
.home-page-thin {
  .service {
    width: 172px;
    height: 144px;
    padding: 28px 16px 28px 20px;

    &:nth-child(4n) {
      margin-right: 16px;
    }

    &:nth-child(5n) {
      margin-right: 0;
    }

    .heading {
      font-size: 16px;
    }
  }
}

.test {
  cursor: pointer;
  position: relative;
  background: rgba(255, 255, 255, 0.6);
  color: #fff;
  position: absolute;
  left: 50px;
  top: 150px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.4);
    transition: all 500ms;
  }
}

.test:after,
.test:before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 140px;
  height: 140px;
  margin: -70px 0 0 -70px;
  border-radius: 50%;
  opacity: 0;
  border: 3px solid hsla(0, 0%, 100%, 0.5);
  pointer-events: none;
  box-shadow: 0 0 100px 34px hsla(0, 0%, 100%, 0.1);
}

.test.test--active:after {
  animation-name: anim-effect-milan-3, anim-effect-milan-1;
  animation-duration: 5s, 2s;
  animation-iteration-count: 1, infinite;
  animation-timing-function: ease, linear;
  animation-fill-mode: forwards;
}

.test.test--active:before {
  animation-name: anim-effect-milan-3, anim-effect-milan-2;
  animation-duration: 5s, 2s;
  animation-iteration-count: 1, infinite;
  animation-timing-function: ease, linear;
  animation-fill-mode: forwards;
}

@-webkit-keyframes anim-effect-milan-1 {
  0% {
    transform: perspective(1000px) rotate3d(1, 1, 1, 0deg);
  }

  to {
    transform: perspective(1000px) rotate3d(1, 1, 1, 1turn);
  }
}

@keyframes anim-effect-milan-1 {
  0% {
    transform: perspective(1000px) rotate3d(1, 1, 1, 0deg);
  }

  to {
    transform: perspective(1000px) rotate3d(1, 1, 1, 1turn);
  }
}

@-webkit-keyframes anim-effect-milan-2 {
  0% {
    transform: perspective(1000px) rotate3d(1, -1, 1, 0deg);
  }

  to {
    transform: perspective(1000px) rotate3d(1, -1, 1, 1turn);
  }
}

@keyframes anim-effect-milan-2 {
  0% {
    transform: perspective(1000px) rotate3d(1, -1, 1, 0deg);
  }

  to {
    transform: perspective(1000px) rotate3d(1, -1, 1, 1turn);
  }
}

@-webkit-keyframes anim-effect-milan-3 {

  0%,
  to {
    opacity: 1;
  }

  25%,
  75% {
    opacity: 1;
  }
}

@keyframes anim-effect-milan-3 {

  0%,
  to {
    opacity: 1;
  }

  25%,
  75% {
    opacity: 1;
  }
}

.edit {
  position: absolute;
  right: 85px;
  top: 5px;
}

.del {
  position: absolute;
  right: 5px;
  top: 5px;
}
</style>
