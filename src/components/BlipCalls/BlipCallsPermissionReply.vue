<template>
	<plain-text
    :status="status"
    :length="length"
    :position="position"
    :document="text"
    :full-document="document"
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
    acceptResponseText: {
      type: String,
      required: true
    },
    rejectResponseText: {
      type: String,
      required: true
    },
    status: {
      type: String
    },
    length: {
      type: Number
    },
    memberInfo: {
      type: String
    }
  },
  data: function () {
    return {
      text: undefined
    }
  },
  methods: {
    init: function () {
      this.text = this.document.response.toLowerCase() === 'accept'
        ? this.acceptResponseText
        : this.rejectResponseText
    }
  }
}
</script>