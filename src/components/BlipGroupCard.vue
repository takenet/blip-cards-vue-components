<template>
  <div class="blip-container">
    <div class="blip-message-group" v-for="group in groupedDocuments" :key="group.id">
      <div :class="'blip-card-photo ' + group.position"  v-if="group.photo && group.position === 'left'" :style="{ bottom: '10px', width: '25px', height: '25px', 'background-image': 'url(&quot;' + group.photo + '&quot;)' }">
      </div>
      <div class="blip-card-group" :class="{'blip-container--with-photo': group.photo, [group.position]: true}">
        <blip-card
          v-for="message in group.msgs"
          :key="message.id"
          :document="message.document || message"
          :position="message.position"
          :date="message.date"
          :editing="editing"
          :hide-options="hideOptions || message.hideOptions"
          :on-save="onSave"
          :status="message.status"
          :on-deleted="onDeleted"
          :on-cancel="onCancel"
          :editable="editable"
          :deletable="deletable"
          :length="length"
          :on-selected="onSelected"
          :on-media-selected="onMediaSelected"
          :on-open-link="onOpenLink"
          :on-unsupported-type="onUnsupportedType"
          :on-location-error="onLocationError"
          :translations="translations"
          :class="messageClass(message) + (message.status === 'failed' && message.position === 'right' && group.hasNotification ? ' failed-message' : '')"
          :disable-link="disableLink"
          :on-audio-validate-uri="onAudioValidateUri"
          :readonly="readonly"
        />

        <div class="flex" :class="'group-notification ' + group.position" v-if="group.date && group.hasNotification">
          <img v-if="group.status === 'dispatched' && group.position === 'right'" class='dispatched' :src="clockSvg" draggable="false"/>
          <img v-else-if="group.status === 'accepted' && group.position === 'right'" class='accepted' :src="checkSentSvg" draggable="false"/>
          <img v-else-if="group.status === 'received' && group.position === 'right'" class='received' :src="doubleCheckReceivedSvg" draggable="false"/>
          <img v-else-if="group.status === 'consumed' && group.position === 'right'" class='consumed' :src="doubleCheckReadSvg" draggable="false"/>
          <div v-else-if="group.status === 'failed' && group.position === 'right'" class="failure">
            {{ failedToSendMsg }}
          </div>
          <span>{{ group.date }}</span>
        </div>
        <div class="flex" :class="'group-notification ' + group.position" v-else>
          <img v-if="group.status === 'dispatched' && group.position === 'right'" :src="clockSvg" draggable="false">
        </div>
      </div>
      <div :class="'blip-card-photo ' + group.position" v-if="group.photo && group.position === 'right'" :style="{ bottom: '10px', right: '0%', width: '25px', height: '25px', 'background-image': 'url(&quot;' + group.photo + '&quot;)' }">
      </div>
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
    compareMessages: {
      type: Function,
      default: (msg1, msg2) => msg1.position === msg2.position
    },
    showNotification: {
      type: Function,
      default: (msg1) => true
    },
    messageClass: {
      type: Function,
      default: () => {}
    },
    length: {
      type: Number
    },
    editing: {
      type: Boolean,
      default: false
    },
    hideOptions: {
      type: Boolean
    },
    onSelected: {
      type: Function
    },
    onMediaSelected: {
      type: Function
    },
    onOpenLink: {
      type: Function
    },
    onUnsupportedType: {
      type: Function
    },
    onLocationError: {
      type: Function
    },
    disableLink: {
      type: Boolean,
      default: false
    },
    failedToSendMsg: {
      type: String,
      default: 'Falha ao enviar a mensagem.'
    },
    translations: {
      type: Object,
      default: () => ({})
    },
    onAudioValidateUri: {
      type: Function
    },
    readonly: {
      type: Boolean
    }
  },
  data() {
    return {
      photoMargin: 0
    }
  },
  computed: {
    groupedDocuments() {
      let groups = []
      if (this.documents.length === 0) {
        return
      }
      let group = {
        msgs: [this.documents[0]],
        position: this.documents[0].position,
        photo: this.documents[0].photo,
        date: this.documents[0].date,
        hasNotification: this.showNotification(this.documents[0]),
        status: this.documents[0].status
      }
      for (let i = 1; i < this.documents.length; i++) {
        const message = this.documents[i]
        if (this.compareMessages(group.msgs[group.msgs.length - 1], message)) {
          group.msgs.push(message)
          group.date = message.date
          group.status = message.status
        } else {
          groups.push(group)

          group = {
            msgs: [message],
            position: message.position,
            photo: message.photo,
            date: message.date,
            hasNotification: this.showNotification(message),
            status: message.status
          }
        }
      }
      groups.push(group)
      return groups
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
  position: relative;

  .blip-card-photo {
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }

  .blip-card-group {
    margin-bottom: 20px;

    .blip-container:not(.document-select) {
      margin-bottom: 0;
      > .bubble {
        margin-bottom: 3px;
      }
    }

    // Bubble Right
    > :first-child :not(.unsuported-content) > .bubble.right {
      border-radius: $hard-round $hard-round $soft-round $hard-round;
    }
    > :not(:first-child) :not(.unsuported-content) > .bubble.right {
      border-radius: $hard-round $soft-round $soft-round $hard-round;
    }

    // Bubble Left
    > :first-child :not(.unsuported-content) > .bubble.left {
      border-radius: $hard-round $hard-round $hard-round $soft-round;
    }
    > :not(:first-child) :not(.unsuported-content) > .bubble.left {
      border-radius: $soft-round $hard-round $hard-round $soft-round;
    }

    //Bubble Middle
    > :first-child .bubble.middle {
      border-radius: $hard-round $hard-round $soft-round $soft-round;
    }

    > :not(:first-child) .bubble.middle {
      border-radius: $soft-round $soft-round $soft-round $soft-round;
    }

    // Date
    .notification {
      display: none !important;
    }

    .group-notification {
      font-size: 10px;
      color: $vue-light-gray;
      line-height: 14px;
      clear: both;
    }

    .group-notification.left {
      float: left;
    }

    .group-notification.right {
      float: right;
    }
  }
}
</style>
