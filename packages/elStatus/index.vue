<script>

export default {
  props: ['currentItem', 'layout'],
  render() {
    const {__config__:config} = this.currentItem;
    const array = config.options;

    return (
       <div>
        {array.map((item)=>(
          <elStatus label={item.label} type={item.value} style="margin-right: 10px"/>
        ))}
      </div>
    )
  }
}
</script>
