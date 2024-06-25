<script>
import { renderChildren, deepClone } from '../utils/utils';

export default {
  props: ['currentItem', 'layout'],
  inject: ['getComps', 'elForm'], // 递归子组件添加上复制删除，点击等功能
  data() {
    return {
      groupChild: [],
      parseChildren: [],
      templateChildren: this.currentItem.__config__.children || []
    };
  },
  computed: {
    formDisabled() {
      return (this.elForm || {}).disabled;
    }
  },
  watch: {
    'currentItem.__config__.defaultValue': {
      handler: function (defaultValue) {
        let arr = [];
        if (defaultValue?.length) {
          // copy出一份数据
          defaultValue.forEach((itemValue) => {
            const deepChild = deepClone(this.templateChildren);
            deepChild.forEach((el) => {
              if (itemValue[el.__vModel__]) {
                el.__config__.defaultValue = itemValue[el.__vModel__];
              }
            });
            arr.push(deepChild);
          });
          this.parseChildren = arr;
        } else {
          this.parseChildren = [deepClone(this.templateChildren)];
        }
      },
      immediate: true
    }
  },
  mounted() {
    if (!this.currentItem.__config__.defaultValue) {
      this.currentItem.__config__.defaultValue = [];
    }
  },
  render(h) {
    const currentItem = this.currentItem;
    const config = currentItem.__config__;
    const {
      defaultValue,
      labelWidth,
      showLabel,
      children,
      label,
      gutter,
      draggGroup,
      maxCount = 50,
      showNumber
    } = config;
    let labelWidthStr = labelWidth ? `${labelWidth}px` : null;
    if (showLabel === false) labelWidthStr = '0';
    if (this.layout !== 'Parser') {
      let child = renderChildren(h, this.currentItem, this.getComps);
      if (currentItem.type === 'flex') {
        child = (
          <el-row
            type={currentItem.type}
            justify={currentItem.justify}
            align={currentItem.align}
            gutter={gutter}
            style="margin: 0"
          >
            {child}
          </el-row>
        );
      } else {
        child = (
          <el-row gutter={gutter} style="margin: 0">
            {child}
          </el-row>
        );
      }
      child = (
        <draggable list={children || []} animation={340} group={draggGroup} class="drag-wrapper">
          {child}
        </draggable>
      );
      return (
        <el-form-item label-width={labelWidthStr} label={showLabel ? label : ''}>
          {child}
        </el-form-item>
      );
    }
    if (!defaultValue) {
      return;
    }
    if (this.layout === 'Parser') {
      const parseChildComps =
        this.parseChildren &&
        this.parseChildren.map((children, index) => {
          if (!defaultValue[index]) {
            this.$set(defaultValue, index, {});
          }
          return (
            <div class="parent">
              {showNumber && <div class="number">{index + 1}</div>}
              {currentItem.type === 'flex' ? (
                <el-row
                  type={currentItem.type}
                  gutter={gutter}
                  justify={currentItem.justify}
                  align={currentItem.align}
                  style="flex: 1"
                >
                  {this.getChild(h, children, defaultValue[index], index)}
                </el-row>
              ) : (
                <el-row gutter={gutter} style="flex: 1">
                  {this.getChild(h, children, defaultValue[index], index)}
                </el-row>
              )}
              <div style="width: 80px;display: flex;">
                {this.parseChildren.length > 1 && (
                  <div
                    class="child delete"
                    onClick={() => {
                      if (this.formDisabled) {
                        return;
                      }
                      this.parseChildren.splice(index, 1);
                      defaultValue.splice(index, 1);
                    }}
                  ></div>
                )}
                {index === this.parseChildren.length - 1 && this.parseChildren.length < maxCount && (
                  <div
                    class="child add"
                    onClick={() => {
                      if (this.formDisabled) {
                        return;
                      }
                      this.parseChildren.push(deepClone(this.templateChildren));
                    }}
                  ></div>
                )}
              </div>
            </div>
          );
        });

      return (
        <el-form-item label-width={labelWidthStr} label={showLabel ? label : ''}>
          {parseChildComps}
        </el-form-item>
      );
    }
  },
  methods: {
    getChild(h, children, parentFormModel, groupIndex) {
      const { draggGroup } = this.currentItem.__config__;
      const __vModel__ = this.currentItem.__vModel__;
      if (!Array.isArray(children)) return null;
      return children.map((el) => {
        el.__config__.parentFormModel = parentFormModel;
        if (!el.__config__.draggGroup) {
          el.__config__.draggGroup = draggGroup;
        }
        return this.getComps(h, el, {
          index: groupIndex,
          groupVModel: __vModel__
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.parent {
  // position: relative;
  display: flex;
}
.child {
  width: 35px;
  height: 35px;
  margin-left: 5px;
  // position: absolute;
  // right: 0;
  // top: 0;
}
.number {
  font-size: 12px;
}
.add {
  background: url(https://cdn.cnbj1.fds.api.mi-img.com/assets-images/wanggaofeng/add.png) no-repeat
    center;
  background-size: 30px 30px;
}
.delete {
  background: url(https://cdn.cnbj1.fds.api.mi-img.com/assets-images/wanggaofeng/delete.png)
    no-repeat center;
  background-size: 30px 30px;
}

.drag-wrapper {
  min-height: 130px;
  padding-bottom: 30px;
  overflow: hidden;
}
</style>
