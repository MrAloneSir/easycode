<script>
export default {
  props: ['currentItem', 'layout'],
  inject: ['handleAction', 'elForm'], // 处理action
  computed: {
    formDisabled() {
      return (this.elForm || {}).disabled;
    }
  },
  render() {
    const { type, domProps, size, disabled, disabledExpress, __config__: config } = this.currentItem;
    const disabledExpressResult = this.$store.getters.storeEvalExpress(disabledExpress);
    return (
      <elButton
        style={config.style}
        type={type}
        size={size}
        disabled={disabledExpressResult || disabled || this.formDisabled}
        onClick={this.btnClick}
      >
        {domProps.innerHTML}
      </elButton>
    );
  },
  methods: {
    btnClick(e) {
      e.preventDefault();
      if (e.pointerType === '') {
        return false;
      }
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
