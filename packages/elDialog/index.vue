<script>
import { renderChildren } from '../utils/utils';

export default {
  props: ['currentItem', 'layout', 'index'],
  inject: [
    'getComps',
    'deleteItem',
    'drawingList',
    'setDynamicValue',
    'setOtherContentValue',
    'contentArr'
  ], // 递归子组件添加上复制删除，点击等功能
  computed: {
    list: function() {
      return this.drawingList();
    }
  },
  mounted() {
    this.setOtherContentValue && this.setOtherContentValue(this.currentItem.__config__.children);
    this.setDynamicValue &&
      this.setDynamicValue(this.currentItem.__config__.children, this.contentArr);
  },
  render(h) {
    const currentItem = this.currentItem;
    const config = this.currentItem.__config__;
    let child = renderChildren(h, this.currentItem, this.getComps);
    const footer = this.getFooter(h);
    if (this.layout !== 'Parser') {
      child = (
        <draggable
          list={config.children || []}
          animation={340}
          group={config.draggGroup}
          class="drag-wrapper"
        >
          {child}
        </draggable>
      );
    }

    return (
      <div class={this.layout !== 'Parser' ? 'show-component' : ''}>
        <el-dialog
          visible={true}
          width={config?.width || '80%'}
          {...{
            on: {
              'update:visible': () => {
                this.deleteItem(this.index, this.list);
              }
            }
          }}
          title={currentItem.title}
          modal-append-to-body
          close-on-click-modal={false}
          modal={this.layout === 'Parser'}
        >
          <el-row gutter={15}>{child}</el-row>
          <span slot="footer" class={'footer'}>{footer}</span>
        </el-dialog>
      </div>
    );
  },
  methods: {
    getFooter(h) {
      let footerBtn = this.currentItem.__config__.footerBtn;
      return footerBtn.map((el, i) => {
        return this.getComps(h, el, {
          index: i,
          list: footerBtn
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/home';

.show-component {
  .v-modal {
    top: 42px;
    left: 309px;
    width: calc(100% - 669px);
    right: 360px;
  }
  .el-dialog__wrapper {
    top: 42px;
    left: 309px;
    right: 360px;
    background: rgba(0, 0, 0, 0.5);
  }
}

.drag-wrapper {
  min-height: 130px;
  padding-bottom: 30px;
  overflow: hidden;
}

.footer{
  min-height: 50px;
  display: block;
}
</style>
