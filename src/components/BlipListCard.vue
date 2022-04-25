<template>
  <div class="blip-container">
    <div class="blip-message-group" >
      <div class="blip-container-list-card">
        <div class="blip-list-card wrap media-link image"
          v-for="mediaLinkDocument in documents" 
          :key="mediaLinkDocument.id">
          <div :class="fileIconWrapper(mediaLinkDocument.content.type)">
            <img v-if="mediaLinkDocument.content.type.indexOf('image') != -1" class="file-icon"
              :src="mediaLinkDocument.content.uri"/>
            <img v-else class="file-icon"
              :src="mimeType(mediaLinkDocument.content) | fileIconFilter"/>
          </div>
          <div class="column-flex text-flex">
            <span v-if="mediaLinkDocument.content.title" v-html="sanitize(mediaLinkDocument.content.title)"></span>
          </div>
          <div class="column-flex">
            <bds-button variant='secondary' @click="remove(mediaLinkDocument.content.title)"><img :src="trashBlackSvg"></bds-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { default as base } from '../mixins/baseComponent.js'
import mime from 'mime-types'

export default {
  name: 'blip-list-card',
  mixins: [base],
  props: {
    documents: {
      type: Array,
      default: () => []
    },
    onRemove: {
      type: Function
    }
  },
  methods: {
    fileIconWrapper(type) {
      return type.indexOf('image') !== -1
        ? 'file-icon-wrapper-image'
        : 'file-icon-wrapper'
    },
    mimeType(document) {
      let extension = mime.extension(document.type)
      if (extension) {
        return document.type
      }
      return mime.lookup(document.uri)
    },
    remove(docTitle) {
      this.onRemove(docTitle)
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

  .blip-container-list-card {
    display: flex;
    flex-direction: column; 
    justify-content: start; 
    overflow-y:auto; 
    max-width: 592px; 
    max-height: 318px;

    .wrap {
      border-bottom: 2px solid #F3F6FA;
      flex-grow: 1;
    }

    .blip-list-card {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin: 8px;

      .file-icon-wrapper {
        display: flex; 
        width: 6%; 
        margin-right: 24px
      }

      .file-icon-wrapper-image {
        display: flex; 
        width: 124px;
        height: 124px;
        margin-right: 24px
      }
    }
  }

  ::-webkit-scrollbar {
    width: 5px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb {
    background: #888;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #555;
    padding: 8px;
  }

  .column-flex {
    display: flex;
    margin: auto;
  }

  .text-flex {
    margin-right: 32px;
    flex: auto;
  }

}
</style>