<template>
  <div v-if="!isEditing" class="web-link" :class="isFailedMessage(status, position) + ' ' + getBlipContainer">
    <div
      :class="simplified ? '' : 'bubble ' + position + (this.title == null && this.text == null ? ' text-link': '' )"
    >
      <div v-if="simplified">
        <bds-grid align-items="center" gap="1">
          <bds-icon class="typo" size="small" name="link" theme="outline"></bds-icon>
          <bds-typo class="typo web-link-reacted-text" tag="span">{{ sanitize(this.document.uri) }}</bds-typo>
        </bds-grid>
      </div>
      <div v-if="!simplified">
        <bds-button-icon v-if="deletable && !isEditing"
          class="editIco trashIco icon-button-margin"
          icon="trash"
          variant="delete"
          size="short"
          v-on:click="trash(document)"
        ></bds-button-icon>
          <bds-button-icon v-if="editable"
            class="editIco icon-button-margin"
            icon="edit"
            variant="primary"
            size="short"
            v-on:click="toggleEdit"
          ></bds-button-icon>
        <span
          v-if="this.previewTitle || this.previewText"
          class="link web-link-wrapper"
          @click="(editable ? null : handleWeblink())"
        >
          <div
            v-if="this.previewImage"
            class="preview"
            :style="'background-image: url(&quot;' + this.previewImage + '&quot;)'"
          ></div>
          <div class="link-description-wrapper text-left">
            <span class="text big-text" :title="previewTitle" v-text="this.previewTitle"></span>
            <div class="text-wrapper">
              <span class="text light-text" :title="previewText" v-text="this.previewText"></span>
            </div>
            <div class="space-between-text"></div>
            <span class="text small-text" :title="uri" v-text="uri"></span>
          </div>
        </span>
        <span v-else v-html="sanitize(this.textLink)"></span>
      </div>
    </div>
    <div class="flex" :class="'notification ' + position" v-if="date">
      <img v-if="this.status === 'waiting' && this.position === 'right'" :src="clockSvg">
      <img v-else-if="status === 'accepted' && this.position === 'right'" :src="checkSentSvg">
      <img
        v-else-if="status === 'received' && this.position === 'right'"
        :src="doubleCheckReceivedSvg"
      >
      <img v-else-if="status === 'consumed' && this.position === 'right'" :src="doubleCheckReadSvg">
      <div
        v-else-if="this.status === 'failed' && this.position === 'right'"
        class="failure"
      >{{ failedToSendMsg }}</div>
      {{ date }}
    </div>
  </div>
  <div v-else class="blip-container web-link">
    <form :class="'bubble ' + position" novalidate v-on:submit.prevent>
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
        v-on:click="webLinkSave()"
      ></bds-button-icon>
      <div class="form-group">
        <input
          type="text"
          name="page"
          class="form-control"
          :class="{'input-error': errors.has('page') }"
          v-validate="'required|url'"
          v-model="uri"
          :placeholder="pageUrlMsg"
          @blur="fetchMetadata(true)"
        >
        <span v-show="errors.has('page')" class="help input-error">{{ errors.first('page') }}</span>
        <input
          type="text"
          name="title"
          class="form-control title"
          :class="{'input-error': errors.has('title') }"
          v-validate="'required'"
          v-model="title"
          :placeholder="titleMsg"
        >
        <span v-show="errors.has('title')" class="help input-error">{{ errors.first('title') }}</span>
        <input
          type="text"
          name="webLinkText"
          class="form-control text"
          v-model="text"
          :placeholder="descriptionMsg"
        >
        <select v-model="target" class="form-control text">
          <option disabled value>Target</option>
          <option value="blank">Blank</option>
          <option value="self">Self</option>
          <option value="selfCompact">SelfCompact</option>
          <option value="selfTall">SelfTall</option>
        </select>
      </div>
      <button
        v-if="typeof onMetadataEdit === 'function'"
        class="define-metadata blip-weblink-metadata"
        @click="editMetadata(fullDocument)"
      >{{ metadataButtonText }}</button>
    </form>
  </div>
</template>

<script>
import { default as base } from '../mixins/baseComponent.js'
import { linkify, isFailedMessage } from '../utils/misc'
import { MetadataService } from '../utils//metadataService.js'

export default {
  name: 'web-link',
  mixins: [base],
  props: {
    onOpenLink: {
      type: Function
    },
    status: {
      type: String,
      default: ''
    },
    initEditing: {
      type: Boolean,
      default: false
    },
    failedToSendMsg: {
      type: String,
      default: 'Falha ao enviar a mensagem'
    },
    pageUrlMsg: {
      type: String,
      default: 'Page URL'
    },
    titleMsg: {
      type: String,
      default: 'Title'
    },
    descriptionMsg: {
      type: String,
      default: 'Description'
    },
    simplified: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      title: this.document.title,
      text: this.document.text,
      imgPreview: this.document.previewUri,
      uri: this.document.uri,
      target: this.document.target || 'blank',
      MetadataService: new MetadataService(),
      isFailedMessage
    }
  },
  computed: {
    textLink: function() {
      return linkify(this.document.uri)
    },
    previewTitle: function() {
      return this.document.title ? this.document.title : this.title
    },
    previewText: function() {
      return this.document.text ? this.document.text : this.text
    },
    previewImage: function() {
      return this.document.previewUri
        ? this.document.previewUri
        : this.imgPreview
    },
    getBlipContainer: function() {
      if (this.simplified) {
        return ''
      }

      return 'blip-container'
    }
  },
  methods: {
    init: function() {
      this.title = this.document.title
      this.text = this.document.text
      this.imgPreview = this.document.previewUri
      this.uri = this.document.uri
      this.target = this.document.target || 'blank'

      this.fetchMetadata(false)
    },
    handleWeblink: function() {
      if (this.target === 'blank') {
        window.open(this.uri, '_blank', 'noopener')
      } else {
        this.onOpenLink({
          uri: this.uri,
          target: this.target,
          title: this.previewTitle || this.previewText,
          image: this.previewImage
        })
      }
    },
    webLinkSave: function() {
      this.$validator.validateAll().then((result) => {
        if (!result) return
        this.save({
          ...this.document,
          uri: this.uri,
          title: this.title,
          text: this.text,
          previewUri: this.imgPreview,
          target: this.target
        })
      })
    },
    fetchMetadata: async function(isEditing) {
      // Only fetch metadata if editing or missing one of weblink properties
      if (
        !this.isEditing &&
        this.document.previewUri &&
        this.document.title &&
        this.document.text
      ) {
        return
      }

      const weblink = this.isEditing ? { uri: this.uri } : this.document

      const fetchResult = await this.MetadataService.fetchMetadata(weblink)

      if (fetchResult) {
        this.title = this.title ? this.title : fetchResult.title
        this.text = this.text ? this.text : fetchResult.text
        this.imgPreview = fetchResult.imgPreview
      }
    }
  }
}
</script>


<style lang="scss">
@import '../styles/variables.scss';

.web-link .bubble {
  &.right .text-wrapper:after {
    background: $vue-light-blip !important;
  }

  &.text-link {
    padding: $bubble-padding;
    height: auto;
  }

  .form-group {
    min-width: auto;
    .form-control.title {
      margin-top: 10px;
    }
    .form-control.text {
      margin-top: 10px;
    }
  }

  .web-link-wrapper {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    border-radius: inherit;
    overflow: hidden;

    &.link {
      cursor: pointer;
    }

    .preview {
      height: 100px;
      width: 100px;
      min-width: 100px;
      background-position: center;
      background-size: cover;
    }

    .link-description-wrapper {
      display: flex;
      flex-direction: column;
      padding: 10px 16px;
      overflow: hidden;
      min-height: 100px;

      .text {
        overflow: hidden;
        position: relative;
        text-overflow: ellipsis;
      }

      .big-text {
        white-space: nowrap;
      }

      .text-wrapper {
        overflow: hidden;
        position: relative;
        line-height: 1.2em;
        max-height: 2.4em;
        text-align: justify;
        margin-right: 3px;
        padding-right: 13px;
        span {
          line-height: 1.2em;
        }
      }

      .light-text {
        font-size: 12px;
        font-weight: 100;
        flex-grow: 1;
      }

      .text-wrapper:before {
        content: ' ...';
        position: absolute;
        right: 0;
        bottom: 0;
      }

      .text-wrapper:after {
        content: '';
        position: absolute;
        right: 0;
        width: 1em;
        height: 1em;
        margin-top: 0.2em;
        background: $vue-white;
      }

      .small-text {
        font-size: 10px;
        font-weight: 100;
        white-space: nowrap;
      }

      .space-between-text {
        flex-grow: 1;
      }
    }
  }

  .blip-weblink-metadata {
    margin-top: -8px;
    padding: 0 10px 0 0;
  }
}

.web-link-reacted-text {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  margin: 0;
  text-align: left;
  -webkit-line-clamp: 1;
}
</style>
