<script>
import tableColumn from '../elTableColumn/index.vue';
import api from '../../src/api/request';
import { EventBus } from '../utils/event-bus';
import { mapGetters, mapMutations } from 'vuex';

export default {
  props: ['currentItem', 'layout'],
  inject: ['evalJS', 'customFunction'],
  data() {
    return {
      dynamicData: [],
      dynamicTotal: 0,
      pageIndex: 1,
      pageSize: 10,
      filterParams: null,
      multipleSelection: []
    };
  },
  computed: {
    ...mapGetters(['getStoreValue', 'storeEvalExpress']),
    data: function() {
      const { dataType, optionDataServerContent, dataListInfo } = this.currentItem.__config__;
      // 远程数据
      if (dataType === 'dynamic') {
        return this.dynamicData;
      }
      if (dataType === 'localDynamic') {
        // 数据源
        return this.getStoreValue(optionDataServerContent, dataListInfo) || [];
      }
      return [];
    },
    total: function() {
      const { dataType, optionDataServerContent, totalInfo } = this.currentItem.__config__;
      // 远程数据
      if (dataType === 'dynamic') {
        return this.dynamicTotal;
      }
      if (dataType === 'localDynamic') {
        // 数据源
        return this.getStoreValue(optionDataServerContent, totalInfo) || 0;
      }
      return 0;
    }
  },
  mounted() {
    // 远程数据
    const { filterVModel, __vModel__, __config__: config } = this.currentItem;
    const { pageSizeKey, pageIndexKey, params } = config;
    let pageIndexItem = params.find((item) => pageIndexKey === item.label);

    // 当有filter组件时，由filter组件触发加载表格信息
    if (!filterVModel && config.dataType === 'dynamic') {
      if (this.layout === 'Parser' && this.storeEvalExpress(config.isInterval)) {
        // 循环请求
        this.addInterval({
          key: __vModel__,
          callBack: () => {
            this.fetchData(this.currentItem);
          },
          intervalTimer: config.intervalTimer
        });
      }
      this.fetchData(this.currentItem);
    }
    if (__vModel__) {
      EventBus.$on(__vModel__, (otherParams, type) => {
        // el-filter重置后，分页页数置为1
        params.map((item) => {
          if (item.label == pageIndexKey) {
            return (item.value = 1);
          }
        });
        if (type === 'reload' && this.filterParams) {
          this.fetchData(this.currentItem, this.filterParams);
        } else {
          this.fetchData(this.currentItem, otherParams);
          this.filterParams = otherParams;
        }
      });
    }
  },
  beforeDestroy() {
    EventBus.$off(this.currentItem.__vModel__);
  },
  render(h) {
    const { isPagination, __config__: config } = this.currentItem;
    const child = this.renderChildren(h, this.currentItem);
    const { pageSizeKey, pageIndexKey, params } = config;
    let pageIndexItem = params.find((item) => pageIndexKey === item.label);
    if (pageIndexItem) {
      this.pageIndex = pageIndexItem.value;
    }
    let pageSizeItem = params.find((item) => pageSizeKey === item.label);
    if (pageSizeItem) {
      this.pageSize = pageSizeItem.value;
    }
    // 由于el-table会造成checkbox全选报错，所以换位el-table
    return (
      <div style="margin-top: 10px">
        <el-table
          ref="table"
          stripe
          data={this.data}
          style="width: 100%"
          tooltip-effect="dark"
          border={true}
          header-cell-style={this.tableHeaderStyle}
          on={{
            'selection-change': (val) => {
              this?.changeCheckedTableColumns(val);
              this.multipleSelection = val;
            }
          }}
        >
          {child}
        </el-table>

        {isPagination && (
          <div class="table-panel-footer">
            <el-pagination
              current-page={Number(this.pageIndex)}
              page-size={Number(this.pageSize)}
              page-sizes={[10, 20, 30, 40, 50]}
              hide-on-single-page={false}
              background
              layout="total, sizes, prev, pager, next, jumper"
              total={this.total}
              on={{
                'current-change': (val) => {
                  if (pageIndexItem) {
                    pageIndexItem.value = val;
                    this.fetchData(this.currentItem, this.filterParams);
                  }
                },
                'size-change': (val) => {
                  if (pageSizeItem) {
                    pageSizeItem.value = val;
                    this.fetchData(this.currentItem, this.filterParams);
                  }
                }
              }}
            />
          </div>
        )}
      </div>
    );
  },
  methods: {
    tableHeaderStyle({ row, rowIndex }) {
      if (rowIndex == 0) {
        return 'backgroundColor:#F9F9F9';
      }
    },
    ...mapMutations(['changeCheckedTableColumns', 'addInterval', 'clearInterval']),
    renderChildren(h, currentItem) {
      const config = currentItem.__config__;
      const { dataType } = config;
      if (!Array.isArray(config.children)) return null;
      //自定义复杂表头
      if (config.enableTabHeader) {
        try {
          const children = JSON.parse(JSON.stringify(config.children));
          const jsonHeader = JSON.parse(config.tableSlotCode.jsonCode || '[]');
          const headerData = this.convert(jsonHeader, children);
          return this.parse(h, headerData, dataType);
        } catch (error) {
          console.log(error);
          return null;
        }
      }
      //单级表头
      return config.children.map((el) =>
        h(tableColumn, {
          props: {
            currentItem: { ...el, id: currentItem.__vModel__ },
            layout: this.layout,
            dataType
          }
        })
      );
    },
    parse(h, data, dataType) {
      return (data || []).map((item) => {
        return h(
          tableColumn,
          {
            props: {
              currentItem: { ...item, id: this.currentItem.__vModel__ },
              layout: this.layout,
              dataType
            }
          },
          this.parse(h, item?.children || [], dataType)
        );
      });
    },
    convert(data, tableChild) {
      let res = [];
      for (const item of data || []) {
        if (item.tabChild) {
          if (item.tabChild.length > 1) {
            res.push({
              __config__: {
                tag: 'el-table-column',
                type: 'content'
              },
              prop: '',
              label: item.label || '',
              slotCode: '',
              width: item.width || '',
              fixed: item.fixed || '',
              align: item.align || '',
              children: item.tabChild.map((index) => tableChild?.[index])
            });
          } else {
            res.push(tableChild?.[item.tabChild?.[0]]);
          }
        }
        if (item.child) {
          res.push({
            __config__: {
              tag: 'el-table-column',
              type: 'content'
            },
            prop: '',
            label: item.label,
            slotCode: '',
            width: item.width || '',
            fixed: item.fixed || '',
            align: item.align || '',
            children: this.convert(item.child, tableChild)
          });
        }
      }
      return res;
    },
    fetchData(currentItem, otherParams) {
      const {
        method,
        url,
        params,
        dataListInfo,
        totalInfo,
        host,
        contentType = 'form',
        useParamCode,
        paramCode,
        useCodeFilter,
        optionSlotCode,
        pageSizeKey,
        pageIndexKey
      } = currentItem.__config__;
      if (method && url) {
        let data = {};
        // 获取参数
        params &&
          params.forEach((obj) => {
            let { label, value, content } = obj;
            if (label === pageSizeKey || label === pageIndexKey) {
              data[label] = Number(value);
            } else {
              data[label] = this.getStoreValue(content, value);
            }
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
          data = paramFunc(data);
          if (!data) {
            return;
          }
        }
        api.post('/proxy/index', data).then((res) => {
          let transformRes = res;
          // 转换结果
          if (useCodeFilter) {
            const resultFunc = this.customFunction({
              code: optionSlotCode,
              type: 'bind'
            });
            transformRes = resultFunc(res);
            if (!transformRes) {
              return;
            }
          }

          if (res?.code === 0) {
            // 转换结果
            this.dynamicData = this.evalJS(dataListInfo, transformRes) || [];
            this.dynamicTotal = this.evalJS(totalInfo, transformRes) || 0;
          } else {
            this.dynamicData = [];
            this.dynamicTotal = 0;
          }
          EventBus.$emit('TABLE_REFRESH', currentItem.__vModel__);
          this.$nextTick(() => {
            this.$refs.table?.doLayout?.();
          });
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.table-panel-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
::v-deep .btn-prev .el-icon {
  width: unset;
  height: unset;
}
::v-deep .btn-next .el-icon {
  width: unset;
  height: unset;
}
::v-deep .el-pagination.el-pagination.is-background .el-pager li {
  height: 28px;
}
::v-deep .el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell {
  background: #f5f9ff;
}
::v-deep .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #457bfc;
  border-color: #457bfc;
}
::v-deep .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #457bfc;
  border-color: #457bfc;
}
::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #457bfc;
}
::v-deep .el-checkbox.is-bordered.is-checked {
  border-color: #457bfc;
}
::v-deep .el-checkbox__input.is-focus .el-checkbox__inner {
  border-color: #457bfc;
}
</style>
