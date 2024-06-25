<script>
// eslint-disable-next-line import/no-cycle
import NewRender from '../coms/render/render.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    NewRender
  },
  props: ['currentItem', 'layout'],
  computed: {
    ...mapGetters(['getStoreValue'])
  },
  render() {
    const { dataSourceType, defaultValue, children, textCustomize } = this.currentItem.__config__;
    if (dataSourceType != 'static') {
      this.currentItem.domProps.innerHTML = defaultValue;
    }
    if (dataSourceType != 'static' && textCustomize) {
      let textObject;
      children?.forEach((item) => {
        if (item.label == defaultValue) {
          textObject = item;
        }
      });
      if (textObject) {
        return (
          <span
            style={{
              color: textObject.color ? textObject.color : '#333',
              width: '100%',
              fontSize: '12px',
              fontWeight: textObject.fontWeight
            }}
          >
            {textObject.text}
          </span>
        );
      }
    } else {
      return <new-render conf={this.currentItem}></new-render>;
    }
  }
};
</script>
