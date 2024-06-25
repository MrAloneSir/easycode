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
      dynamicOptions: []
    };
  },
  watch: {
    'currentItem.multiple': function(newVal) {
      const config = this.currentItem.__config__;
      // 多选状态，切换defalutValue值为数组
      if (newVal) {
        if (config.defaultValue === '') {
          config.defaultValue = [];
        } else if (!Array.isArray(config.defaultValue)) {
          config.defaultValue = [config.defaultValue];
        }
      } else {
        // 单选状态
        if (Array.isArray(config.defaultValue) && config.defaultValue.length) {
          config.defaultValue = config.defaultValue[0];
        } else {
          config.defaultValue = '';
        }
      }
    },
    'currentItem.__config__.defaultValue': function(defaultValue) {
      const { emitList } = this.currentItem.__config__;
      this.$nextTick(() => {
        for (const item of emitList ?? []) {
          EventBus.$emit(item, defaultValue);
        }
      });
    },
  },
  computed: {
    ...mapGetters(['getStoreValue']),
    realRules: function() {
      return rulesRender(this.currentItem?.__config__?.rules?.filter((item) => item.checked));
    },
    options: function() {
      let rawOptions = [];
      const {
        dataType,
        optionDataServerContent,
        optionDataServerInfo,
        dynamicLabel,
        dynamicValue,
      } = this.currentItem.__config__;
      // 远程数据
      if (dataType === 'dynamic') {
        if (dynamicLabel && dynamicValue) {
          rawOptions = (this.dynamicOptions || []).map((item) => {
            return {
              label: item?.[dynamicLabel],
              value: item?.[dynamicValue],
              disabled: item?.disabled
            };
          });
        } else {
          rawOptions = this.dynamicOptions;
        }
      } else if (dataType === 'localDynamic') {
        // 数据源
        let tmpOptions = this.getStoreValue(optionDataServerContent, optionDataServerInfo);

        if (tmpOptions instanceof Array) {
          if (dynamicLabel && dynamicValue) {
            rawOptions = (tmpOptions || []).map((item) => {
              return {
                label: item?.[dynamicLabel],
                value: item?.[dynamicValue],
                disabled: item?.disabled
              };
            });
          } else {
            rawOptions = tmpOptions;
          }
        } else {
          rawOptions = [];
        }
      } else {
        // 静态数据
        rawOptions = this.currentItem.__slot__.options;
      }
      return rawOptions || [];
    }
  },
  render() {
    const {
      __config__,
      __vModel__,
      filterable,
      remote,
      disabled,
      multiple,
      collapseTags,
      multipleLimit,
      clearable,
      style
    } = this.currentItem;
    const { showLabel, defaultValue, label, placeholder, desc, dataType } = __config__;
    const prop = this.groupVModel ? `${this.groupVModel}.${this.index}.${__vModel__}` : __vModel__;
    let labelWidth = __config__.labelWidth ? `${__config__.labelWidth}px` : null;
    if (showLabel === false) labelWidth = '0';
    // 修改默认值类型
    if (defaultValue && this.options.length) {
      let option = this.options[0];
      if (Object.prototype.toString.call(option.value) === '[object Number]') {
        if (!multiple) {
          let val = Number(defaultValue);
          __config__.defaultValue = !isNaN(val) ? val : defaultValue;
        } else if (multiple && Array.isArray(defaultValue)) {
          for (let i = 0; i < defaultValue.length; i++) {
            const item = defaultValue[i];
            if (item) {
              let val = Number(item);
              defaultValue[i] = !isNaN(val) ? val : item;
            }
          }
        }
      }
    }
    // 如果是静态数据，只可以本地搜索
    if (dataType === 'static') {
      this.currentItem.remote = false;
    }
    return (
      <el-form-item
        style={__config__.style}
        label-width={labelWidth}
        label={showLabel ? label : ''}
        prop={prop}
        rules={this.realRules}
      >
        <el-select
          v-model={__config__.defaultValue}
          placeholder={placeholder}
          style={style}
          disabled={disabled}
          multiple={multiple}
          multipleLimit={multipleLimit}
          collapseTags={collapseTags}
          filterable={remote == true ? true : filterable || false}
          remote={remote}
          clearable={clearable}
          remoteMethod={
            remote
              ? (v) => {
                  this.remoteMethod(v);
                }
              : null
          }
        >
          {(Array.isArray(this.options) ? this.options : []).map((item) => {
            return (
              <el-option
                label={item.label}
                value={item.value}
                disabled={item.disabled}
              ></el-option>
            );
          })}
        </el-select>
        {desc && (
          <span class="label-span" style={__config__.descStyle}>
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
      // 当options为空时，不用清空defaultValue
      if (this.options.length !== 0) {
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
    remoteMethod(searchValue) {
      // 远程搜素
      if (!searchValue) return;
      this.fetchData(this.currentItem, searchValue);
    },
    fetchData(currentItem, searchValue) {
      // 请求参数
      const {
        method,
        url,
        params,
        dataListInfo,
        dataType,
        host,
        contentType = 'form',
        useParamCode,
        parentFormModel,
        useCodeFilter,
        selectValue,
        optionSlotCode,
        paramCode
      } = currentItem.__config__;
      const { remote } = currentItem;
      if (method && url && dataType === 'dynamic') {
        let data = {};
        // 获取参数
        params &&
          params.forEach((obj) => {
            let { label, value, content } = obj;
            data[label] = this.getStoreValue(content, value);
          });
        if (remote && selectValue && searchValue) {
          data[selectValue] = searchValue;
        }
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

<style lang="scss" scoped>
.el-select {
  line-height: 35px;
}
</style>
