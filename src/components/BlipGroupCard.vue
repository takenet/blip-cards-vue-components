<template>
  <div class="blip-container">
    <div class="blip-message-group" v-for="group in groupedDocuments" :key="group.id">
      <div :class="'blip-card-photo ' + group.position"  v-if="group.photo && group.position === 'left'" :style="{ bottom: '10px', width: '25px', height: '25px', 'background-image': 'url(&quot;' + group.photo + '&quot;)' }">
      </div>
      <div class="blip-card-group" :class="{'blip-container--with-photo': group.photo || (onFailedClickIcon && group.status === 'failed'), [group.position]: true}">
        <blip-card-group-member
          v-if="(group.memberName || group.memberPhoneNumber) && group.hasNotification"
          :position="group.position"
          :group-member="group.memberName ? group.memberName : group.memberPhoneNumber"
          :is-external-message="checkIsExternalMessage(group.msgs[0])"
          :is-group="true"
        />
        <blip-card
          v-for="message in group.msgs"
          :id="message.id"
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
          :class="messageClass(message) + isFailedMessageGroup(message,group)"
          :disable-link="disableLink"
          :on-audio-validate-uri="onAudioValidateUri"
          :readonly="readonly"
          :async-fetch-media="asyncFetchMedia"
          :on-async-fetch-session="onAsyncFetchSession"
          :transcription="transcription"
        />
        <blip-card-date
          v-if="group.date && group.hasNotification"
          :status="group.status"
          :position="group.position"
          :date="group.date"
          :failed-to-send-msg="failedMessageNotification(group.msgs[0].type)"
          :is-external-message="checkIsExternalMessage(group.msgs[0])"
          :external-message-text="externalMessageText"
          :is-group="true"
          :show-alert-icon="Boolean(onFailedClickIcon)"
        />
      </div>
      <span v-if="onFailedClickIcon && group.status === 'failed'">
        <bds-icon v-if="group.position === 'right'"
          name="info"
          theme="solid"
          :aria-label="translations.failedToSend"
          @click="onFailedClickIcon(group)"
          class="icon-message-failed">
        </bds-icon>
      </span>
      <span v-else>
        <div :class="'blip-card-photo ' + group.position" v-if="group.photo && group.position === 'right'" :style="{ bottom: '10px', right: '0%', width: '25px', height: '25px', 'background-image': 'url(&quot;' + group.photo + '&quot;)' }">
        </div>
      </span>
    </div>
  </div>
</template>

<script>
import { default as base } from '../mixins/baseComponent.js'
import { MessageTypesConstants } from '../utils/MessageTypesConstants.js'
import { checkIsExternalMessage } from '../utils/externalMessages.js'

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
    },
    onFailedClickIcon: {
      type: Function
    },
    asyncFetchMedia: {
      type: Function
    },
    onAsyncFetchSession: {
      type: Function
    },
    transcription: {
      type: Object,
      default: () => ({
        audioEnabled: false,
        callRecordingEnabled: false,
        limits: {},
        onAsyncTranscribe: (url) => {},
        onOpenMfeModal: (data) => {}
      })
    }
  },
  data() {
    return {
      photoMargin: 0,
      checkIsExternalMessage
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
        status: this.documents[0].status,
        memberName: 'Member Name',
        memberPhoneNumber: '5531999999999'
      }
      for (let i = 1; i < this.documents.length; i++) {
        const lastMessage = group.msgs[group.msgs.length - 1]
        const currentMessage = this.documents[i]
        const isLastMessageExternal = checkIsExternalMessage(lastMessage.document)
        const isCurrentMessageExternal = checkIsExternalMessage(currentMessage.document)
        if (this.compareMessages(lastMessage, currentMessage) && (isLastMessageExternal === isCurrentMessageExternal)) {
          group.msgs.push(currentMessage)
          group.date = currentMessage.date
          group.status = currentMessage.status
          group.reason = currentMessage.reason
          group.memberName = 'Member Name'
          group.memberPhoneNumber = '5531999999999'
        } else {
          groups.push(group)
          group = {
            msgs: [currentMessage],
            position: currentMessage.position,
            photo: currentMessage.photo,
            date: currentMessage.date,
            hasNotification: this.showNotification(currentMessage),
            status: currentMessage.status,
            reason: currentMessage.reason,
            memberName: 'Member Name',
            memberPhoneNumber: '5531999999999'
          }
        }
      }
      groups.push(group)
      return groups
    }
  },
  methods: {
    isFailedMessageGroup(message, group) {
      if (message.type === MessageTypesConstants.THREAD_SUMMARY) {
        return ''
      }
      return message.status === 'failed' && message.position === 'right' && group.hasNotification ? ' failed-message' : ''
    },
    failedMessageNotification(type) {
      if (type === MessageTypesConstants.THREAD_SUMMARY) {
        return this.translations.failedToLoadThreadSummary
      }
      return this.failedToSendMsg
    }
  }
}
</script>

<style lang="scss">
@import '../styles/common.scss';
@import '../styles/variables.scss';

.blip-message-group {
  position: relative;

  .icon-message-failed {
    bottom: 10px;
    right: 0%;
    width: 25px;
    height: 25px;
    color: $color-extended-red;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    cursor: pointer;
    position: absolute;
  }

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

      .description-wrapper {
        border-radius: 0 $hard-round $soft-round 0;
      }
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
      color: $color-content-disable;
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
