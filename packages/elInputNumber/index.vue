<script>
import { rulesRender } from '../utils/utils';
export default {
  props: ['currentItem', 'layout', 'index', 'groupVModel'],
  computed: {
    realRules: function () {
      return rulesRender(this.currentItem?.__config__?.rules?.filter((item) => item.checked));
    }
  },
  render() {
    const { __vModel__, __config__: config } = this.currentItem;
    let labelWidth = config.labelWidth ? `${config.labelWidth}px` : null;
    if (config.showLabel === false) labelWidth = '0';
    let {
      'controls-position': controlsPosition,
      step,
      max,
      min,
      'step-strictly': stepStrictly,
      precision,
      disabled,
      readonly,
      controls,
      style
    } = this.currentItem;
    max = max ? max : Infinity;
    min = min || min === 0 ? min : -Infinity;
    const prop = this.groupVModel ? `${this.groupVModel}.${this.index}.${__vModel__}` : __vModel__;

    return (
      <el-form-item
        style={config.style}
        label-width={labelWidth}
        label={config.showLabel ? config.label : ''}
        prop={prop}
        rules={this.realRules}
      >
        <el-input-number
          v-model={config.defaultValue}
          controls-position={controlsPosition}
          step={Number(step)}
          max={Number(max)}
          min={Number(min)}
          step-strictly={stepStrictly}
          precision={Number(precision)}
          disabled={disabled || readonly}
          controls={controls}
          style={style}
        />
        {config.desc && <span class="label-span" style={config.descStyle}>{config.desc}</span>}
      </el-form-item>
    );
  }
};
</script>
