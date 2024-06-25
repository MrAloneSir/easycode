<script>
export default {
  props: ['currentItem', 'layout'],
  computed: {
    realRules: function () {
      return this.currentItem?.__config__?.rules?.filter((item) => item.checked);
    }
  },
  render() {
    const { __config__, __slot__, disabled, min, max, __vModel__ } = this.currentItem;
    const { type } = __config__;

    return (
      <el-form-item
        style={__config__.style}
        label-width={
          __config__.showLabel && __config__.labelWidth ? `${__config__.labelWidth}px` : null
        }
        label={__config__.showLabel ? __config__.label : ''}
        prop={__vModel__}
        rules={this.realRules}
      >
        <el-checkbox-group
          v-model={__config__.defaultValue}
          min={min}
          max={max || __slot__.options.length}
          disabled={disabled}
        >
          {__slot__.options.map((item) => {
            return type === 'Checkbox' ? (
              <el-checkbox label={item.value} disabled={disabled}>
                {item.label}
              </el-checkbox>
            ) : (
              <el-checkbox-button label={item.value} disabled={disabled}>
                {item.label}
              </el-checkbox-button>
            );
          })}
        </el-checkbox-group>

        {__config__.desc && <span class="label-span" style={__config__.descStyle}>{__config__.desc}</span>}
      </el-form-item>
    );
  }
};
</script>
