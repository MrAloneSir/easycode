<script>
import { renderChildren } from '../utils/utils';
import { EventBus } from '../utils/event-bus';
import elFilter from '../coms/elFilter.vue';
import { resetForm } from '@/utils/index';
import { isString, isArray, isNumber, isBoolean } from '../utils/utils';

export default {
  components: {
    elFilter
  },
  props: ['currentItem', 'layout'],
  inject: ['getComps', 'customFunction'], // 递归子组件添加上复制删除，点击等功能
  mounted() {
    this.$nextTick(() => {
      this.search();
    });
  },
  render(h) {
    const { formRef, formModel, __config__: config } = this.currentItem;
    const { draggGroup, children, allowPagePut } = config;
    const finallyDraggGroup = allowPagePut ? 'componentsGroup' : draggGroup;
    let child = renderChildren(h, this.currentItem, this.getComps);
    if (this.layout === 'Parser') {
      return (
        <elFilter
          show-reset
          on={{
            reset: this.reset,
            search: this.search
          }}
          scopedSlots={{
            default: () => {
              return (
                <el-form
                  inline={true}
                  ref={formRef}
                  props={{
                    model: formModel
                  }}
                >
                  {child}
                </el-form>
              );
            }
          }}
        />
      );
    } else {
      return (
        <elFilter
          show-reset
          scopedSlots={{
            default: () => {
              return (
                <el-form
                  inline={true}
                  ref={formRef}
                  props={{
                    model: formModel
                  }}
                >
                  <draggable
                    list={children || []}
                    animation={340}
                    group={finallyDraggGroup}
                    class="drag-wrapper filter-wrapper"
                  >
                    {child}
                  </draggable>
                </el-form>
              );
            }
          }}
        />
      );
    }
  },
  methods: {
    search() {
      const config = this.currentItem.__config__;
      const { isFilterEmpty, emptyDefault, children, useCodeFilter } = config;
      let param = this.recursionGetParam(isFilterEmpty, emptyDefault, children);
      if (useCodeFilter) {
        const customFunc = this.customFunction({
          code: config.optionSlotCode,
          type: 'bind'
        });
        param = customFunc(param);
      }
      if (this.currentItem.tableVModel) {
        //  发起table刷新的通知
        EventBus.$emit(this.currentItem.tableVModel, param);
      }
    },
    reset() {
      const config = this.currentItem.__config__;
      let formName = [];
      formName.push(this.currentItem.formRef);
      resetForm(config.children, formName);
      if (this.currentItem.tableVModel) {
        //  发起table刷新的通知
        EventBus.$emit(this.currentItem.tableVModel, {});
      }
    },
    recursionGetParam(isFilterEmpty, emptyDefault, children) {
      let param = {};
      children &&
        children.forEach((component) => {
          const childConfig = component.__config__;
          const { defaultValue, separator, defaultValue1 } = childConfig;
          let resultValue = defaultValue;
          if (separator && Array.isArray(defaultValue)) {
            resultValue = defaultValue.join(separator);
          }
          if (
            isNumber(resultValue) ||
            isBoolean(resultValue) ||
            (isString(resultValue) && resultValue) ||
            (isArray(defaultValue) && defaultValue.length)
          ) {
            param[component.__vModel__] = resultValue;
          } else if (!isFilterEmpty) {
            param[component.__vModel__] = emptyDefault || '';
          }
          if (component.__vModel1__?.trim?.()) {
            param[component.__vModel1__] = defaultValue1;
          }
          if (childConfig.children) {
            const result = this.recursionGetParam(
              isFilterEmpty,
              emptyDefault,
              childConfig.children
            )[0];
            param = Object.assign({}, param, result);
          }
        });
      return param;
    }
  }
};
</script>
<style lang="scss" scoped>
.form-item-right {
  margin-top: 5px;
  float: right;
}

.el-form-item {
  margin-right: 35px;
  display: inline-flex !important;
}

.filter-wrapper {
  min-width: calc(100vw - 810px);
}

.drag-wrapper {
  min-height: 130px;
  padding-bottom: 30px;
  overflow: hidden;
}
</style>
