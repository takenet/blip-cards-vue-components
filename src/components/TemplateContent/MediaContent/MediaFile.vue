<template>
  <div :class="`file-container ${position}`" v-if="componentDocument !== undefined">
    <div class="file-wrapper">
      <div class="file-icon-wrapper">
        <img v-if="isLoading" :src="loadingGif" alt />
        <img v-else class="file-icon" :src="mimeType | fileIconFilter"/>
      </div>
      <div class="description-wrapper">
        <div class="link-description">
          <span v-if="componentDocument.title" :title="componentDocument.title" class="text">{{ componentDocument.title }}</span>
          <span v-else :title="componentDocument.uri" class="text">{{ componentDocument.uri }}</span>
        </div>
        <span v-if="componentDocument.size" class="text small-text">{{ componentDocument.size | sizeInBytesFilter }}</span>
      </div>
    </div>
  </div>
</template>

<script>

import { default as base } from '../../../mixins/baseComponent.js'
import mime from 'mime-types'

export default {
  name: 'media-file',
  props: {
    componentDocument: {}
  },
  mixins: [base],
  computed: {
    mimeType: function() {
      let extension = mime.extension(this.componentDocument.type)
      if (extension) {
        return this.componentDocument.type
      }
      return mime.lookup(this.componentDocument.uri)
    }
  },
  data: function() {
    return {
      isLoading: false
    }
  }
}
</script>

<style lang="scss">
@import '../../../styles/variables.scss';


.file-container {

  &.left,
  &.middle {
    .description-wrapper {
      color: $color-content-default;
    }
  }

  &.right {
    .file-icon-wrapper {
      background-color: $color-surface-3;
      padding-right: 20px !important;
    }

    .description-wrapper {
      padding-left: 20px !important;
      background-color: #636363;
    }
  }

  .file-wrapper {
    padding: 0;
    height: 80px;
    text-decoration: inherit;
    display: flex;
    flex-direction: row;
    align-content: center;
    justify-content: flex-start;

    .file-icon-wrapper {
      display: flex;
      padding: 20px;
      padding-right: 10px;

      .file-icon {
        display: flex;
        flex-direction: horizontal;
        flex-grow: 1;
        max-height: 40px;
        max-width: 40px;
        object-fit: contain;
      }
    }

    .description-wrapper {
      flex: 1;
      overflow: hidden;
      padding: 20px;
      padding-left: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .link-description {
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        flex-grow: 1;
        height: 2.5rem;

        .text {
        position: relative;
        text-align: left;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        }
      }

      .small-text {
        font-size: 10px;
        font-weight: 100;
        display: flex;
        align-items: flex-start;
      }
    }
  }
}


</style>
