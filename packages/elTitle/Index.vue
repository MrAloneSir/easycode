<script>
export default {
  name: 'elTitle',
  props: ['currentItem', 'layout'],
  render() {
    const schema = this.currentItem;
    const { title, tip } = this.currentItem;
    const width = schema.style && schema.style.width ? schema.style.width : '100%';
    return (
      <div class="el-title mb10" style={{ width: width }}>
        {title}
        <span class="tip-color ml14 fontsize-base">{tip}</span>
      </div>
    );
  }
};
</script>
<style>
.el-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  line-height: 20px;
  padding: 4px 0 12px;
  border-bottom: 1px solid #e9ebf3;
}
</style>
