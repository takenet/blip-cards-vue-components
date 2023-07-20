<template>
  <div>
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
      <div
        :class="
          'background ratio ratio' +
            documentAspect +
            (editable ? '' : ' pointer')
        "
        :style="styleObject"
        @click="editable ? null : handleImageLink()"
      ></div>
      <div class="title" v-if="document.title || document.text">
        <strong
          v-if="document.title"
          v-html="sanitize(document.title)"
        ></strong>
        <span v-if="document.text" v-html="sanitize(document.text)"></span>
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
          v-on:click="imgSave()"
        >
        </bds-button-icon>
        <div class="form-group">
          <input
            type="text"
            name="image"
            :class="{ 'input-error': errors.has('image') }"
            v-validate="'required'"
            class="form-control"
            v-model="image"
            :placeholder="imageUriMsg"
          />
          <span v-if="errors.has('image')" class="help input-error">{{
            errors.first('image')
          }}</span>
          <div class="upload-intructions">
            <span>{{ supportedFormatsMsg }}: JPEG,JPG,PNG,GIF.</span>
          </div>
        </div>
        <div class="form-check">
          <div>
            <span>{{ aspectRatioMsg }}:</span>
          </div>
          <div class="form-check-wrapper">
            <span class="form-check-container">
              <label class="form-check-label" :for="_uid + '1-1'">
                <input
                  type="radio"
                  name="aspect-selector"
                  :id="_uid + '1-1'"
                  class="form-check-input"
                  v-model="aspect"
                  value="1-1"
                />
                <span class="radio">1:1</span>
                <div class="check"></div>
              </label>
            </span>
            <span class="form-check-container">
              <label class="form-check-label" :for="_uid + '2-1'">
                <input
                  type="radio"
                  name="aspect-selector"
                  :id="_uid + '2-1'"
                  class="form-check-input"
                  v-model="aspect"
                  value="2-1"
                />
                <span class="radio">2:1</span>
                <div class="check"></div>
              </label>
            </span>
          </div>
        </div>
        <div class="form-group">
          <input
            type="text"
            class="form-control"
            v-model="title"
            :placeholder="titleMsg"
          />
          <textarea
            @keydown.enter="imgSave($event)"
            v-model="text"
            class="form-control text"
            :placeholder="textMsg"
          />
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
import { tryCreateLocalMediaUri } from '../../utils/media.js'

export default {
  mixins: [base],
  props: {
    onMediaSelected: {
      type: Function
    },
    aspectRatioMsg: {
      type: String,
      default: 'Aspect Ratio'
    },
    supportedFormatsMsg: {
      type: String,
      default: 'Supported formats'
    },
    imageUriMsg: {
      type: String,
      default: 'Image Uri'
    },
    titleMsg: {
      type: String,
      default: 'Title'
    },
    textMsg: {
      type: String,
      default: 'Text'
    },
    asyncFetchMedia: {
      type: Function
    }
  },
  data: function() {
    return {
      styleObject: undefined,
      id: undefined,
      title: undefined,
      text: undefined,
      image: undefined,
      aspect: undefined,
      imageUri: undefined
    }
  },
  watch: {
    document: function() {
      this.init()
    }
  },
  computed: {
    documentAspect: function() {
      return this.document.aspectRatio
        ? this.document.aspectRatio.replace(':', '-')
        : '1-1'
    },
    type: function() {
      return mime.lookup(this.image) ? mime.lookup(this.image) : 'image/jpeg'
    }
  },
  methods: {
    init: async function() {
      this.imageUri = this.asyncFetchMedia
        ? await tryCreateLocalMediaUri(this.document, this.asyncFetchMedia)
        : this.document.uri
      this.checkImage(this.imageUri)
      this.id = guid()
      this.title = this.document.title
      this.text = this.document.text
      this.image = this.document.uri
      this.aspect = this.document.aspectRatio
        ? this.document.aspectRatio.replace(':', '-')
        : '1-1'
    },
    imgSave: function($event) {
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
          aspectRatio: this.aspect.replace('-', ':'),
          title: this.title,
          text: this.text,
          uri: this.image,
          type: this.type
        })
      })
    },
    handleImageLink: function() {
      if (this.onMediaSelected) {
        this.onMediaSelected(this.imageUri)
      } else {
        window.open(this.imageUri, '_blank', 'noopener')
      }
    },
    checkImage(url) {
      var img = new Image()
      img.onload = () => {
        this.styleObject = {
          'border-radius':
            this.document.title || this.document.text
              ? '13px 13px 0px 0px'
              : '13px 13px 13px 0px',
          'background-image': `url("${url}")`
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
      }
      img.src = url
    },
    getBlipContainer(element) {
      let container = element
      while (container.id !== 'blip-container') {
        if (!container.parentNode) {
          return container
        }
        container = container.parentNode
      }
      return container
    }
  },
  destroyed: function() {
    this.asyncFetchMedia && URL.revokeObjectURL(this.imageUri)
  }
}
</script>

<style lang="scss">
@import '../../styles/variables.scss';

.media-link {
  .bubble {
    padding: 0;
    max-width: 350px;
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

  .form-check {
    padding: 0 10px;
    margin: 0;

    input[type='radio'] {
      position: absolute;
      visibility: hidden;
    }

    .form-check-container {
      margin-left: 5px;
      margin-top: 8px;
      position: relative;
      width: 40px;
      height: 20px;
      display: inline-block;
    }

    label {
      position: relative;
      z-index: 1;
      cursor: pointer;
    }

    .check {
      display: block;
      position: absolute;
      border: 1px solid $color-content-default;
      border-radius: 100%;
      height: 16px;
      width: 16px;
      top: 0px;
      left: 0px;
      transition: border 0.25s linear;
      -webkit-transition: border 0.25s linear;
      -moz-transition: border 0.25s linear;
      -ms-transition: border 0.25s linear;
    }
    .check::before {
      display: block;
      position: absolute;
      content: '';
      border-radius: 100%;
      height: 8px;
      width: 8px;
      top: 3px;
      left: 3px;
      margin: auto;
      transition: background 0.25s linear;
      -webkit-transition: background 0.25s linear;
      -moz-transition: background 0.25s linear;
      -ms-transition: background 0.25s linear;
    }
    input[type='radio']:checked ~ .check {
      border: 1px solid $color-content-default;
    }

    input[type='radio']:checked ~ .check::before {
      background: $color-primary;
    }
  }

  .blip-media-link-metadata {
    margin-top: -5px;
    padding: 0 10px 10px 0;
  }
}
</style>
