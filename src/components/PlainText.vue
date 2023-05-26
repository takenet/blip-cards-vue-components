<template>
  <div v-if="!isEditing">
    <div
      v-if="previewDocument.content != null && previewDocument.content.length > 0"
      class="blip-container plain-text"
      :class="isFailedMessage(status, position)"
    >
      <div :class="'bubble ' + position">
        <bds-button-icon v-if="deletable"
          class="editIco trashIco icon-button-margin icon-button-top"
          icon="trash"
          variant="delete"
          size="standard"
          v-on:click="trash(document)"
        ></bds-button-icon>
        <bds-button-icon v-if="editable"
          class="editIco icon-button-margin icon-button-top"
          icon="edit"
          variant="primary"
          size="short"
          v-on:click="toggleEdit"
        ></bds-button-icon> 
        <div v-if="!previewDocument.hasPreview" v-html="previewDocument.content"></div>
        <div v-else>
          <div v-show="!showContent" v-html="previewDocument.previewContent"></div>
          <transition name="slide-fade">
            <div v-show="showContent" v-html="previewDocument.content"></div>
          </transition>
          <a style="display: block;" v-show="!showContent" v-on:click="showContent = true">{{ showMoreMsg }}</a>
        </div>
      </div>

      <div class="flex" :class="'notification ' + position" v-if="date">
        <img v-if="this.status === 'waiting' && this.position === 'right'" :src="clockSvg">
        <img
          v-else-if="this.status === 'accepted' && this.position === 'right'"
          :src="checkSentSvg"
        >
        <img
          v-else-if="this.status === 'received' && this.position === 'right'"
          :src="doubleCheckReceivedSvg"
        >
        <img
          v-else-if="this.status === 'consumed' && this.position === 'right'"
          :src="doubleCheckReadSvg"
        >
        <div
          v-else-if="this.status === 'failed' && this.position === 'right'"
          class="failure"
        >{{ failedToSendMsg }}</div>
        <div>{{ date }}</div>
      </div>
    </div>
  </div>

  <div class="blip-container" v-else>
    <div :class="'bubble ' + position">
      <form novalidate v-on:submit.prevent>
        <bds-button-icon 
          class="btn saveIco closeIco"
          icon="close"
          variant="ghost"
          size="short"
          v-on:click="cancel()"
        ></bds-button-icon>
        <bds-button-icon 
          class="btn saveIco"
          icon="check"
          variant="primary"
          size="short"
          :disabled="errors.any()"
          v-on:click="saveText()"
        ></bds-button-icon>
        <div class="form-group">
          <textarea
            @keydown.enter="saveText($event)"
            name="text"
            v-auto-expand
            class="form-control"
            v-validate="'required'"
            :class="{'input-error': errors.has('text') }"
            v-model="text"
          ></textarea>
          <span v-show="errors.has('text')" class="help input-error">{{ errors.first('text') }}</span>
        </div>
        <button
          v-if="typeof onMetadataEdit === 'function'"
          class="define-metadata blip-plain-text-metadata"
          @click="editMetadata(fullDocument)"
        >{{ metadataButtonText }}</button>
      </form>
    </div>
  </div>
</template>

<script>
import { linkify, isFailedMessage } from '../utils/misc'
import { default as base } from '../mixins/baseComponent.js'

export default {
  name: 'plain-text',
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
    disableLink: {
      type: Boolean,
      default: false
    },
    showMoreMsg: {
      type: String,
      default: 'Ver mais'
    },
    failedToSendMsg: {
      type: String,
      default: 'Falha ao enviar a mensagem.'
    }
  },
  computed: {
    previewDocument: function() {
      const sanitizedDocument = this.sanitize(this.document)

      return {
        hasPreview: sanitizedDocument.length > this.length,
        previewContent: linkify(
          sanitizedDocument.substring(0, this.length - 3) + '...',
          this.disableLink
        ),
        content: linkify(sanitizedDocument, this.disableLink)
      }
    }
  },
  data: function() {
    return {
      text: undefined,
      showContent: undefined,
      isFailedMessage
    }
  },
  methods: {
    init: function() {
      this.text = this.document
      this.showContent = false
    },
    saveText: function($event) {
      if (this.errors.any() || ($event && $event.shiftKey)) {
        return
      }

      if ($event) {
        $event.stopPropagation()
        $event.preventDefault()
        $event.returnValue = false
      }

      this.showContent = false
      this.save(this.text)
    }
  }
}
</script>


<style lang="scss">
@import '../styles/variables.scss';

.plain-text .bubble {
  padding: $bubble-padding;
  word-wrap: break-word;
  min-width: auto !important;
  text-align: left;
}

.blip-plain-text-metadata {
  margin-top: -20px;
  padding: 0 10px 10px 0;
}
</style>
