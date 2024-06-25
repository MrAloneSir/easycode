<script>
import { renderChildren } from '../utils/utils';
export default {
  props: ['currentItem', 'layout'],
  inject: ['getComps'], // 递归子组件添加上复制删除，点击等功能
  render() {
    const currentItem = this.currentItem;
    const config = currentItem.__config__;
    const { gutter, showLabel, children, draggGroup, label } = config;
    let labelWidth = config.labelWidth ? `${config.labelWidth}px` : null;
    if (showLabel === false) labelWidth = '0';
    let child = renderChildren(h, this.currentItem, this.getComps);
    if (currentItem.type === 'flex') {
      child = (
        <el-row
          type={currentItem.type}
          justify={currentItem.justify}
          align={currentItem.align}
          gutter={gutter}
        >
          {child}
        </el-row>
      );
    } else {
      child = (
        <el-row gutter={gutter}>
          {child}
        </el-row>
      );
    }
    if (this.layout !== 'Parser') {
      child = (
        <draggable list={children || []} animation={340} group={draggGroup} class="drag-wrapper">
          {child}
        </draggable>
      );
    }
    if (showLabel) {
      return (
        <el-form-item label-width={labelWidth} label={label || ''} style={config.style}
        >
          {child}
        </el-form-item>
      );
    }
    return (<div style={config.style}>
      {child}
    </div>);
  }
};
</script>

<style scoped>
.drag-wrapper {
  min-height: 130px;
  padding-bottom: 30px;
  overflow: hidden;
}
</style>
