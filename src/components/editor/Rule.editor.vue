<template>
  <div>
    <el-collapse v-model="activeNames" accordion>
      <el-collapse-item title="校验" name="1">
        <div class="rule-item-extra" v-for="(ruleItem, index) in value" :key="index">
          <div class="title">{{ ruleItem.label }}</div>
          <div class="rule-item-controls">
            <div class="btn-control" @click="settingItem(ruleItem, index)">
              <i class="el-icon-s-tools"></i>
            </div>
            <el-checkbox style="margin-left: 10px" v-model="ruleItem.checked">启用</el-checkbox>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
    <rule-dialog
      v-if="showRule"
      :visible.sync="showRule"
      :rule-list="value"
      :rule="rule"
      :index="ruleIndex"
    ></rule-dialog>
  </div>
</template>
<script>
import RuleDialog from './coms/RuleDialog.vue';

export default {
  components: {
    RuleDialog
  },
  props: ['desc', 'value'],
  data() {
    return {
      showRule: false,
      ruleIndex: -1,
      activeNames: ['1'],
      rule: {}
    };
  },
  methods: {
    settingItem(ruleItem, index) {
      this.showRule = true;
      this.rule = ruleItem
      this.ruleIndex = index;
    }
  }
};
</script>

<style lang="scss" scoped>
.rule-item-extra {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .title {
    font-size: 14px;
    color: #333;
  }
  .rule-item-controls {
    display: flex;
    align-items: center;
  }
}
</style>