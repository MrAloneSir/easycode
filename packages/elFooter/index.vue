<script>
import { renderChildren } from '../utils/utils';

export default {
  props: ['currentItem', 'layout'],
  inject: ['getComps'], // 递归子组件添加上复制删除，点击等功能
  render() {
    const currentItem = this.currentItem;
    const config = currentItem.__config__;
    let child = renderChildren(h, this.currentItem, this.getComps);
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
      <div>
        {child}
      </div>
    );
  }
};
</script>

<style lang="scss" scoped>
.drag-wrapper {
  min-height: 130px;
  padding-bottom: 30px;
  overflow: hidden;
}
</style>
