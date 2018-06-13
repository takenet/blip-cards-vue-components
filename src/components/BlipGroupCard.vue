<template>
  <div>
    <div class="blip-message-group" v-for="group in groupedDocuments" :key="group.id">
      <blip-card
        v-for="message in group"
        :key="message.id"
        :document="message.document || message"
        :position="message.position"
        :date="message.date"
        :editing="message.editing"
        :hide-options="message.hideOptions"
        :photo="message.photo"
        :on-save="onSave"
        :on-deleted="onDeleted"
        :on-cancel="onCancel"
        :editable="editable"
        :deletable="deletable"
        :length="length"
        :on-selected="onSelected"
        :on-open-link="onOpenLink"
        :on-unsupported-type="onUnsupportedType"
        :on-location-error="onLocationError"
        :class="messageClass(message)"
        />
    </div>
  </div>
</template>

<script>
import { default as base } from '../mixins/baseComponent.js'

export default {
  name: 'blip-group-card',
  mixins: [base],
  props: {
    documents: {
      type: Array,
      required: true
    },
    groupMethod: {
      type: Function
    },
    messageClass: {
      type: Function
    },
    length: {
      type: Number
    },
    hideOptions: {
      type: Boolean,
      default: false
    },
    onSelected: {
      type: Function
    },
    onOpenLink: {
      type: Function
    },
    photo: {},
    onUnsupportedType: {
      type: Function
    },
    onLocationError: {
      type: Function
    }
  },
  computed: {
    groupedDocuments: function () {
      let messages = []
      if (!this.groupMethod) {
        let group = []
        this.documents.forEach(msg => {
          if (group.length === 0 || group[group.length - 1].position === msg.position) {
            group.push(msg)
          } else {
            messages.push(group)
            group = [msg]
          }
        })
        messages.push(group)
      } else {
        messages = this.groupMethod(this.documents)
      }
      return messages
    }
  }
}
</script>

<style lang="scss">
@import '../styles/common.scss';
@import '../styles/variables.scss';
$soft-round: 2px;
$hard-round: 13px;

.blip-message-group {
  .blip-container {
    margin-bottom: 0;
  }
  >:not(:last-child) .bubble.right {
    border-radius: $hard-round $soft-round $soft-round $hard-round;
  }
  >:last-child .bubble.right {
    border-radius: $hard-round $soft-round $hard-round $hard-round;
  }
  >:not(:first-child) .bubble.left {
    border-radius: $soft-round $hard-round $hard-round $soft-round;
  }
  >:first-child .bubble.left {
    border-radius: $hard-round $hard-round $hard-round $soft-round;
  }
  >:not(:last-child) .notification {
    display: none !important;
  }
  >:last-child .notification {
    display: block !important;
  }
}
</style>
