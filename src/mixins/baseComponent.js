// define um objeto mixin
var baseComponent = {
  props: {
    document: {
      type: String,
      required: true
    },
    position: {
      type: String,
      default: 'left'
    },
    date: {
      type: String
    }
  }
}

export default baseComponent
