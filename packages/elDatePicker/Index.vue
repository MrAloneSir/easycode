<script>
export default {
  props: ['currentItem', 'layout', 'index', 'groupVModel'],
  inject: ['customFunction'],
  computed: {
    realRules: function() {
      return this.currentItem?.__config__?.rules
        ?.filter((item) => item.checked)
        .map((item) => {
          return { required: item.required, message: item.message, trigger: item.trigger };
        });
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
    const prop = this.groupVModel ? `${this.groupVModel}.${this.index}.${__vModel__}` : __vModel__;

    const {
      disabled,
      clearable,
      placeholder,
      readonly,
      format,
      'value-format': valueFormat
    } = schema;
    const width = schema.style && schema.style.width ? schema.style.width : '100%';

    return (
      <el-form-item
        style={config.style}
        label-width={labelWidth}
        label={config.showLabel ? config.label : ''}
        prop={prop}
        rules={this.realRules}
      >
        <el-date-picker
          v-model={config.defaultValue}
          class="mr10"
          type={schema.type}
          size="mini"
          disabled={disabled}
          clearable={clearable}
          placeholder={placeholder}
          readonly={readonly}
          format={format}
          value-format={valueFormat}
          style={{ width: width }}
        ></el-date-picker>
        <span class="label-span" style={config.descStyle}>
          {config.desc}
        </span>
      </el-form-item>
    );
  }
};
</script>
<style>
/** 在选择时间范围时，如果恰好把当前月份选择为起止日期，当前月的蓝色和选中的蓝色背景会导致文字不可见，
    因此需要过滤出此条件，将颜色设为白色以使显示正常
 */
.el-picker__popper.gp-date-range-picker .gp-month-table td.end-date.today .cell,
.el-picker__popper.gp-date-range-picker .gp-month-table td.start-date.today .cell {
  color: #fff;
}
</style>
