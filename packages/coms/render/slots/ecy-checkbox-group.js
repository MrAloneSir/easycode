export default {
  options(h, conf, key) {
    const list = []
    conf.__slot__.options.forEach(item => {
      if (conf.__config__.type !== 'Checkbox') {
        list.push(<el-checkbox-button label={item.value}>{item.label}</el-checkbox-button>)
      } else {
        list.push(<el-checkbox label={item.value}>{item.label}</el-checkbox>)
      }
    })
    return list
  }
}
