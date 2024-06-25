<template>
  <div>
    <Editor
      v-for="(item, index) in edit" :key="index"
      :desc="item"
      :model="activeData"
    ></Editor>
  </div>
</template>

<script>
// import Editor from '../../../components/editor/index.vue';
import { mapGetters } from "vuex";


export default {
  components: {
    Editor: () => import(/* webpackChunkName: "editor" */'../../../components/editor/index.vue')
  },
  props: ['activeData', "type"],
  computed: {
    ...mapGetters(["getComEdit"]),
    edit: function() {
      if (this.type === 'page') {
        return this.activeData.edit
      }
      return this.getComEdit(this.activeData)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
