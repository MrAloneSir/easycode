<script>
export default {
  props: ['currentItem', 'layout'],
  data() {
    return {
      tagChecked: this.currentItem.checked
    };
  },
  render() {
    const { disabled, closable, type, tagText } = this.currentItem;

    return type !== 'checkable' ? (
      <elTag
        class="mr10"
        disabled={disabled}
        type={type}
        closable={closable}
        onClick={this.tagClicked}
      >
        {tagText}
      </elTag>
    ) : (
      <elCheckTag class="mr10" checked={this.tagChecked} onChange={this.toggleCheck}>
        {tagText}
      </elCheckTag>
    );
  },
  methods: {
    tagClicked() {
      console.log('click');
    },
    toggleCheck() {
      this.tagChecked = !this.tagChecked;
      console.log('change');
    }
  }
};
</script>
