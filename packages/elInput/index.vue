<script>
import { rulesRender } from '../utils/utils';
export default {
  props: ['currentItem', 'layout', 'index', 'groupVModel'],
  computed: {
    realRules: function() {
      return rulesRender(this.currentItem?.__config__?.rules?.filter((item) => item.checked));
    }
  },
  render() {
    const {
      __vModel__,
      __config__: config,
      placeholder,
      style,
      clearable,
      'prefix-icon': prefixIcon,
      'suffix-icon': suffixIcon,
      maxlength,
      'show-word-limit': showWordLimit,
      'show-password': showPassword,
      disabled,
      readonly,
      type,
      autosize
    } = this.currentItem;
    let labelWidth = config.labelWidth ? `${config.labelWidth}px` : null;
    const { modelModifier = '' } = config;
    if (config.showLabel === false) labelWidth = '0';
    const prop = this.groupVModel ? `${this.groupVModel}.${this.index}.${__vModel__}` : __vModel__;
    if (modelModifier === 'number' && typeof config.defaultValue === 'string') {
      config.defaultValue = config.defaultValue?.replace(/[^0-9.]/g, '');
    }
    return (
      <el-form-item
        style={config.style}
        label-width={labelWidth}
        label={config.showLabel ? config.label : ''}
        prop={prop}
        rules={this.realRules}
      >
        {config.preDesc && (
          <span class="pre-label-span" style={config.preDescStyle}>
            {config.preDesc}
          </span>
        )}

        {modelModifier === '' && (
          <elInput
            v-model={config.defaultValue}
            placeholder={placeholder}
            style={style}
            clearable={clearable}
            prefix-icon={prefixIcon}
            suffix-icon={suffixIcon}
            maxlength={maxlength}
            show-word-limit={showWordLimit}
            show-password={showPassword}
            disabled={disabled}
            readonly={readonly}
            type={type}
            autosize={autosize}
          ></elInput>
        )}
        {modelModifier === 'lazy' && (
          <elInput
            v-model_lazy={config.defaultValue}
            placeholder={placeholder}
            style={style}
            clearable={clearable}
            prefix-icon={prefixIcon}
            suffix-icon={suffixIcon}
            maxlength={maxlength}
            show-word-limit={showWordLimit}
            show-password={showPassword}
            disabled={disabled}
            readonly={readonly}
            type={type}
            autosize={autosize}
          ></elInput>
        )}
        {modelModifier === 'number' && (
          <elInput
            v-model_number={config.defaultValue}
            placeholder={placeholder}
            style={style}
            clearable={clearable}
            prefix-icon={prefixIcon}
            suffix-icon={suffixIcon}
            maxlength={maxlength}
            show-word-limit={showWordLimit}
            show-password={showPassword}
            disabled={disabled}
            readonly={readonly}
            type={type}
            autosize={autosize}
          ></elInput>
        )}
        {modelModifier === 'trim' && (
          <elInput
            v-model_trim={config.defaultValue}
            placeholder={placeholder}
            style={style}
            clearable={clearable}
            prefix-icon={prefixIcon}
            suffix-icon={suffixIcon}
            maxlength={maxlength}
            show-word-limit={showWordLimit}
            show-password={showPassword}
            disabled={disabled}
            readonly={readonly}
            type={type}
            autosize={autosize}
          ></elInput>
        )}
        {config.desc && (
          <span class="label-span" style={config.descStyle}>
            {config.desc}
          </span>
        )}
      </el-form-item>
    );
  }
};
</script>
<style scoped>
.pre-label-span {
  margin: 0 8px;
}
</style>
