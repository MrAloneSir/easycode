<script>
import { mapGetters } from 'vuex';

const components = {
  itemBtns(currentItem, index, list) {
    const { copyItem, deleteItem } = this.$listeners;
    return [
      <span
        class="drawing-item-copy"
        title="复制"
        onClick={(event) => {
          copyItem(currentItem, list);
          event.stopPropagation();
        }}
      >
        <i class="el-icon-copy-document" />
      </span>,
      <span
        class="drawing-item-delete"
        title="删除"
        onClick={(event) => {
          deleteItem(index, list);
          event.stopPropagation();
        }}
      >
        <i class="el-icon-delete" />
      </span>
    ];
  }
};

export default {
  props: ['currentItem', 'index', 'drawingList', 'activeId'],
  computed: {
    ...mapGetters(['getComDef', 'getStoreValue'])
  },
  provide() {
    return {
      getComps: this.getComps,
      handleAction: this.handleAction,
      setDynamicValue: () => {},
      setOtherContentValue: () => {},
      contentArr: []
    };
  },
  render(h) {
    return this.getComps(h, this.currentItem, {
      list: this.drawingList,
      index: this.index
    });
  },
  methods: {
    getComps(h, currentItem, options) {
      const def = this.getComDef(currentItem);
      const { activeItem } = this.$listeners;
      const config = currentItem.__config__;
      const {
        needBorder,
        formId,
        dataServerContent,
        dataSourceType,
        dataServerInfo,
        tag,
        children,
        parentFormModel
      } = config;
      let className = '';
      if (needBorder) {
        className =
          this.activeId === formId ? 'drawing-row-item active-from-item' : 'drawing-row-item';
      } else {
        className = this.activeId === formId ? 'drawing-item active-from-item' : 'drawing-item';
      }
      if (dataSourceType === 'dynamic') {
        // descriptions组件，如果父组件远程数据，子组件自动切换为远程数据
        if (tag === 'el-descriptions' && children?.length) {
          this.descriptionsData(this.currentItem);
        } else {
          config.defaultValue = this.getStoreValue(dataServerContent, dataServerInfo);
        }
      } else if (['window', 'Route', 'ls', 'state', 'currentScope'].includes(dataSourceType)) {
        config.defaultValue = this.getStoreValue(dataSourceType, dataServerInfo);
      } else {
        // descriptions组件，如果父组件为静态数据，子组件自动切换为静态数据
        if (tag === 'el-descriptions' && children?.length) {
          children.map((item) => {
            item.__config__.dataServerContent = '';
            item.__config__.dataServerInfo = '';
            item.__config__.dataSourceType = 'static';
          });
        }
      }

      if (
        parentFormModel &&
        currentItem.__vModel__ &&
        parentFormModel[currentItem.__vModel__] !== config.defaultValue
      ) {
        this.$set(parentFormModel, currentItem.__vModel__, config.defaultValue);
      }
      const child = h(def, {
        props: {
          currentItem: currentItem,
          layout: 'editor',
          index: options.index
        },
        on: {
          buttonAction: function() {
            options.callback && options.callback();
          }
        }
      });
      if (config.footer) {
        className += ' footer';
        return (
          <div
            class={className}
            onClick={(event) => {
              activeItem(currentItem);
              event.stopPropagation();
            }}
          >
            {child}
            {config.showCopyDelete !== false &&
              components.itemBtns.call(this, currentItem, options.index, options.list)}
          </div>
        );
      }
      if (config.parentTag === 'el-filter') {
        return (
          <section
            class={className}
            style="display: inline-block"
            onClick={(event) => {
              activeItem(currentItem);
              event.stopPropagation();
            }}
          >
            {child}
            {config.showCopyDelete !== false &&
              components.itemBtns.call(this, currentItem, options.index, options.list)}
          </section>
        );
      } else if (config.grid === false) {
        className += ' raw-item';
        return (
          <div
            class={className}
            onClick={(event) => {
              activeItem(currentItem);
              event.stopPropagation();
            }}
          >
            {child}
            {config.showCopyDelete !== false &&
              components.itemBtns.call(this, currentItem, options.index, options.list)}
          </div>
        );
      }
      return (
        <el-col
          span={config.span}
          class={className}
          style="padding: 0px"
          nativeOnClick={(event) => {
            activeItem(currentItem);
            event.stopPropagation();
          }}
        >
          {child}
          {config.showCopyDelete !== false &&
            components.itemBtns.call(this, currentItem, options.index, options.list)}
        </el-col>
      );
    },
    // 处理描述列表数据
    descriptionsData(currentItem) {
      const {
        dataServerContent: parentDataServerContent,
        dataSourceType: parentDataSourceType,
        children = []
      } = currentItem.__config__;
      children.map((item) => {
        // 描述列表整体选择远程数据后，下方的每一项，如果自己有值，则用自身的值，否则采用父级的值
        let { dataServerContent, dataSourceType, defaultValue } = item.__config__;
        dataServerContent = dataServerContent !== '' ? dataServerContent : parentDataServerContent;
        dataSourceType = parentDataSourceType;
        if (dataSourceType === 'dynamic') {
          defaultValue = this.getStoreValue(dataServerContent, dataServerInfo);
        }
      });
    },
    handleAction(config) {
      // const { addItem } = this.$listeners;
      // if (config.actionType === 'dialog') {
      //   addItem(DialogActionSchema.dialog, this.drawingList);
      // }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/home';
.footer {
  position: fixed;
  bottom: 0;
  left: 319px;
  right: 380px;
  background: white;
  z-index: 100;
}
</style>
