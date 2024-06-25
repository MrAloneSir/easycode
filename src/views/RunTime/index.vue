<template>
  <el-container id="runtime">
    <!-- 导航 -->
    <el-aside width="250px">
      <Menu />
    </el-aside>
    <Detail />
  </el-container>
</template>

<script>
import Menu from './components/Menu.vue';
import Detail from './components/Detail.vue';

export default {
  name: 'App',
  components: {
    Menu,
    Detail
  },
};
</script>

<style scoped>
#runtime {
  display: flex;
  background-color: rgb(240, 240, 240);
  padding: 10px;
  box-sizing: border-box;
  /* 当表单过长时，#app无法完全容纳表单，导致背景色不能完全覆盖  */
  /* height: 100%; */
}

.el-header {
  background-color: white;
  color: #333;
  margin-left: 10px;
}

.el-aside {
  background-color: white;
  /* margin-right: 10px; */
}

.el-main {
  background-color: white;
  /* margin-left: 10px; */
  /* margin-top: 10px; */
}
</style>
