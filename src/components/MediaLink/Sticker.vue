<template>
    <div class="sticker-container">
      <bds-button-icon
        v-if="deletable && !isEditing"
        class="editIco trashIco"
        icon="trash"
        variant="delete"
        size="short"
        v-on:click="trash(document)"
      ></bds-button-icon>
      <bds-button-icon
        v-if="editable && !isEditing"
        class="editIco"
        icon="edit"
        variant="primary"
        size="short"
        v-on:click="toggleEdit"
      ></bds-button-icon>
      <div class="header" :id="id" v-if="!isEditing">
        <div v-if="simplified">
          <bds-grid gap="4" align-items="center" justify-content="space-between">
            <bds-grid margin="r-1" align-items="center" gap="1">
              <bds-icon class="typo" size="small" name="file-image" theme="outline"></bds-icon>
            </bds-grid>
            <bds-grid>
              <div class="sticker-preview-container">
                <div class="background ratio ratio1-1" :style="simplifiedStyleObject" id="simplifiedSticker"></div>
              </div>
            </bds-grid>
          </bds-grid>
        </div>
        <div v-if="!simplified">
          <div
            :class="
              'background ratio ratio' +
                documentAspect +
                (editable ? '' : ' pointer')
            "
            :style="styleObject"
          ></div>
        </div>
      </div>
      <div class="form" v-else>
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
            v-on:click="stickerSave()"
          >
          </bds-button-icon>
          <div class="form-group">
            <input
              type="text"
              name="sticker"
              :class="{ 'input-error': errors.has('sticker') }"
              v-validate="'required'"
              class="form-control"
              v-model="sticker"
              :placeholder="stickerUriMsg"
            />
            <span v-if="errors.has('sticker')" class="help input-error">{{
              errors.first('sticker')
            }}</span>
            <div class="upload-intructions">
              <span>{{ supportedFormatsMsg }}: WEBP.</span>
            </div>
          </div>
          <button
            v-if="typeof onMetadataEdit === 'function'"
            class="define-metadata blip-media-link-metadata"
            @click="editMetadata(fullDocument)"
          >
            {{ metadataButtonText }}
          </button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { guid } from '../../utils/misc'
  import { default as base } from '../../mixins/baseComponent.js'
  import mime from 'mime-types'
  import BrokenWhite from '../../assets/img/BrokenWhite.svg'
  import Broken from '../../assets/img/Broken.svg'
  import { isAuthenticatedMediaLink, tryCreateLocalMediaUri } from '../../utils/media.js'
  
  export default {
    mixins: [base],
    props: {
      stickerUriMsg: {
        type: String,
        default: 'Sticker Uri'
      },
      supportedFormatsMsg: {
        type: String,
        default: 'Supported formats'
      },
      asyncFetchMedia: {
        type: Function
      },
      simplified: {
        type: Boolean,
        default: false
      }
    },
    data: function() {
      return {
        styleObject: undefined,
        simplifiedStyleObject: undefined,
        id: undefined,
        title: undefined,
        text: undefined,
        sticker: undefined,
        aspect: undefined,
        stickerUri: undefined
      }
    },
    watch: {
      document: function() {
        this.init()
      }
    },
    computed: {
      documentAspect: function() {
        return '1-1'
      },
      type: function() {
        return mime.lookup(this.sticker) ? mime.lookup(this.sticker).replace('image', 'sticker') : 'sticker/webp'
      }
    },
    methods: {
      init: async function() {
        this.stickerUri = isAuthenticatedMediaLink(this.document)
          ? await tryCreateLocalMediaUri(this.document, this.asyncFetchMedia)
          : this.document.uri
        this.checkSticker(this.stickerUri)
        this.id = guid()
        this.sticker = this.document.uri
        this.aspect = '1-1'
      },
      stickerSave: function($event) {
        if (this.errors.any() || ($event && $event.shiftKey)) {
          return
        }
  
        if ($event) {
          $event.stopPropagation()
          $event.preventDefault()
          $event.returnValue = false
        }
  
        this.$validator.validateAll().then((result) => {
          if (!result) return
          this.styleObject['border-radius'] =
            this.title || this.text ? '13px 13px 0px 0px' : '13px 13px 13px 0px'
  
          this.save({
            ...this.document,
            uri: this.sticker,
            type: this.type
          })
        })
      },
      checkSticker(url) {
        var img = new Image()
        img.onload = () => {
          this.styleObject = {
            'border-radius':
              this.document.title || this.document.text
                ? '13px 13px 0px 0px'
                : '13px 13px 13px 0px',
            'background-image': `url("${url}")`
          }
  
          this.simplifiedStyleObject = {
            'background-image': `url("${url}")`,
            'border-radius': '0px !important'
          }
        }
        img.onerror = () => {
          this.styleObject = {
            'border-radius':
              this.document.title || this.document.text
                ? '13px 13px 0px 0px'
                : '13px 13px 13px 0px',
            'background-image': `url("${
              this.position === 'right' ? BrokenWhite : Broken
            }")`,
            'background-size': '125px',
            opacity: '0.6'
          }
  
          this.simplifiedStyleObject = this.styleObject
        }
        img.src = url
      }
    },
    destroyed: function() {
      this.asyncFetchMedia && URL.revokeObjectURL(this.stickerUri)
    }
  }
  </script>
  
  <style lang="scss">
  @import '../../styles/variables.scss';
  
  #simplifiedSticker {
    object-fit: fill;
    border-radius: 0 !important;
  }
  
  .sticker-preview-container {
    background-color: $color-surface-1;
    width: 56px;
    height: 56px;
    align-items: center;
  }
  
  .media-link {
    .bubble {
      padding: 0;
      max-width: 350px;
    }
  
    .sticker-container {
      border-radius: inherit;
    }
  
    .header {
      img {
        width: 100%;
        display: block;
      }
      .background {
        background-position: center;
        background-repeat: no-repeat;
      }
    }
  
    .form {
      form {
        width: auto;
      }
      .form-group .form-control.text {
        margin-top: 10px;
      }
    }
  
    .blip-media-link-metadata {
      margin-top: -5px;
      padding: 0 10px 10px 0;
    }
  }
  </style>
  