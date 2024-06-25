<template>
  <div class="object-editor">
    <Editor
      v-for="(item, index) in properties"
      :key="index"
      :desc="item"
      :model="value"
      @update="updateCom"
    ></Editor>
  </div>
</template>

<script>
export default {
  components: {
    Editor: () => import('./index.vue'),
  },
  props: ['value', 'desc'],
  computed: {
    properties() {
      let props = this.desc.props
      let edits = []
      for (let key in props) {
        let item = props[key]
        let value = this.value
        let show = item.show
        if (show && !!value) {
          let [showKey, showValue] = show.split(':')
          if (this.value[showKey] === showValue) {
            edits.push(
              Object.assign({}, item, {
                label: item.label,
                type: item.type,
                model: item.model ? item.model : key,
              })
            )
          }
        }
        else if (!!value) {
          edits.push(
            Object.assign({}, item, {
              label: item.label,
              type: item.type,
              model: item.model ? item.model : key,
            })
          )
        }
      }
      return edits
    },
  },
  methods: {
    updateCom(item) {
      let newItem = JSON.parse(JSON.stringify(item))
      this.$emit('input', newItem)
    },
  },
}
</script>

