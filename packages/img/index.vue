<script>
import NewRender from '../coms/render/render.vue'

export default {
  components: {
    NewRender
  },
  props: ['currentItem', 'layout'],
  render() {
    return <new-render conf={this.currentItem}></new-render>
  }
}
</script>
