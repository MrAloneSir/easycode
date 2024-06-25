<script>
import { rulesRender } from '../utils/utils';
import api from '../../src/api/request';
import { mapGetters } from 'vuex';
import { EventBus } from '../utils/event-bus';

export default {
  props: ['currentItem', 'layout', 'index', 'groupVModel'],
  inject: ['evalJS', 'customFunction'],
  data() {
    return {
      dynamicOptions: []
    };
  },
  computed: {
    ...mapGetters(['getStoreValue']),
    realRules: function() {
      return rulesRender(this.currentItem?.__config__?.rules?.filter((item) => item.checked));
    },
    options: function() {
      const {
        dynamicLabel,
        dynamicValue,
        optionDataServerContent,
        optionDataServerInfo,
        dataType
      } = this.currentItem.__config__;
      let options = [];
      if (dataType === 'dynamic') {
        if (dynamicLabel && dynamicValue) {
          options = (this.dynamicOptions || []).map((item) => {
            return {
              label: item?.[dynamicLabel],
              value: item?.[dynamicValue]
            };
          });
        } else {
          options = this.dynamicOptions;
        }
      } else if (dataType === 'localDynamic') {
        let tmpOptions = this.getStoreValue(optionDataServerContent, optionDataServerInfo);
        if (dynamicLabel && dynamicValue) {
          options = (tmpOptions || []).map((item) => {
            return {
              label: item?.[dynamicLabel],
              value: item?.[dynamicValue]
            };
          });
        } else {
          options = tmpOptions;
        }
      } else {
        options = this.currentItem.__slot__.options;
      }
      return options || [];
    }
  },
  render() {
    const { __config__, border, disabled, __slot__, __vModel__, style } = this.currentItem;
    const prop = this.groupVModel ? `${this.groupVModel}.${this.index}.${__vModel__}` : __vModel__;
    //值类型转换
    if (__config__.defaultValue && this.options.length) {
      let option = this.options[0];
      if (Object.prototype.toString.call(option.value) === '[object Number]') {
        let val = Number(__config__.defaultValue);
        __config__.defaultValue = !isNaN(val) ? val : __config__.defaultValue;
      }
    }

    const { emitList, showLabel, labelWidth, label, type, desc } = __config__;
    return (
      <el-form-item
        style={__config__.style}
        label-width={showLabel && labelWidth ? `${labelWidth}px` : null}
        label={showLabel ? label : ''}
        prop={prop}
        rules={this.realRules}
      >
        <el-radio-group
          v-model={__config__.defaultValue}
          onChange={(val) => {
            this.$set(__config__, 'defaultValue', val);
            this.$nextTick(() => {
              for (const item of emitList || []) {
                EventBus.$emit(item, val);
              }
            });
          }}
          disabled={disabled}
        >
          {this.options.map((item) => {
            return type === 'Radio' ? (
              <el-radio border={border} label={item.value}>
                {item.label}
              </el-radio>
            ) : (
              <el-radio-button label={item.value}>{item.label}</el-radio-button>
            );
          })}
        </el-radio-group>

        {desc && (
          <span class="label-span" style={__config__.descStyle}>
            {desc}
          </span>
        )}
      </el-form-item>
    );
  },
  mounted() {
    // 动态数据
    if (this.currentItem.__config__.dataType === 'dynamic') {
      this.fetchData(this.currentItem);
    }
    EventBus.$on(this.currentItem.__vModel__, () => {
      // undefined也可以执行
      if (this.currentItem.__config__.onCallbackUpdateValue !== false) {
        this.currentItem.__config__.defaultValue = '';
      }
      if (this.currentItem.__config__.dataType === 'dynamic') {
        this.fetchData(this.currentItem);
      }
    });
  },
  beforeDestroy() {
    EventBus.$off(this.currentItem.__vModel__);
  },
  methods: {
    fetchData(currentItem) {
      const {
        method,
        url,
        params,
        dataListInfo,
        host,
        dataType,
        useParamCode,
        useCodeFilter,
        parentFormModel,
        optionSlotCode,
        paramCode,
        contentType
      } = currentItem.__config__;
      if (method && url && dataType === 'dynamic') {
        let data = {};
        // 获取参数
        params &&
          params.forEach((obj) => {
            let { label, value, content } = obj;
            data[label] = this.getStoreValue(content, value);
          });
        data.__url = url;
        data.__method = method;
        data.__host = host;
        data.__contentType = contentType;
        if (useParamCode) {
          const paramFunc = this.customFunction({
            code: paramCode,
            type: 'bind'
          });
          data = paramFunc(data, parentFormModel || {});
          if (!data) {
            return;
          }
        }
        api.post('/proxy/index', data).then((res) => {
          if (res.code === 0) {
            let transformRes = res;
            // 转换结果
            if (useCodeFilter) {
              const resultFunc = this.customFunction({
                code: optionSlotCode,
                type: 'bind'
              });
              transformRes = resultFunc(res, parentFormModel || {});
              if (!transformRes) {
                return;
              }
            }
            this.dynamicOptions = this.evalJS(dataListInfo, transformRes) || [];
          }
        });
      }
    }
  }
};
</script>
