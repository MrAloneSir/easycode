<script>

export default {
  name: 'Dropdown',
  props: ['currentItem', 'layout'],
  inject: ['getComps'],
  render(h) {
    const schema = this.currentItem;
    const { domProps } = schema;
    const child = this.renderChildren(h, this.currentItem);
    return (
      <div style={schema.style}>
        <el-dropdown>
          <span>
            {domProps.innerHTML}
            <i class="el-icon-arrow-down el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            {child}
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    );
  },
  methods: {
    renderChildren(h, currentItem) {
      const config = currentItem.__config__;
      if (!Array.isArray(config.children)) return null;
      return config.children.map((el) => {
        const { command, label } = el
        const { divided, icon, disabled } = el.__config__
        return (
          <el-dropdown-item
            command={command}
            icon={icon}
            divided={divided}
            disabled={disabled}
          >
            {label}
          </el-dropdown-item>
        )

      });
    }
  }
};
</script>
<style>
  .el-dropdown-link {
    cursor: pointer;
    color: #457bfc;
    font-size: 12px;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
