<script>
import draggable from "vuedraggable";
import { renderChildren } from "../utils/utils";

export default {
  name: "Card",
  components: {
    draggable,
  },
  props: ["currentItem", "layout"],
  inject: ["getComps"], // 递归子组件添加上复制删除，点击等功能
  render(h) {
    const config = this.currentItem.__config__;
    let child = renderChildren(h, this.currentItem, this.getComps);
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
    return (
      <el-card shadow={this.currentItem.shadow}>
        {
          config.showTitle &&
          <div slot="header">
            <span>{config.title}</span>
            {
              config.showOptButton &&
              <el-button style="float: right" type="primary">
                {config.optButtonName}
              </el-button>
            }
          </div>
        }
        {child}
      </el-card>
    );
  },
};
</script>
<style lang="scss" scoped>
.drag-wrapper {
  min-height: 130px;
  padding-bottom: 30px;
  overflow: hidden;
}
</style>
