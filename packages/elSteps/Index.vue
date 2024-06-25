<script>
export default {
  props: ['currentItem', 'layout'],
  render() {
    const schema = this.currentItem;
    const config = schema.__config__;
    const child = config.children || [];
    const active = schema.active?schema.active*1: null;
    const type = schema.type === 'simple' ? true : false;
    const direction = schema.direction === 'vertical' ? "vertical": 'horizontal';
    return (
      <el-steps active={active} simple={type} direction={direction} processStatus={schema.processStatus} finishStatus={schema.finishStatus}>
        {
          child.map((item) => (
            <el-step title={item.label} description={item.desc} icon={item.icon} status={item.status}/>
          ))
        }
      </el-steps>
    )
  }
}
</script>
