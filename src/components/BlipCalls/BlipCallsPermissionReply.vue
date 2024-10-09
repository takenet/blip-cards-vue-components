<template>
	<plain-text 
    :status="status"
    :length="length"
    :position="position"
    :document="text"
    :member-info="memberInfo"
		:date="date"
  />
</template>

<script>
import { default as base } from '../../mixins/baseComponent.js'

export default {
  name: 'blip-calls-permission-reply',
  mixins: [base],
  props: {
    document: {
      type: String,
      required: true
    },
    status: {
      type: String,
      default: ''
    },
    length: {
      type: Number,
      default: 532
    },
    memberInfo: {
      type: String,
      default: ''
    },
    acceptResponseText: {
      type: String,
      default: ''
    },
    rejectResponseText: {
      type: String,
      default: ''
    }
  },
  data: function () {
    return {
      text: undefined
    }
  },
  methods: {
    init: function () {
      this.text = this.document.response === 'Accept'
        ? this.acceptResponseText
        : this.rejectResponseText
    }
  }
}
</script>