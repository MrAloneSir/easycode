<script>
import NewRender from '../coms/render/render.vue';

export default {
  components: {
    NewRender
  },
  props: ['currentItem', 'layout'],
  inject: ['handleAction'], // 处理action
  render() {
    const { type, fill, size, theme } = this.currentItem;
    return (
      <span onClick={this.btnClick}>
        <elIcon type={type} fill={fill} size={size} theme={theme}></elIcon>
      </span>
    );
  },
  methods: {
    btnClick() {
      // 处理action
      const actionArr = this.currentItem.__config__.action;
      this.$emit('buttonAction');
      if (actionArr && actionArr.length) {
        for (let i = 0; i < actionArr.length; i++) {
          const action = actionArr[i];
          this.handleAction(action);
        }
      }
    }
  }
};
</script>
