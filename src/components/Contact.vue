<template>
  <div v-if="!isEditing">
    <div
      v-if="this.document != null"
      class="blip-container contact"
      :class="isFailedMessage(status, position)"
    >
      <div :class="'bubble ' + position">
        <div v-if="deletable" class="editIco trashIco" @click="trash(document)">
          <img :src="trashSvg">
        </div>
        <div v-if="editable" class="editIco" @click="toggleEdit">
          <img :src="editSvg">
        </div>

        <div>
          <div v-if="this.document.name" class="mb-name">
            <bds-typo variant="fs-16" bold="semi-bold">{{ sanitizeText(this.document.name) | limitContentFilter(30) }}</bds-typo>
          </div>
          <div v-if="this.document.cellPhoneNumber" class="mb-infos ml-infos">
            <bds-typo tag="p" variant="fs-12" bold="regular">{{ phoneLabel }}</bds-typo>
            <bds-typo tag="p" variant="fs-16" bold="regular">{{ sanitizeText(this.document.cellPhoneNumber) }}</bds-typo>
          </div>
          <div v-if="this.document.email" class="mb-infos ml-infos">
            <bds-typo tag="p" variant="fs-12" bold="regular">{{ mailLabel }}</bds-typo>
            <bds-typo tag="p" variant="fs-16" bold="regular">{{ sanitizeText(this.document.email) }}</bds-typo>
          </div>
          <div v-if="this.document.address" class="mb-infos ml-infos">
            <bds-typo tag="p" variant="fs-12" bold="regular">{{ addressLabel }}</bds-typo>
            <bds-typo tag="p" variant="fs-16" bold="regular">{{ sanitizeText(this.document.address) }}</bds-typo>
          </div>
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
          class="define-metadata blip-contact-metadata"
          @click="editMetadata(fullDocument)"
        >{{ metadataButtonText }}</button>
      </form>
    </div>
  </div>
</template>

<script>
import { isFailedMessage } from '../utils/misc'
import { default as base } from '../mixins/baseComponent.js'

export default {
  name: 'contact',
  mixins: [base],
  props: {
    document: {
      type: Object,
      required: true
    },
    status: {
      type: String,
      default: ''
    },
    failedToSendMsg: {
      type: String,
      default: 'Falha ao enviar a mensagem.'
    },
    phoneLabel: {
      type: String,
      default: 'Telefone'
    },
    mailLabel: {
      type: String,
      default: 'E-mail'
    },
    addressLabel: {
      type: String,
      default: 'Endereço'
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
      this.text = JSON.stringify(this.document)
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
      this.save(JSON.parse(this.text))
    },
    sanitizeText: function(text) {
      return this.sanitize(text)
    }
  }
}
</script>


<style lang="scss">
@import '../styles/variables.scss';

.contact .bubble {
  padding: $bubble-padding;
  word-wrap: break-word;
  min-width: auto !important;
  text-align: left;
}

.blip-contact-metadata {
  margin-top: -20px;
  padding: 0 10px 10px 0;
}

.mb-name {
  margin-bottom: 16px;
}

.mb-infos {
  margin-bottom: 4px;
}

.ml-infos {
  margin-left: 8px;
}
</style>
