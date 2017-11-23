import editSvg from '../assets/img/Edit.svg'
import approveSvg from '../assets/img/Approve.svg'
import closeSvg from '../assets/img/Close.svg'
import plusSvg from '../assets/img/plus.svg'

// define um objeto mixin
var baseComponent = {
  props: {
    document: {
      type: Object,
      required: true
    },
    position: {
      type: String,
      default: 'left'
    },
    date: {
      type: String
    },
    onSave: {
      type: Function
    },
    editable: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      isEditing: false,
      editSvg: editSvg,
      approveSvg: approveSvg,
      closeSvg: closeSvg,
      plusSvg: plusSvg
    }
  },
  methods: {
    toggleEdit: function () {
      this.isEditing = !this.isEditing
    },
    save: function (document) {
      this.isEditing = false

      if (this.onSave) {
        this.onSave(document)
      }
    }
  }
}

export default baseComponent
