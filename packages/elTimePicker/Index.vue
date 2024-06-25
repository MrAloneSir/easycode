<script>
import { rulesRender } from '../utils/utils';

export default {
  props: ['currentItem', 'layout', 'index', 'groupVModel'],
  inject: ['customFunction'],
  computed: {
    realRules: function() {
      return rulesRender(this.currentItem?.__config__?.rules?.filter((item) => item.checked));
    }
  },
  watch: {
    'currentItem.__config__.useCodeFilter': function() {
      this.changeDefaultValue();
    },
    'currentItem.__config__.optionSlotCode': function() {
      this.changeDefaultValue();
    }
  },
  mounted() {
    this.changeDefaultValue();
  },
  methods: {
    changeDefaultValue() {
      const config = this.currentItem.__config__;
      const { useCodeFilter, optionSlotCode } = config;
      if (useCodeFilter) {
        config.defaultValue =
          this.customFunction({
            code: optionSlotCode
          }) || {};
      }
    }
  },
  render() {
    const schema = this.currentItem;
    const { __vModel__ } = this.currentItem;
    const config = schema.__config__;
    let labelWidth = config.labelWidth ? `${config.labelWidth}px` : null;
    if (config.showLabel === false) labelWidth = '0';
    const { disabled, clearable, placeholder } = schema;
    const width = schema.style && schema.style.width ? schema.style.width : '100%';
    const { 'value-format': valueFormat, format } = schema;
    const prop = this.groupVModel ? `${this.groupVModel}.${this.index}.${__vModel__}` : __vModel__;

    return (
      <el-form-item
        style={config.style}
        label-width={labelWidth}
        label={config.showLabel ? config.label : ''}
        prop={prop}
        rules={this.realRules}
      >
        <el-time-picker
          v-model={config.defaultValue}
          class="mr10"
          size="mini"
          disabled={disabled}
          clearable={clearable}
          placeholder={placeholder}
          format={format}
          value-format={valueFormat}
          style={{ width: width }}
          picker-options={{
            selectableRange: config.selectableRange
          }}
        ></el-time-picker>
        <span class="label-span" style={config.descStyle}>
          {config.desc}
        </span>
      </el-form-item>
    );
  }
};
</script>
