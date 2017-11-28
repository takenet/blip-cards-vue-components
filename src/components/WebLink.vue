<template>
  <div v-if="!isEditing" class="blip-container web-link">
    <div :class="'bubble ' + position + (this.title == null && this.text == null ? ' text-link': '' )">
      <div v-if="editable" class="editIco trashIco" @click="trash(document)">
        <img :src="trashSvg" />
      </div>
      <div v-if="editable" class="editIco" @click="toggleEdit">
        <img :src="editSvg" />
      </div>
      <span v-if="this.title || this.text" class="link web-link-wrapper" @click="handleWeblink()">
        <img v-if="this.title" class="preview" :src="this.imgPreview">
        <div class="link-description-wrapper">
          <span class="text big-text" :title="title" v-text="title"></span>
          <div class="text-wrapper">
            <span class="text light-text" :title="text">{{ text }}</span>
          </div>
          <div class="space-between-text"></div>
          <span class="text small-text" :title="uri" v-text="uri"></span>
        </div>
      </span>
      <span v-else v-html="this.textLink"></span>
    </div>
    <div :class="'notification ' + position" v-if="date">
      {{ date }}
    </div>
  </div>
  <div v-else class="blip-container web-link">
    <form class="bubble left" novalidate v-on:submit.prevent>
      <div class="saveIco" @click="webLinkSave()" :class="{'is-disabled': errors.any() }">
        <img :src="approveSvg" />
      </div>
      <div class="saveIco closeIco" @click="webLinkCancel()">
        <img :src="closeSvg" />
      </div>
      <div class="form-group">
        <input type="text" name="page" class="form-control" :class="{'input-error': errors.has('page') }" v-validate="'required|url'" v-model="uri" placeholder="Page URL" />
        <span v-show="errors.has('page')" class="help input-error">{{ errors.first('page') }}</span>
        <input type="text" name="title" class="form-control title" :class="{'input-error': errors.has('title') }" v-validate="'required'" v-model="title" placeholder="Title" />
        <span v-show="errors.has('title')" class="help input-error">{{ errors.first('title') }}</span>
        <input type="text" name="webLinkText" class="form-control text" v-model="text" placeholder="Description" />
      </div>
    </form>
  </div>
</template>

<script>

import { default as base } from '../mixins/baseComponent.js'
import { linkify } from '../utils'

export default {
  name: 'web-link',
  mixins: [
    base
  ],
  props: {
    onOpenLink: {
      type: Function
    }
  },
  data: function () {
    return {
      imgPreview: this.document.previewUri,
      title: this.document.title,
      metaTitle: null,
      text: this.document.text,
      metaText: null,
      uri: this.document.uri,
      target: this.document.target || 'blank'
    }
  },
  computed: {
    textLink: function () {
      return linkify(this.document.uri)
    }
  },
  created: function () {
    this.isEditing = this.initEditing
  },
  methods: {
    handleWeblink: function () {
      if (this.target === 'blank') {
        window.open(this.uri, '_blank')
      } else {
        this.onOpenLink(this.uri, this.target)
      }
    },
    webLinkSave: function () {
      this.$validator.validateAll().then((result) => {
        if (!result) return
        this.save({
          ...this.document,
          uri: this.uri,
          title: this.title,
          text: this.text
        })
      })
    },
    webLinkCancel: function () {
      this.title = this.document.title || this.metaTitle
      this.text = this.document.text || this.metaText
      this.uri = this.document.uri
      this.isEditing = false
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
        max-height: 100px;
        object-fit: contain;
        align-self: center;
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
  }
</style>
