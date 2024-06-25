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
    const config = this.currentItem.__config__;
    const { __vModel__ } = this.currentItem;
    let labelWidth = config.labelWidth ? `${config.labelWidth}px` : null;
    if (config.showLabel === false) labelWidth = '0';
    const prop = this.groupVModel ? `${this.groupVModel}.${this.index}.${__vModel__}` : __vModel__;
    return (
      <el-form-item
        style={config.style}
        label-width={labelWidth}
        label={config.showLabel ? config.label : ''}
        prop={prop}
        rules={this.realRules}
      >
        <elSwitch
          v-model={config.defaultValue}
          onInput={(event) => {
            this.$set(config, 'defaultValue', event);
          }}
        ></elSwitch>
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
