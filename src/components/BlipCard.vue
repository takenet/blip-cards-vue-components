<template>
  <div v-if="editableDocument" class="blip-relative" @dblclick="editCard">
    <div
      :class="'blip-card-photo ' + position"
      v-if="photo && position === 'left'"
      :style="{
        top: photoMargin + 'px',
        width: '25px',
        height: '25px',
        'background-image': 'url(&quot;' + photo + '&quot;)'
      }"
    ></div>
    <div :class="{ 'blip-container--with-photo': photo, [position]: true }">
      <div class="blip-card-container">
        <plain-text
          v-if="document.metadata && document.metadata['#blip.payload.text']"
          class="blip-card"
          :status="status"
          :length="length"
          :position="position"
          :document="document.metadata['#blip.payload.text']"
          :member-info="memberInfo"
          :full-document="editableDocument"
          :date="date"
          :on-save="saveCard"
          :editable="editable"
          :on-deleted="deleteCard"
          :on-metadata-edit="isMetadataReady"
          :deletable="deletable"
          :editing="isCardEditing"
          :on-cancel="cancel"
          :is-external-message="externalMessage"
          :reply-callback="replyCallback"
          :translations="translations"
        />

        <plain-text
          v-else-if="document.type === 'text/plain'"
          class="blip-card"
          :status="status"
          :length="length"
          :position="position"
          :document="editableDocument.content"
          :member-info="memberInfo"
          :full-document="editableDocument"
          :date="date"
          :on-save="saveCard"
          :editable="editable"
          :on-deleted="deleteCard"
          :on-metadata-edit="isMetadataReady"
          :deletable="deletable"
          :editing="isCardEditing"
          :on-cancel="cancel"
          :disable-link="disableLink"
          :is-external-message="externalMessage"
          :external-message-text="translations.externalMessageText"
          :reply-callback="replyCallback"
          :translations="translations"
        />

        <media-link
          v-else-if="document.type === 'application/vnd.lime.media-link+json'"
          class="blip-card"
          @updated="updatedPhotoMargin"
          :failed-to-send-msg="translations.failedToSend"
          :aspect-ratio-msg="translations.aspectRatio"
          :supported-formats-msg="translations.supportedFormats"
          :file-url-msg="translations.fileUrl"
          :title-msg="translations.title"
          :image-uri-msg="translations.imageUri"
          :text-msg="translations.text"
          :video-uri-msg="translations.videoUri"
          :status="status"
          :position="position"
          :document="editableDocument.content"
          :member-info="memberInfo"          
          :full-document="editableDocument"
          :date="date"
          :on-media-selected="onMediaSelected"
          :on-save="saveCard"
          :editable="editable"
          :on-deleted="deleteCard"
          :on-metadata-edit="isMetadataReady"
          :deletable="deletable"
          :editing="isCardEditing"
          :on-cancel="cancel"
          :on-audio-validate-uri="onAudioValidateUri"
          :async-fetch-media="asyncFetchMedia"
          :is-external-message="externalMessage"
          :external-message-text="translations.externalMessageText"
          :translations="translations"
          :transcription="transcription"
          :reply-callback="replyCallback"
          :on-image-selected="onImageSelected"
        />

        <document-select
          v-else-if="
            document.type === 'application/vnd.lime.document-select+json'
          "
          class="blip-card"
          :failed-to-send-msg="translations.failedToSend"
          :apply-msg="translations.apply"
          :cancel-msg="translations.cancel"
          :set-payload-msg="translations.setPayload"
          :add-button-msg="translations.addButton"
          :text-msg="translations.text"
          :link-msg="translations.link"
          :aspect-ratio-msg="translations.aspectRatio"
          :show-more-msg="translations.showMore"
          :supported-formats-msg="translations.supportedFormats"
          :image-uri-msg="translations.imageUri"
          :title-msg="translations.title"
          :description-msg="translations.description"
          :uri-msg="translations.uri"
          :postback-mimetype-msg="translations.postbackMimetype"
          :postback-value-msg="translations.postbackValue"
          :status="status"
          :length="length"
          :position="position"
          :document="editableDocument.content"
          :full-document="editableDocument"
          :date="date"
          :on-selected="onSelected"
          :on-save="saveCard"
          :editable="editable"
          :is-external-message="externalMessage"
          :external-message-text="translations.externalMessageText"
          :translations="translations"
          :on-open-link="onOpenLink"
          :on-deleted="deleteCard"
          :on-metadata-edit="isMetadataReady"
          :deletable="deletable"
          :editing="isCardEditing"
          :on-cancel="cancel"
        />

        <collection
          v-else-if="document.type === 'application/vnd.lime.collection+json'"
          class="blip-card"
          :failed-to-send-msg="translations.failedToSend"
          :status="status"
          :length="length"
          :position="position"
          :document="editableDocument.content"
          :full-document="editableDocument"
          :date="date"
          :on-selected="onSelected"
          :on-save="saveCard"
          :editable="editable"
          :on-open-link="onOpenLink"
          :on-deleted="deleteCard"
          :on-metadata-edit="isMetadataReady"
          :deletable="deletable"
          :is-external-message="externalMessage"
          :external-message-text="translations.externalMessageText"
          :translations="translations"
          :editing="isCardEditing"
          :on-cancel="cancel"
          :reply-callback="replyCallback"
        />

        <blip-select
          v-else-if="document.type === 'application/vnd.lime.select+json'"
          class="blip-card"
          :failed-to-send-msg="translations.failedToSend"
          :add-option-msg="translations.addOption"
          :add-button-msg="translations.addButton"
          :not-enough-options-msg="translations.notEnoughOptions"
          :text-msg="translations.text"
          :set-payload-msg="translations.setPayload"
          :apply-msg="translations.apply"
          :cancel-msg="translations.cancel"
          :postback-mimetype-msg="translations.postbackMimetype"
          :postback-value-msg="translations.postbackValue"
          :status="status"
          :position="position"
          :document="editableDocument.content"
          :full-document="editableDocument"
          :date="date"
          :on-selected="onSelected"
          :on-save="saveCard"
          :editable="editable"
          :on-deleted="deleteCard"
          :on-metadata-edit="isMetadataReady"
          :deletable="deletable"
          :is-external-message="externalMessage"
          :external-message-text="translations.externalMessageText"
          :translations="translations"
          :hide-options="hideOptions"
          :editing="isCardEditing"
          :on-cancel="cancel"
          :readonly="readonly"
        />

        <web-link
          class="blip-card"
          v-else-if="document.type === 'application/vnd.lime.web-link+json'"
          :page-url-msg="translations.pageUrl"
          :title-msg="translations.title"
          :description-msg="translations.description"
          :failed-to-send-msg="translations.failedToSend"
          :status="status"
          :position="position"
          :document="editableDocument.content"
          :full-document="editableDocument"
          :date="date"
          :on-save="saveCard"
          :editable="editable"
          :on-open-link="onOpenLink"
          :on-deleted="deleteCard"
          :on-metadata-edit="isMetadataReady"
          :deletable="deletable"
          :editing="isCardEditing"
          :on-cancel="cancel"
          :is-external-message="externalMessage"
          :external-message-text="translations.externalMessageText"
          :translations="translations"
          :reply-callback="replyCallback"
          :transcription="transcription"
        />

        <survey
          class="blip-card"
          v-else-if="
            document.type === 'application/vnd.lime.satisfaction-survey+json'
          "
          :failed-to-send-msg="translations.failedToSend"
          :introduction-msg="translations.introduction"
          :status="status"
          :on-save="saveCard"
          :editable="editable"
          :on-deleted="deleteCard"
          :document="editableDocument.content"
          :deletable="deletable"
          :editing="isCardEditing"
          :on-cancel="cancel"
        />

        <location
          class="blip-card"
          v-else-if="document.type === 'application/vnd.lime.location+json'"
          :translations="translations"
          :status="status"
          :position="position"
          :document="editableDocument.content"
          :full-document="editableDocument"
          :date="date"
          :on-save="saveCard"
          :editable="editable"
          :on-deleted="deleteCard"
          :on-metadata-edit="isMetadataReady"
          :deletable="deletable"
          :editing="isCardEditing"
          :on-cancel="cancel"
          :is-external-message="externalMessage"
          :reply-callback="replyCallback"
        />

        <request-location
          v-else-if="
            document.type === 'application/vnd.lime.input+json' &&
              document.content.validation &&
              document.content.validation.type ===
                'application/vnd.lime.location+json'
          "
          class="blip-card"
          :failed-to-send-msg="translations.failedToSend"
          :show-more-msg="translations.showMore"
          :button-label-msg="translations.RequestLocationButtonLabel"
          :status="status"
          :position="position"
          :document="editableDocument.content"
          :full-document="editableDocument"
          :date="date"
          :on-selected="onSelected"
          :on-save="saveCard"
          :editable="editable"
          :on-deleted="deleteCard"
          :on-metadata-edit="isMetadataReady"
          :deletable="deletable"
          :hide-options="hideOptions"
          :editing="isCardEditing"
          :on-cancel="cancel"
          :is-external-message="externalMessage"
          :external-message-text="translations.externalMessageText"
          :translations="translations"
          :on-location-error="onLocationError"
          :reply-callback="replyCallback"
        />

        <lime-input
          v-else-if="document.type === 'application/vnd.lime.input+json'"
          class="blip-card"
          :status="status"
          :position="position"
          :document="editableDocument.content"
          :full-document="editableDocument"
          :date="date"
          :on-selected="onSelected"
          :on-save="saveCard"
          :editable="editable"
          :on-deleted="deleteCard"
          :on-metadata-edit="isMetadataReady"
          :deletable="deletable"
          :hide-options="hideOptions"
          :editing="isCardEditing"
          :on-cancel="cancel"
          :on-location-error="onLocationError"
        />

        <chat-state
          v-else-if="document.type === 'application/vnd.lime.chatstate+json'"
          class="blip-card"
          :ms-to-wait-msg="translations.msToWait"
          :status="status"
          :position="position"
          :document="editableDocument.content"
          :full-document="editableDocument"
          :date="date"
          :on-save="saveCard"
          :editable="editable"
          :on-deleted="deleteCard"
          :on-metadata-edit="isMetadataReady"
          :deletable="deletable"
          :editing="isCardEditing"
          :on-cancel="cancel"
        />

        <blip-redirect
          v-else-if="document.type === 'application/vnd.lime.redirect+json'"
          class="blip-card"
          :status="status"
          :position="position"
          :document="editableDocument.content"
          :date="date"
          :on-save="saveCard"
          :editable="editable"
          :on-deleted="deleteCard"
          :deletable="deletable"
          :editing="isCardEditing"
          :on-cancel="cancel"
        />

        <ticket
          v-else-if="document.type === 'application/vnd.iris.ticket+json'"
          class="blip-card"
          :waiting-msg="translations.userWaitingAttendance"
          :closed-attendant-msg="translations.closedByAttendant"
          :closed-client-msg="translations.closedByClient"
          :status="status"
          :position="position"
          :document="editableDocument.content"
          :date="date"
          :on-save="saveCard"
          :editable="editable"
          :on-deleted="deleteCard"
          :deletable="deletable"
          :editing="isCardEditing"
          :on-cancel="cancel"
        />

        <blip-calls
          v-else-if="document.type === 'application/vnd.iris.calls.media+json'"
          class="blip-card"
          :start-call-msg="translations.startCallMsg"
          :end-call-msg="translations.endCallMsg"
          :video-msg="translations.videoMsg"
          :audio-msg="translations.audioMsg"
          :video-call-msg="translations.videoCallMsg"
          :voice-call-msg="translations.voiceCallMsg"
          :success-status-msg="translations.successStatusMsg"
          :failed-status-msg="translations.failedStatusMsg"
          :cancel-status-msg="translations.cancelStatusMsg"
          :not-answered-status-msg="translations.notAnsweredStatusMsg"
          :preparing-recording-msg="translations.preparingRecordingMsg"
          :load-recording-msg="translations.loadRecordingMsg"
          :failed-to-send-msg="translations.failedToSend"
          :download-recording-label="translations.downloadRecordingLabel"
          :transcribe-recording-label="translations.transcribeRecordingLabel"
          :status="status"
          :position="position"
          :document="editableDocument.content"
          :full-document="editableDocument"
          :date="date"
          :on-save="saveCard"
          :editable="editable"
          :on-deleted="deleteCard"
          :deletable="deletable"
          :editing="isCardEditing"
          :on-cancel="cancel"
          :on-media-validate-uri="onAudioValidateUri"
          :async-fetch-media="asyncFetchMedia"
          :on-async-fetch-session="onAsyncFetchSession"
          :transcription="transcription"
        />

        <blip-calls-permission-reply
          v-else-if="document.type === 'application/vnd.iris.calls.customer-permission+json'"
          class="blip-card"
          :accept-response-text="translations.callsPermissionReplyAcceptText"
          :reject-response-text="translations.callsPermissionReplyRejectText"
          :status="status"
          :length="length"
          :position="position"
          :document="editableDocument.content"
          :full-document="editableDocument"
          :member-info="memberInfo"
          :date="date"
        />

        <template-content
          v-else-if="document.content.type === 'template-content'"
          class="blip-card"
          :failed-to-send-msg="translations.failedToSend"
          :message-template-title="translations.messageTemplate ? translations.messageTemplate + document.content.template.name : translations.unsupportedContent"
          :content-template-name="document.content.template.name"
          :on-failed-click-icon="onFailedClickIcon"
          :status="status"
          :position="position"
          :document="editableDocument.content"
          :full-document="editableDocument"
          :date="date"
          :on-save="saveCard"
          :editable="editable"
          :on-deleted="deleteCard"
          :deletable="deletable"
          :editing="isCardEditing"
          :on-cancel="cancel"
          :disable-link="disableLink"
          :reply-callback="replyCallback"
        />

        <unsuported-content
          v-else-if="document.content.type === 'template'"
          class="blip-card"
          :from-message-template="true"
          :failed-to-send-msg="translations.failedToSend"
          :unsupported-content-msg="
            translations.messageTemplate
              ? translations.messageTemplate + document.content.template.name
              : translations.unsupportedContent
          "
          :on-failed-click-icon="onFailedClickIcon"
          :status="status"
          :position="position"
          :document="editableDocument.content"
          :full-document="editableDocument"
          :date="date"
          :on-save="saveCard"
          :editable="editable"
          :on-deleted="deleteCard"
          :deletable="deletable"
          :editing="isCardEditing"
          :on-cancel="cancel"
          :is-external-message="externalMessage"
          :external-message-text="translations.externalMessageText"
          :reply-callback="replyCallback"
        />

        <contact
          v-else-if="document.type === 'application/vnd.lime.contact+json'"
          class="blip-card"
          :failed-to-send-msg="translations.failedToSend"
          :status="status"
          :position="position"
          :document="editableDocument.content"
          :full-document="editableDocument"
          :date="date"
          :on-save="saveCard"
          :editable="editable"
          :on-deleted="deleteCard"
          :on-metadata-edit="isMetadataReady"
          :deletable="deletable"
          :editing="isCardEditing"
          :on-cancel="cancel"
          :phone-label="translations.phoneLabel"
          :mail-label="translations.mailLabel"
          :address-label="translations.addressLabel"
          :is-external-message="externalMessage"
          :external-message-text="translations.externalMessageText"
          :reply-callback="replyCallback"
        />

        <application-json
          v-else-if="document.type === 'application/json'"
          class="blip-card"
          @updated="updatedPhotoMargin"
          :failed-to-send-msg="translations.failedToSend"
          :status="status"
          :position="position"
          :document="editableDocument.content"
          :full-document="editableDocument"
          :date="date"
          :on-save="saveCard"
          :editable="editable"
          :on-deleted="deleteCard"
          :on-metadata-edit="isMetadataReady"
          :deletable="deletable"
          :editing="isCardEditing"
          :on-cancel="cancel"
          :translations="translations"
        />

        <reply-card
          v-else-if="document.type === MessageTypesConstants.REPLY_MESSAGE"
          class="blip-card"
          :failed-to-send-msg="translations.failedToSend"
          :updatedPhotoMargin="updatedPhotoMargin"
          :status="status"
          :position="position"
          :document="editableDocument.content"
          :full-document="editableDocument"
          :date="date"
          :on-media-selected="onMediaSelected"
          :on-save="saveCard"
          :editable="editable"
          :on-deleted="deleteCard"
          :on-metadata-edit="isMetadataReady"
          :deletable="deletable"
          :editing="isCardEditing"
          :on-cancel="cancel"
          :translations="translations"
          :async-fetch-media="asyncFetchMedia"
          :aspect-ratio-msg="translations.aspectRatio"
          :supported-formats-msg="translations.supportedFormats"
          :file-url-msg="translations.fileUrl"
          :title-msg="translations.title"
          :image-uri-msg="translations.imageUri"
          :text-msg="translations.text"
          :video-uri-msg="translations.videoUri"
          :on-audio-validate-uri="onAudioValidateUri"
          :reply-text="translations.replyText"
          :is-external-message="externalMessage"
          :external-message-text="translations.externalMessageText"
          :reply-callback="replyCallback"
          :scroll-to-message-by-id="scrollToMessageById"
        />

        <reaction-card
          v-else-if="document.type === 'application/vnd.lime.reaction+json'"
          class="blip-card"
          :failed-to-send-msg="translations.failedToSend"
          :updatedPhotoMargin="updatedPhotoMargin"
          :status="status"
          :position="position"
          :document="editableDocument.content"
          :full-document="editableDocument"
          :date="date"
          :on-media-selected="onMediaSelected"
          :on-save="saveCard"
          :editable="editable"
          :on-deleted="deleteCard"
          :on-metadata-edit="isMetadataReady"
          :deletable="deletable"
          :editing="isCardEditing"
          :on-cancel="cancel"
          :translations="translations"
          :async-fetch-media="asyncFetchMedia"
          :aspect-ratio-msg="translations.aspectRatio"
          :supported-formats-msg="translations.supportedFormats"
          :file-url-msg="translations.fileUrl"
          :title-msg="translations.title"
          :image-uri-msg="translations.imageUri"
          :text-msg="translations.text"
          :video-uri-msg="translations.videoUri"
          :on-audio-validate-uri="onAudioValidateUri"
          :reaction-text="translations.reactionText"
          :removed-reaction-text="translations.removedReactionText"
          :is-external-message="externalMessage"
          :external-message-text="translations.externalMessageText"
        />

        <copy-and-paste-card
          v-else-if="document.type === 'application/vnd.lime.copy-and-paste+json'"
          class="blip-card"
          :failed-to-send-msg="translations.failedToSend"
          :status="status"
          :position="position"
          :document="editableDocument.content"
          :full-document="editableDocument"
          :date="date"
          :on-media-selected="onMediaSelected"
          :on-save="saveCard"
          :editable="editable"
          :on-deleted="deleteCard"
          :on-metadata-edit="isMetadataReady"
          :deletable="deletable"
          :editing="isCardEditing"
          :on-cancel="cancel"
          :translations="translations"
          :requiredFieldText="translations.requiredFieldText"
          :copyContentText="translations.copyContentText"
          :cancelText="translations.cancel"
          :saveText="translations.save"
          :headerMessage="translations.headerMessage"
          :bodyMessage="translations.bodyMessage"
          :footerMessage="translations.footerMessage"
          :copyButtonMessage="translations.copyButtonMessage"
          :copyContentMessage="translations.copyContentMessage"
        />

        <thread-summary
          v-else-if="
            document.type === MessageTypesConstants.THREAD_SUMMARY
          "
          class="blip-card"
          :failed-To-Load-thread-summary="translations.failedToLoadThreadSummary"
          :show-more-msg="translations.showMore"
          :status="status"
          :position="position"
          :document="editableDocument.content"
          :full-document="editableDocument"
          :translations="translations"
          :date="date"
          :on-save="saveCard"
          :editable="editable"
          :on-deleted="deleteCard"
          :on-metadata-edit="isMetadataReady"
          :deletable="deletable"
          :editing="isCardEditing"
          :on-cancel="cancel"
          :disable-link="disableLink"
        />

        <blip-external
          v-else-if="document.type === MessageTypesConstants.BLIP_EXTERNAL"
          class="blip-card"
          @updated="updatedPhotoMargin"
          :failed-to-send-msg="translations.failedToSend"
          :aspect-ratio-msg="translations.aspectRatio"
          :supported-formats-msg="translations.supportedFormats"
          :file-url-msg="translations.fileUrl"
          :title-msg="translations.title"
          :image-uri-msg="translations.imageUri"
          :text-msg="translations.text"
          :video-uri-msg="translations.videoUri"
          :status="status"
          :position="position"
          :document="editableDocument.content"
          :member-info="memberInfo"          
          :full-document="editableDocument"
          :date="date"
          :on-media-selected="onMediaSelected"
          :on-save="saveCard"
          :editable="editable"
          :on-deleted="deleteCard"
          :on-metadata-edit="isMetadataReady"
          :deletable="deletable"
          :editing="isCardEditing"
          :on-cancel="cancel"
          :on-audio-validate-uri="onAudioValidateUri"
          :async-fetch-media="asyncFetchMedia"
          :is-external-message="externalMessage"
          :external-message-text="translations.externalMessageText"
          :translations="translations"
          :transcription="transcription"
          :reply-callback="replyCallback"
        />     
           
        <unsuported-content
          v-else
          class="blip-card"
          :failed-to-send-msg="translations.failedToSend"
          :unsupported-content-msg="translations.unsupportedContent"
          :position="position"
          :document="editableDocument.content"
          :date="date"
          :on-save="saveCard"
          :editable="editable"
          :on-deleted="deleteCard"
          :deletable="deletable"
          :editing="isCardEditing"
          :on-cancel="cancel"
          :reply-callback="replyCallback"
          :full-document="editableDocument"
          :translations="translations"
        />
      </div>
      <div
        :class="'blip-card-photo ' + position"
        v-if="photo && position === 'right'"
        :style="{
          top: photoMargin + 'px',
          right: '0%',
          width: '25px',
          height: '25px',
          'background-image': 'url(&quot;' + photo + '&quot;)'
        }"
      ></div>
    </div>
  </div>
</template>

<script>
import { default as base } from '../mixins/baseComponent.js'
import { MessageTypesConstants } from '../utils/MessageTypesConstants.js'
import { checkIsExternalMessage } from '../utils/externalMessages.js'
import { getMemberInfo } from '../utils/memberUtils.js'

const supportedRepliedTypes = [
  MessageTypesConstants.TEXT_MESSAGE,
  MessageTypesConstants.MEDIALINK_MESSAGE,
  MessageTypesConstants.LOCATION
]

export default {
  name: 'blip-card',
  mixins: [base],
  props: {
    status: {
      type: String,
      default: ''
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
    onMediaSelected: {
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
    },
    disableLink: {
      type: Boolean,
      default: false
    },
    translations: {
      type: Object,
      default: () => ({})
    },
    onAudioValidateUri: {
      type: Function
    },
    readonly: {
      type: Boolean,
      default: false
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
      type: Object
    },
    replyCallback: {
      type: Function
    },
    scrollToMessageById: {
      type: Function
    },
    onImageSelected: {
      type: Function
    }
  },
  data() {
    return {
      editableDocument: this.document,
      isCardEditing: this.editing,
      photoMargin: 0
    }
  },
  watch: {
    document: function() {
      this.editableDocument = this.document
    }
  },
  updated() {
    this.updatedPhotoMargin()
    this.resolveUnsupportedRepliedType()
  },
  mounted() {
    this.updatedPhotoMargin()
    this.resolveUnsupportedRepliedType()
  },
  methods: {
    editCard() {
      if (!this.isCardEditing && this.editable) {
        this.isCardEditing = true
      }
    },
    cancel() {
      this.isCardEditing = false
    },
    removeEmpty(obj) {
      Object.keys(obj).forEach((key) => {
        if (obj[key] && typeof obj[key] === 'object') {
          this.removeEmpty(obj[key])
        } else if (obj[key] == null) {
          delete obj[key]
        }
      })

      return obj
    },
    deleteCard(document) {
      this.trash(this.editableDocument)
      this.editableDocument = null
    },
    saveCard(document) {
      this.isCardEditing = false
      this.editableDocument.content = document
      this.save(this.editableDocument)
    },
    updatedPhotoMargin() {
      this.photoMargin = this.getPhotoMargin()
    },
    getPhotoMargin() {
      if (!this.editableDocument) return
      const element = this.$el

      let bubbleHeight = 0
      const relatives = element.querySelectorAll('.blip-relative') // Element has relatives if is a collection
      if (relatives.length > 0) {
        relatives.forEach((relative) => {
          bubbleHeight += relative.offsetHeight
        })
        bubbleHeight -= 10 // Time height
      } else {
        bubbleHeight = element.querySelector('.bubble')
          ? element.querySelector('.bubble').offsetHeight
          : 0
      }
      const photoHeight = 25

      return bubbleHeight - photoHeight
    },
    resolveUnsupportedRepliedType() {
      if (this.document.type === MessageTypesConstants.REPLY_MESSAGE) {
        const { replied } = this.document.content
        let isSupportedRepliedType = supportedRepliedTypes.includes(
          replied.type
        )

        if (!isSupportedRepliedType) {
          this.document.type = replied.type
          this.document.content = replied.value
        }
      }
    },
    unsupportedType(document) {
      if (this.onUnsupportedType) {
        this.onUnsupportedType(this.editableDocument)
      }
    }
  },
  computed: {
    MessageTypesConstants() {
      return MessageTypesConstants
    },
    externalMessage() {
      return this.isExternalMessage || checkIsExternalMessage(this.document)
    },
    memberInfo() {
      return getMemberInfo(this.document)
    },
    customer() {
      return 'Jão'
    }
  }
}
</script>

<style lang="scss">
@import '../styles/common.scss';
@import '../styles/variables.scss';

.blip-container--with-photo {
  &.left {
    margin-left: 35px;
  }

  &.right {
    margin-right: 55px;
  }
}

.blip-card-photo {
  position: absolute;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
  background-size: 100%;

  &.left {
    margin-right: 10px;
  }

  &.right {
    margin-right: 20px;
  }
}
</style>
