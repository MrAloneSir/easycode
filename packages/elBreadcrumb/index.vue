<template>
  <el-breadcrumb :separator="currentItem.separator" :separator-class="currentItem.separatorClass">
    <template v-for="item in currentItem.__config__.child">
      <el-breadcrumb-item v-if="layout === 'editor'">
        {{ item.name }}
      </el-breadcrumb-item>
      <el-breadcrumb-item v-else-if="item.type === 'to'" :to="item.href">
        {{ item.name }}
      </el-breadcrumb-item>
      <el-breadcrumb-item v-else :replace="item.href">
        {{ item.name }}
      </el-breadcrumb-item>
    </template>
  </el-breadcrumb>
</template>
<script>

export default {
  props: ['currentItem', 'layout']
};
</script>
