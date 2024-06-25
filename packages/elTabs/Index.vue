<script>
import draggable from 'vuedraggable';
import { renderChildren } from '../utils/utils';

export default {
  name: 'Tabs',
  components: {
    draggable
  },
  props: ['currentItem', 'layout'],
  inject: ['getComps'],
  data() {
    return {
      value: 'first-0'
    };
  },
  render(h) {
    const schema = this.currentItem;
    const { type } = schema;
    const config = this.currentItem.__config__;
    const child = this.renderChildrenPane(h, this.currentItem);
    return (
      <div style={{ padding: '10px' }}>
        <el-tabs v-model={this.value} type={type}>
          {child}
        </el-tabs>
      </div>
    );
  },
  methods: {
    renderChildrenPane(h, currentItem) {
      const config = currentItem.__config__;
      if (!Array.isArray(config.children)) return null;
      return config.children.map((el, index) => {
        let child = renderChildren(h, el, this.getComps);
        if (this.layout === 'editor') {
          child = (
            <draggable
              list={el.__config__.children || []}
              animation={340}
              group="blockGroup"
              class="drag-wrapper"
            >
              {child}
            </draggable>
          );
        }
        return (
          <el-tab-pane label={el.label} name={`${el.name}-${index}`}>
            {child}
          </el-tab-pane>
        );
      });
    }
  }
};
</script>
<style scoped>
.el-tab-pane {
  font-size: 12px;
}

.drag-wrapper {
  min-height: 130px;
  padding-bottom: 30px;
  overflow: hidden;
}
</style>
