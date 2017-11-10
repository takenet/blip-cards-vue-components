export default {
  name: 'editable',
  template: '<div contenteditable="true" @input="update"></div>',
  props: ['content'],
  mounted: function () {
    this.$el.innerText = this.content
  },
  methods: {
    update: function (event) {
      this.$emit('update', event.target.innerText)
    }
  }
}
