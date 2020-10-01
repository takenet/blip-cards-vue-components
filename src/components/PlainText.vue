<template>
  <div v-if="!isEditing">
    <div
      v-if="previewDocument.content != null && previewDocument.content.length > 0"
      class="blip-container plain-text"
      :class="isFailedMessage(status, position)"
    >
      <div :class="'bubble ' + position">
        <div v-if="deletable" class="editIco trashIco" @click="trash(document)">
          <img :src="trashSvg">
        </div>
        <div v-if="editable" class="editIco" @click="toggleEdit">
          <img :src="editSvg">
        </div>

        <div v-if="!previewDocument.hasPreview" v-html="previewDocument.content"></div>
        <div v-else>
          <div v-show="!showContent" v-html="previewDocument.previewContent"></div>
          <transition name="slide-fade">
            <div v-show="showContent" v-html="previewDocument.content"></div>
          </transition>
          <a style="display: block;" v-show="!showContent" v-on:click="showContent = true">Ver mais</a>
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
        >Falha ao enviar a mensagem.</div>
        <div>{{ date }}</div>
      </div>
    </div>
  </div>

  <div class="blip-container" v-else>
    <div :class="'bubble ' + position">
      <form novalidate v-on:submit.prevent>
        <button class="btn saveIco closeIco" @click="cancel()">
          <img :src="closeSvg">
        </button>
        <button
          type="submit"
          class="btn saveIco"
          @click="saveText()"
          :class="{'is-disabled': errors.any() }"
        >
          <img :src="approveSvg">
        </button>
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
    }
  },
  computed: {
    previewDocument: function() {
      console.log(`document: ${this.document}`)
      const sanitizedDocument = this.sanitize(this.document)
      console.log(`sanitizedDocument: ${sanitizedDocument}`)
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
