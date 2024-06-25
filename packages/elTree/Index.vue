<script>
import api from '../../src/api/request';
import { mapGetters } from 'vuex';
export default {
  props: ['currentItem', 'layout'],
  inject: ['evalJS', 'customFunction'],
  data() {
    return {
      value: [],
      dataList: []
    };
  },
  mounted() {
    this.fetchData(this.currentItem);
  },
  computed: {
    ...mapGetters(['getStoreValue']),
    data: function() {
      const {
        dataType,
        optionDataServerContent,
        optionDataServerInfo
      } = this.currentItem.__config__;
      let dataRes = [];
      if (dataType === 'static') {
        dataRes = this.currentItem.options;
      } else if (dataType === 'dynamic') {
        dataRes = this.dataList;
      } else {
        dataRes = this.getStoreValue(optionDataServerContent, optionDataServerInfo);
      }
      return dataRes || [];
    }
  },
  render() {
    const schema = this.currentItem;
    const nodeKey = schema['node-key'];
    const showCheckbox = schema['show-checkbox'];
    const { accordion, draggable } = schema;
    const width = schema.style && schema.style.width ? schema.style.width : '100%';
    const { dynamicLabel, dynamicValue } = schema.__config__;
    const props = Object.assign({}, { label: dynamicLabel, children: dynamicValue });

    return (
      <div style={{ padding: '10px' }}>
        <el-tree
          v-model={this.value}
          data={this.data}
          props={props}
          node-key={nodeKey}
          show-checkbox={showCheckbox}
          accordion={accordion}
          draggable={draggable}
          style={{ width: width }}
        />
      </div>
    );
  },
  methods: {
    async fetchData(currentItem) {
      const {
        method,
        url,
        params,
        otherParams,
        host,
        contentType,
        parentFormModel,
        dataType,
        useParamCode,
        paramCode,
        useCodeFilter,
        dataListInfo,
        optionSlotCode
      } = currentItem.__config__;
      if (method && url && dataType === 'dynamic') {
        let data = {};
        // 获取参数
        // params &&
        //   params.forEach((item) => {
        //     data[item.label] = item.value;
        //   });
        params &&
          params.forEach((obj) => {
            let { label, value, content } = obj;
            data[label] = this.getStoreValue(content, value);
          });
        if (otherParams) {
          data = Object.assign({}, data, otherParams);
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
        try {
          const res = await api.post('/proxy/index', data);
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
            this.dataList = this.evalJS(dataListInfo, transformRes) || [];
          }
        } catch (error) {
          console.log(error);
          throw error;
        }
      }
    }
  }
};
</script>
