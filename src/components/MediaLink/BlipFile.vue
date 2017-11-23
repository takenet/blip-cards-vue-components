<template>
  <div class="blip-container file">
    <div :class="'bubble ' + position">
      <a :href="this.uri" class="file-wrapper">
        <div class="file-icon-wrapper">
          <img class="file-icon" :src="icon"/>
        </div>
        <div class="description-wrapper">
          <div class="link-description">
            <span :title="title" class="text big-text" v-text="title"></span>
          </div>
          <span class="text small-text" v-text="sizeInBytes"></span>
        </div>
      </a>
    </div>
  </div>
</template>

<script>

import { default as base } from '../../mixins/baseComponent.js'
import fileIconDefault from '../../assets/img/ItemDefault.svg'
import fileIconCss from '../../assets/img/ItemCSS.svg'
import fileIconCsv from '../../assets/img/ItemCSV.svg'
import fileIconDoc from '../../assets/img/ItemDoc.svg'
import fileIconJpg from '../../assets/img/ItemJPG.svg'
import fileIconJs from '../../assets/img/ItemJS.svg'
import fileIconPdf from '../../assets/img/ItemPDF.svg'
import fileIconPhp from '../../assets/img/ItemPHP.svg'
import fileIconPng from '../../assets/img/ItemPNG.svg'
import fileIconPpt from '../../assets/img/ItemPPT.svg'
import fileIconRar from '../../assets/img/ItemRAR.svg'
import fileIconTxt from '../../assets/img/ItemTXT.svg'
import fileIconXls from '../../assets/img/ItemXLS.svg'
import fileIconZip from '../../assets/img/ItemZIP.svg'

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
      size: this.document.size,
      sizeInBytes: '',
      icon: null
    }
  },
  created: function () {
    this.sizeInBytes = this.sizeInBytesFilter()
    this.icon = this.fileTypeFilter()
  },
  methods: {
    sizeInBytesFilter: function () {
      var SIZES = ['B', 'KB', 'MB', 'GB']

      if (!this.size) {
        return ''
      }

      var log = Math.floor(Math.log(this.size) / Math.log(1024))
      var number = log === 0 ? this.size : (this.size / (1024 * log)).toFixed(1)

      return number + SIZES[log]
    },
    fileTypeFilter: function () {
      if (!this.type) {
        return fileIconDefault
      }

      var extension = this.type.substr(this.type.indexOf('/') + 1)
      switch (extension) {
        case 'css':
          return fileIconCss
        case 'csv':
          return fileIconCsv
        case 'doc':
        case 'docx':
          return fileIconDoc
        case 'jpg':
          return fileIconJpg
        case 'js':
          return fileIconJs
        case 'pdf':
          return fileIconPdf
        case 'php':
          return fileIconPhp
        case 'png':
          return fileIconPng
        case 'ppt':
        case 'pptx':
          return fileIconPpt
        case 'rar':
          return fileIconRar
        case 'txt':
          return fileIconTxt
        case 'xls':
        case 'xlsx':
          return fileIconXls
        case 'zip':
          return fileIconZip
        default:
          return fileIconDefault
      }
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

    .right {
      .file-icon-wrapper {
        background-color: $vue-white;
        padding-right: 20px !important;
      }
      .description-wrapper {
        padding-left: 20px !important;
      }
    }

    .file-wrapper {
      color: inherit;
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
          max-height: 76px;
          span {
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        .big-text {
          max-height: 38px;
        }

        .small-text {
          font-size: 10px;
          font-weight: 100;
          height: 19px;
        }
      }
    }
  }
</style>
