<script>
import { renderChildren, parsePath, parseFunction } from '../utils/utils';
import NewRender from '../coms/render/render.vue';

import { mapMutations } from 'vuex';
import { env } from '../../src/api/config';
import Vue from 'vue';
import { EventBus } from '../utils/event-bus';

export default {
  components: {
    NewRender
  },
  props: ['currentItem', 'layout'],
  inject: ['getComps', 'handleAction', 'filter'], // 递归子组件添加上复制删除，点击等功能
  data() {
    return {
      url: env.upload + '/v1/web/media/uploadImage',
      switch: false,
      row: {},
      key: 1,
      height: null
    };
  },
  mounted() {
    const { width, id } = this.currentItem;
    EventBus.$on('TABLE_REFRESH', (tabelId) => {
      if (width) {
        if (tabelId === id) {
          this.key = Math.random();
        }
      }
    });
  },
  updated() {
    const colId = this.$refs.tableCol?.columnId;
    if (colId) {
      const rect = document.querySelector(`td.${colId}`)?.getBoundingClientRect();
      this.height = rect?.height;
    }
  },
  render(h) {
    const {
      prop = '',
      label,
      __config__: config,
      fixed = false,
      width = '',
      align = 'left',
      sortable = false,
      overflowTooltip = false
    } = this.currentItem;
    const {
      srcSource,
      options,
      headTip = '',
      contentTipKey = '',
      prefixText = false,
      textOnFalse = '',
      textOnTrue = ''
    } = config;
    const headerTip = () => {
      return (
        <div class="tooltip">
          <el-tooltip placement="top" content={headTip}>
            <i class="table-help" />
          </el-tooltip>
          <div>{label}</div>
        </div>
      );
    };
    let scopedSlots = '';
    if (config.type === 'content') {
      // 文本
      scopedSlots = {
        default: (scope) => {
          let value = parsePath(prop)(scope.row);
          if (prop && prop.includes && prop.includes('|')) {
            value = this.filter(`\$\{${prop}\}`, scope.row);
          }
          if (Array.isArray(value) && value.length) {
            return (
              <div
                class="arrayRender"
                style={{
                  height: this.height ? this.height + 'px' : '100%',
                  marginTop: '-6px',
                  marginBottom: '-6px',
                }}
              >
                {value.map((item) => {
                  return (
                    <p
                      class={
                        align === 'center' || align === ''
                          ? 'center'
                          : align === 'left'
                          ? 'left'
                          : 'right'
                      }
                    >
                      {item}
                    </p>
                  );
                })}
              </div>
            );
          }
          const content = parsePath(contentTipKey)(scope.row);
          if (contentTipKey && content) {
            return (
              <div class="tooltip">
                <span>{value}</span>
                <el-tooltip style="margin-left: 3px" placement="top" content={content}>
                  <i class="table-help" />
                </el-tooltip>
              </div>
            );
          }
          return <span>{value}</span>;
        }
      };
    } else if (config.type === 'button') {
      // 按钮
      scopedSlots = {
        default: (scope) => {
          const children = this.currentItem.__config__.children;
          children &&
            children.forEach((el) => {
              el.__config__.showCopyDelete = false;
            });

          const callback = () => {
            this.addModel({ key: 'currentScope', value: scope });
          };
          return renderChildren(h, this.currentItem, this.getComps, callback, scope);
        }
      };
    } else if (config.type === 'img') {
      // 图片
      let widthNum = 0;
      if (width?.includes('px') || width?.includes('%')) {
        try {
          widthNum = Number(width.match(/\d+\.?(\d+)?/)[0]);
        } catch {
          console.log('img width参数 不合法');
        }
      } else {
        widthNum = Number(width);
      }
      scopedSlots = {
        default: (scope) => {
          return (
            <img
              src={scope.row[srcSource]}
              style={{ width: widthNum ? widthNum - 20 + 'px' : width }}
              align={align}
              fixed={fixed}
            />
          );
        }
      };
    } else if (config.type === 'status') {
      scopedSlots = {
        default: (scope) => {
          const selectOption =
            (options && options.find((item) => item.value === scope.row[srcSource])) || '';
          if (selectOption) {
            return <elStatus label={selectOption.label} type={selectOption.type} />;
          }
          return null;
        }
      };
    } else if (config.type === 'aLabel') {
      // a链接
      scopedSlots = {
        default: (scope) => {
          return (
            <a href={scope.row[srcSource]} target={config.target}>
              {config.content}
            </a>
          );
        }
      };
    } else if (config.type === 'slotCode') {
      scopedSlots = {
        default: (scope) => {
          const templateBody = config.slotCode.htmlCode;
          const slotJs = config.slotCode.jsCode;
          const { params, content, name } = parseFunction(slotJs);
          const func = new Function(params, content);
          const com = Vue.extend({
            template: templateBody,
            methods: {
              [name]: func
            },
            data: function() {
              return {
                // row: isExistFunctionBody ? row : scope.row,
                row: scope.row,
                $index: scope.$index
              };
            }
          });
          return h(com);
        }
      };
    } else if (config.type === 'switch') {
      scopedSlots = {
        default: (scope) => {
          var btnClick = () => {
            // 处理action
            const actionArr = this.currentItem.action;
            this.$emit('buttonAction');
            if (actionArr && actionArr.length) {
              for (let i = 0; i < actionArr.length; i++) {
                const action = actionArr[i];
                this.handleAction(action, scope);
              }
            }
          };
          return (
            <div>
              {prefixText ? (
                <span>
                  <span>{scope.row[srcSource] ? textOnTrue : textOnFalse}</span>:&nbsp;&nbsp;
                </span>
              ) : null}
              <el-switch value={scope.row[srcSource]} onChange={btnClick}></el-switch>
            </div>
          );
        }
      };
    } else if (config.type === 'selection') {
      scopedSlots = {
        default: (scope) => {
          return <el-checkbox></el-checkbox>;
        }
      };
    }
    if (headTip) {
      scopedSlots.header = headerTip;
    }
    if (config.type === 'selection') {
      return (
        <el-table-column
          ref="tableCol"
          type="selection"
          width={width}
          align={align || 'left'}
        ></el-table-column>
      );
    } else {
      return (
        <el-table-column
          ref="tableCol"
          scopedSlots={scopedSlots}
          key={this.key}
          label={label}
          prop={prop}
          width={width}
          show-overflow-tooltip={!!overflowTooltip}
          fixed={fixed || false}
          align={align || 'left'}
          sortable={!!sortable}
        >
          {this.$slots.default}
        </el-table-column>
      );
    }
  },
  methods: {
    ...mapMutations(['addModel'])
  }
};
</script>

<style lang="scss" scoped>
.table-help {
  display: inline-block;
  width: 16px;
  height: 16px;
  background: center center no-repeat
    url('https://cnbj1.fds.api.xiaomi.com/assets-images/elui-site/table-help.png');
  background-size: cover;
  position: relative;
  right: 2px;
}
.tooltip {
  display: flex;
  align-items: center;
}
.arrayRender {
  display: flex;
  flex-direction: column;
}
.arrayRender p {
  // text-align: center;
  width: calc(100% + 20px);
  margin-left: -10px;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.arrayRender p:last-child {
  border-bottom: none;
}
.center {
  text-align: center;
}
.left {
  text-align: left;
  padding-left: 10px;
}
.right {
  text-align: right;
  padding-right: 10px;
}
</style>
