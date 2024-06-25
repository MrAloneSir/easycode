<script>
export default {
  props: ['currentItem', 'layout'],
  render() {
    const schema = this.currentItem;
    const config = schema.__config__;
    const child = config.children || [];
    return (
      <el-collapse accordion={schema.accordion} onChange={()=>{}}>
        {
          child.map((item) => (
            <el-collapse-item title={item.label} name={item.name} disabled={item.disabled}>
             <div>{item.text}</div>
            </el-collapse-item>
          ))
        }
      </el-collapse>
    )
  }
}
</script>
