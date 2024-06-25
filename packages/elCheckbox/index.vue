<script>
// import NewRender from '../coms/render/render.vue';
import { rulesRender } from '../utils/utils';
import { mapGetters } from 'vuex';
import api from '../../src/api/request';
import { EventBus } from '../utils/event-bus';
export default {
  props: ['currentItem', 'layout', 'index', 'groupVModel'],
  inject: ['formConf', 'evalJS', 'customFunction'],
  data() {
    return {
      optionsList: []
    };
  },
  computed: {
    ...mapGetters(['getStoreValue']),
    realRules: function() {
      return rulesRender(this.currentItem?.__config__?.rules?.filter((item) => item.checked));
    },
    options: function() {
      const {
        dataType,
        dynamicLabel,
        dynamicValue,
        optionDataServerContent,
        optionDataServerInfo
      } = this.currentItem.__config__;
      let options = [];
      if (dataType === 'dynamic') {
        if (dynamicLabel && dynamicValue) {
          options = (this.optionsList || []).map((item) => {
            return {
              label: item?.[dynamicLabel],
              value: item?.[dynamicValue]
            };
          });
        } else {
          options = this.optionsList;
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
    const { __config__, disabled, __vModel__ } = this.currentItem;
    const { showLabel, labelWidth, label, checkAllShow, desc } = __config__;
    const prop = this.groupVModel ? `${this.groupVModel}.${this.index}.${__vModel__}` : __vModel__;
    const { defaultValue } = __config__;

    // 修改默认值类型
    if (defaultValue && this.options.length) {
      let option = this.options[0];
      if (Object.prototype.toString.call(option.value) === '[object Number]') {
        if (Array.isArray(defaultValue)) {
          for (let i = 0; i < defaultValue.length; i++) {
            const item = defaultValue[i];
            if (item) {
              let val = Number(item);
              defaultValue[i] = !isNaN(val) ? val : item;
            }
          }
          if (checkAllShow) {
            __config__.checkAll = defaultValue.length === this.options.length;
            __config__.indeterminate =
              defaultValue.length > 0 && defaultValue.length < this.options.length;
          }
        }
      }
    }
    return (
      <el-form-item
        style={__config__.style}
        label-width={showLabel && labelWidth ? `${labelWidth}px` : null}
        label={showLabel ? label : ''}
        prop={prop}
        rules={this.realRules}
      >
        {checkAllShow ? (
          <el-checkbox
            v-model={__config__.checkAll}
            indeterminate={__config__.indeterminate}
            onChange={(val) => {
              const defaultValue = val ? this.options.map((item) => item.value) : [];
              __config__.indeterminate = false;
              this.$set(__config__, 'defaultValue', defaultValue);
            }}
            disabled={disabled}
          >
            全选
          </el-checkbox>
        ) : null}
        {
          <el-checkbox-group
            v-model={__config__.defaultValue}
            onChange={(v) => {
              this.$set(__config__, 'defaultValue', v);
              __config__.indeterminate = v.length !== this.options.length;
              __config__.checkAll = v.length === this.options.length;

              this.$nextTick(() => {
                const { emitList } = __config__;
                for (const item of emitList || []) {
                  EventBus.$emit(item, v);
                }
              });
            }}
            disabled={disabled}
          >
            {this.options.map((item) => {
              return <el-checkbox label={item.value}>{item.label}</el-checkbox>;
            })}
          </el-checkbox-group>
        }
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
        this.currentItem.__config__.defaultValue = [];
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
      // 请求参数
      const {
        method,
        url,
        params,
        dataListInfo,
        host,
        dataType,
        useParamCode,
        useCodeFilter,
        paramCode,
        optionSlotCode,
        parentFormModel,
        contentType,
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
            this.optionsList = this.evalJS(dataListInfo, transformRes) || [];
          }
        });
      }
    }
  }
};
</script>
