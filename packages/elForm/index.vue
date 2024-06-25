<script>
import { renderChildren } from '../utils/utils';
import { mapMutations } from 'vuex';

export default {
  props: ['currentItem', 'layout'],
  inject: ['getComps'], // 递归子组件添加上复制删除，点击等功能
  render() {
    const currentItem = this.currentItem;
    const {
      formRef,
      formModel,
      size,
      labelPosition,
      labelWidth,
      disabledExpress,
      rules,
      __config__: config
    } = currentItem;
    // const config = currentItem.__config__;
    let child = renderChildren(h, this.currentItem, this.getComps);
    if (this.layout !== 'Parser') {
      child = (
        <draggable
          list={config.children || []}
          animation={340}
          group={config.draggGroup}
          class="drag-wrapper"
        >
          {child}
        </draggable>
      );
    }
    const disabled = this.$store.getters.storeEvalExpress(disabledExpress);
    return (
      <el-form
        nativeOnSubmit={(event) => event.preventDefault()}
        size={size}
        label-position={labelPosition}
        ref={formRef}
        label-width={`${labelWidth}px`}
        disabled={disabled}
        props={{
          model: formModel
        }}
        rules={rules}
        validate-on-rule-change={false}
      >
        {child}
      </el-form>
    );
  },
  computed: {
    validate: function() {
      return this.$refs[this.currentItem.formRef].validate;
    }
  },
  mounted() {
    this.currentItem.formModel = {};
    this.$nextTick(() => {
      this.setRef({
        key: this.currentItem.formRef,
        value: this.$refs[this.currentItem.formRef]
      });
    });
  },
  methods: {
    ...mapMutations(['setRef'])
  }
};
</script>

<style lang="scss" scoped>
.drag-wrapper {
  min-height: 130px;
  padding-bottom: 30px;
  overflow: hidden;
}
</style>
