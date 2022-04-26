<template>
  <div class="blip-container-flex">
    <div class="blip-container-list-card">
      <div class="blip-list-card wrap"
        v-for="mediaLinkDocument in documents" 
        :key="mediaLinkDocument.id">
        <div :class="fileIconWrapper(mediaLinkDocument.content.type)">
          <img v-if="mediaLinkDocument.content.type.indexOf('image') != -1" class="file-icon"
            :src="mediaLinkDocument.content.uri"/>
          <img v-else class="file-icon"
            :src="mimeType(mediaLinkDocument.content) | fileIconFilter"/>
        </div>
        <div class="column-flex text-flex">
          <span class="ellipsis-text" v-if="mediaLinkDocument.content.title" v-html="sanitize(trincFileName(mediaLinkDocument.content.title))"></span>
          <span v-if="mediaLinkDocument.content.title" v-html="sanitize(truncExtension(mediaLinkDocument.content.title))"></span>
        </div>
        <bds-button variant='secondary' @click="remove(mediaLinkDocument.content.title)">
          <img :src="trashBlackSvg">
        </bds-button>
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
    },
    trincFileName(initial) {
      return initial.split('.')[0]
    },
    truncExtension(initial) {
      var split = initial.split('.')
      return '.' + split[split.length - 1]
    }
  }
}
</script>

<style lang="scss">
@import '../styles/common.scss';
@import '../styles/variables.scss';
$soft-round: 2px;
$hard-round: 13px;

.column-flex {
  display: flex;
  margin: auto;

  img {
    width: 18.02px;
    height: 20px;
  }
}

.text-flex {
  padding: 0 24px;
  flex: 1;
  width: 0;
	display: flex;
	flex: 1;

  .ellipsis-text {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}

.blip-container-flex {
  margin: 0;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;

  .blip-container-list-card {
    display: flex;
    flex-direction: column;
    flex: 1;
    width: 100%;
    overflow-y:auto; 
    max-width: 592px;
    max-height: 318px;

    .wrap {
      border-bottom: 2px solid #F3F6FA;
    }

    .blip-list-card {
      width: 100%;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
      padding: 8px;

      .file-icon-wrapper {
        display: flex; 
        width: 32.5px;
        height: 38.37px;
        margin: auto;
      }

      .file-icon-wrapper-image {
        display: flex;
        width: 124px;
        height: 124px;
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
}

</style>