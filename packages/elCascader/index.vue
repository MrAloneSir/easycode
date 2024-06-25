<script>
import api from '../../src/api/request';
import { mapGetters } from 'vuex';
import { EventBus } from '../utils/event-bus';
import { rulesRender } from '../utils/utils';

export default {
  props: ['currentItem', 'layout', 'index', 'groupVModel'],
  inject: ['evalJS', 'customFunction'],
  data() {
    return {
      dynamicOptions: [],
      cascaderIdx: 0 // 处理多次渲染报错问题
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
        optionDataServerContent,
        optionDataServerInfo
      } = this.currentItem.__config__;
      this.cascaderIdx++;
      // 远程数据
      if (dataType === 'dynamic') {
        return this.dynamicOptions;
      } else if (dataType === 'localDynamic') {
        // 数据源
        return this.getStoreValue(optionDataServerContent, optionDataServerInfo) || [];
      }
      return this.currentItem.options;
    }
  },
  render() {
    const {
      __vModel__,
      placeholder,
      style,
      props,
      disabled,
      clearable,
      filterable,
      separator
    } = this.currentItem;
    const prop = this.groupVModel ? `${this.groupVModel}.${this.index}.${__vModel__}` : __vModel__;
    const showAllLevels = this.currentItem['show-all-levels'];
    const config = this.currentItem.__config__;
    const { showLabel, label, desc, parentFormModel } = config;
    let labelWidth = config.labelWidth ? `${config.labelWidth}px` : null;
    if (showLabel === false) labelWidth = '0';
    return (
      <el-form-item
        style={config.style}
        label-width={labelWidth}
        label={showLabel ? label : ''}
        prop={prop}
        rules={this.realRules}
      >
        <elCascader
          options={this.options}
          placeholder={placeholder}
          style={style}
          attrs={props}
          key={this.cascaderIdx}
          disabled={disabled}
          clearable={clearable}
          filterable={filterable}
          separator={separator}
          show-all-levels={showAllLevels}
          v-model={config.defaultValue}
          onInput={(event) => {
            if (parentFormModel) {
              this.$set(parentFormModel, prop, event);
            }
            this.$set(config, 'defaultValue', event);
          }}
        ></elCascader>
        {desc && (
          <span class="label-span" style={config.descStyle}>
            {desc}
          </span>
        )}
      </el-form-item>
    );
  },
  mounted() {
    // 远程数据
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
  destroyed() {
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
        contentType = 'form',
        useParamCode,
        paramCode,
        useCodeFilter,
        optionSlotCode,
        parentFormModel
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
