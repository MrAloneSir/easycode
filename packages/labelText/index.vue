<script>
import NewRender from '../coms/render/render.vue';
export default {
  components: {
    NewRender
  },
  props: ['currentItem', 'layout'],
  render() {
    const { __config__: config, style } = this.currentItem;
    const { dataSourceType, defaultValue, showLabel, isPre, label, required } = config;
    let labelWidth = config.labelWidth ? `${config.labelWidth}px` : null;
    if (showLabel === false) labelWidth = '0';
    if (dataSourceType != 'static') {
      this.currentItem.domProps.innerHTML = defaultValue;
    }
    if (isPre) {
      const innerHTML = JSON.stringify(this.currentItem.domProps.innerHTML, null, 2);
      return (
        <el-form-item
          style={config.style}
          label-width={labelWidth}
          label={showLabel ? label : ''}
          required={required}
        >
          <pre style={style}>{innerHTML}</pre>
        </el-form-item>
      );
    }
    return (
      <el-form-item
        style={config.style}
        label-width={labelWidth}
        label={showLabel ? label : ''}
        required={required}
      >
        <new-render conf={this.currentItem}></new-render>
      </el-form-item>
    );
  }
};
</script>
<style scoped>
pre{
  overflow: hidden;
  white-space: pre-wrap;
  line-height: 20px !important;
}
</style>
