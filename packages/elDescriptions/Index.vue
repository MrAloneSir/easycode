<script>
export default {
  props: ['currentItem', 'layout'],
  render() {
    const schema = this.currentItem;
    const config = schema.__config__;
    const child = config.children || [];
    return (
      <el-descriptions 
        title={schema.title} 
        border={schema.border} 
        column={schema.column} 
        direction={schema.direction} 
        size={schema.size}
        colon={schema.colon}
      >
        {
          child.map((item) => (
            <el-descriptions-item label={item.label} span={item.span}>
            <template slot="label"><i class={item.icon}></i>{item.label}</template>
             {item.__config__?.dataSourceType === 'dynamic'?item.__config__.defaultValue :item.text}
            </el-descriptions-item>
          ))
        }
      </el-descriptions>
    )
  }
}
</script>