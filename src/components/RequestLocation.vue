<template>
  <div v-if="!isEditing" class="blip-container request-location" :class="isFailedMessage(status, position)">
    <bds-grid :direction="position === 'left' ? 'row' : 'row-reverse'" justifyContent="space-between" gap="1" align-items="center">
      <div :class="`bubble ${position}`">
        <bds-button-icon v-if="deletable"
          class="editIco trashIco icon-button-margin icon-button-top"
          icon="trash"
          variant="delete"
          size="short"
          v-on:click="trash(document)"
        ></bds-button-icon>
        <bds-button-icon v-if="editable"
          class="editIco icon-button-margin icon-button-top"
          icon="edit"
          variant="primary"
          size="short"
          v-on:click="toggleEdit"
        ></bds-button-icon>
        <div v-if="!previewDocument.hasPreview" class="label-wrappper">
          <span>{{ previewDocument.content }}</span>
        </div>
        <div v-else class="label-wrapper">
          <div v-show="!showContent">
            <span>{{ previewDocument.previewContent }}</span>
          </div>
          <transition name="slide-fade">
            <div v-show="showContent">
              <span>{{ previewDocument.content }}</span>
            </div>
          </transition>
          <a style="display: block;" v-show="!showContent" v-on:click="showContent = true">{{ showMoreMsg }}</a>
        </div>
      </div>
      <blip-card-reply
        :document="fullDocument"
        :reply-callback="replyCallback"
      />
    </bds-grid>

    <div class="flex" v-if="date" :class="'notification ' + position">
      <img v-if="this.status === 'waiting' && this.position === 'right'" :src="clockSvg">
      <img v-else-if="status === 'accepted' && this.position === 'right'" :src="checkSentSvg"/>
      <img v-else-if="status === 'received' && this.position === 'right'" :src="doubleCheckReceivedSvg"/>
      <img v-else-if="status === 'consumed' && this.position === 'right'" :src="doubleCheckReadSvg"/>
      <div class="failure" v-else-if="this.status === 'failed' && this.position === 'right'">
          {{ failedToSendMsg }}
      </div>
      {{ date }}
    </div>

    <transition name="fade">
      <div v-if="!hide" class="options">
        <ul>
          <li @click="select()">
            <div class="wrapper disable-selection">
              <div class="locationIcon">
                <bds-icon name="localization"></bds-icon>
              </div>
              <div class="text">
                <span v-text="buttonLabelMsg"></span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </transition>
  </div>
  <div v-else>
    <div class="blip-container">
      <div :class="`bubble ${position}`">
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
            v-on:click="saveLocation()"
          ></bds-button-icon>
          <div class="form-group">
            <textarea @keydown.enter="saveLocation($event)" name="text" class="form-control" v-validate="'required'" :class="{'input-error': errors.has('text') }" v-model="text"></textarea>
            <span v-show="errors.has('text')" class="help input-error">{{ errors.first('text') }}</span>
          </div>
          <button v-if="typeof onMetadataEdit === 'function'" class="define-metadata blip-request-location-metadata" @click="editMetadata(fullDocument)">
            {{ metadataButtonText }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>


<script>
import { linkify, isFailedMessage } from '../utils/misc'
import { default as base } from '../mixins/baseComponent.js'

export default {
  name: 'request-location',
  mixins: [base],
  props: {
    hideOptions: {
      type: Boolean,
      default: false
    },
    onSelected: {
      type: Function
    },
    status: {
      type: String,
      default: ''
    },
    length: {
      type: Number,
      default: 532
    },
    onLocationError: {
      type: Function
    },
    showMoreMsg: {
      type: String,
      default: 'Ver mais'
    },
    failedToSendMsg: {
      type: String,
      default: 'Falha ao enviar a mensagem.'
    },
    buttonLabelMsg: {
      type: String,
      default: navigator.language.toLowerCase().startsWith('pt')
            ? 'Enviar Localização'
            : 'Send Location'
    },
    replyCallback: {
      type: Function,
      default: undefined
    }
  },
  computed: {
    previewDocument: function() {
      return {
        hasPreview: this.document.label.value.length > this.length,
        previewContent: linkify(
          this.document.label.value.substring(0, this.length - 3) + '...'
        ),
        content: linkify(this.document.label.value)
      }
    }
  },
  data: function() {
    return {
      hide: undefined,
      text: undefined,
      showContent: undefined,
      isFailedMessage
    }
  },
  watch: {
    hideOptions: function() {
      this.hide = this.hideOptions
    }
  },
  methods: {
    init: function() {
      this.hide = this.hideOptions
      this.text = this.document.label.value
      this.showContent = false
    },
    select: function() {
      if (!navigator.geolocation) {
        return
      }
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          if (this.onSelected) {
            this.onSelected(null, {
              type: 'application/vnd.lime.location+json',
              content: { latitude, longitude }
            })
          }
        },
        (error) => {
          if (this.onLocationError) {
            this.onLocationError(error)
            this.hide = this.hideOptions
          }
        },
        {
          timeout: 5000
        }
      )

      if (!this.editable) {
        this.hide = true
      }
    },
    saveLocation: function($event) {
      if (this.errors.any() || ($event && $event.shiftKey)) {
        return
      }

      if ($event) {
        $event.stopPropagation()
        $event.preventDefault()
        $event.returnValue = false
      }

      this.showContent = false
      this.save({
        ...this.document,
        label: {
          ...this.document.label,
          value: this.text
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables.scss';

.request-location {
  .bubble {
    padding: $bubble-padding;
    text-align: left;
  }
  .options {
    ul {
      list-style-type: none;
      clear: both;
      margin: 0;
      padding: 10px;
    }

    li {
      cursor: pointer;
      display: inline-flex;
      align-items: end;
      background-color: $color-system;
      border: 1px solid $color-content-ghost;
      border-radius: 20px;
      padding: 7px 10px;
      margin: 2px;
      color: $color-content-default;
      font-size: 16px;
      font-weight: 500;
      min-width: 70px;

      .wrapper {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        .locationIcon {
          justify-content: center;
          border-radius: 50%;
          width: 25px;
          height: 25px;
        }
        .text {
          margin: 0px 10px;
        }
      }
    }
  }
  #pinIcon {
    fill: #0cc8cc;
  }
}

.blip-request-location-metadata {
  margin-top: -20px;
  padding: 0 12px 10px 0;
}
</style>
