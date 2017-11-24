<template>
  <div class="blip-container file">
    <div :class="'bubble ' + position">
      <a :href="this.uri" target="_blank" class="file-wrapper">
        <div class="file-icon-wrapper">
          <img class="file-icon" :src="type | fileIconFilter"/>
        </div>
        <div class="description-wrapper">
          <div class="link-description">
            <span :title="title" class="text big-text">{{ title }}</span>
          </div>
          <span class="text small-text">{{ size | sizeInBytesFilter }}</span>
        </div>
      </a>
    </div>
  </div>
</template>

<script>

import { default as base } from '../../mixins/baseComponent.js'

export default {
  mixins: [
    base
  ],
  data: function () {
    return {
      imgPreview: this.document.previewUri,
      title: this.document.title,
      uri: this.document.uri,
      type: this.document.type,
      size: this.document.size
    }
  }
}
</script>


<style lang="scss">
   @import '../../styles/variables.scss';

  .media-link.application {

    .bubble {
      padding: 0;
      height: 80px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      overflow: hidden;
    }

    .left {
      .description-wrapper {
        color: $vue-gray;
      }
    }

    .right {
      .file-icon-wrapper {
        background-color: $vue-white;
        padding-right: 20px !important;
      }
      .description-wrapper {
        color: $vue-white;
        padding-left: 20px !important;
      }
    }

    .file-wrapper {
      text-decoration: inherit;
      display: flex;
      flex-direction: row;
      align-content: center;
      justify-content: center;

      .file-icon-wrapper {
        display: flex;
        padding: 20px;
        padding-right: 10px;
        justify-content: center;

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
        overflow: hidden;
        padding: 20px;
        padding-left: 10px;
        display: flex;
        flex-direction: column;

        .link-description {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          span {
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        .small-text {
          font-size: 10px;
          font-weight: 100;
        }
      }
    }
  }
</style>
