<template>
  <div class="image-container">
    <div class="header" :id="id">
      <div v-if="!imageUri || imageUri === ''"
        class="default-image-div">
        <div class="default-image">
          <bds-icon name="file-image" color="var(--$color-content-ghost, #8C8C8C)" />
        </div>
        <bds-typo class="typo" tag="p" variant="fs-12" bold="regular">
          {{ defaultImageMessage }}
        </bds-typo>
      </div>
      <div v-else
        :class="'background ratio ratio' + documentAspect + (editable ? '' : ' pointer')"
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
  </div>
</template>

<script>
import { guid } from '../../../utils/misc'
import { default as base } from '../../../mixins/baseComponent.js'
import mime from 'mime-types'
import BrokenWhite from '../../../assets/img/BrokenWhite.svg'
import Broken from '../../../assets/img/Broken.svg'
import { isAuthenticatedMediaLink, tryCreateLocalMediaUri } from '../../../utils/media.js'

export default {
  mixins: [base],
  props: {
    onMediaSelected: {
      type: Function
    },
    asyncFetchMedia: {
      type: Function
    },
    useBorderRadius: {
      type: Boolean,
      default: true
    },
    defaultImageMessage: {
      type: String,
      default: 'Insira uma imagem em “Mídia“'
    }
  },
  data: function() {
    return {
      styleObject: undefined,
      simplifiedStyleObject: undefined,
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
      this.imageUri = isAuthenticatedMediaLink(this.document)
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
    handleImageLink: function() {
      if (this.onMediaSelected) {
        this.onMediaSelected(this.imageUri)
      } else {
        window.open(this.imageUri, '_blank', 'noopener')
      }
    },
    checkImage(url) {
      if (!url || url === '') return

      var img = new Image()
      img.onload = () => {
        this.styleObject = {
          'border-radius': !this.useBorderRadius
            ? ''
            : this.document.title || this.document.text
              ? '13px 13px 0px 0px'
              : '13px 13px 13px 0px',
          'background-image': `url("${url}")`,
          'background-size': !this.useBorderRadius
            ? 'contain'
            : ''
        }

        this.simplifiedStyleObject = {
          'background-image': `url("${url}")`,
          'border-radius': '0px !important'
        }
      }
      img.onerror = () => {
        this.styleObject = {
          'border-radius': !this.useBorderRadius
            ? ''
            : this.document.title || this.document.text
              ? '13px 13px 0px 0px'
              : '13px 13px 13px 0px',
          'background-image': `url("${
            this.position === 'right' ? BrokenWhite : Broken
          }")`,
          opacity: '0.6',
          'background-size': !this.useBorderRadius
            ? 'contain'
            : '125px'
        }

        this.simplifiedStyleObject = this.styleObject
      }
      img.src = url
    }
  },
  destroyed: function() {
    this.asyncFetchMedia && URL.revokeObjectURL(this.imageUri)
  }
}
</script>

<style lang="scss">
@import '../../../styles/variables.scss';

#simplifiedImage {
  object-fit: fill;
  border-radius: 0 !important;
}

.image-preview-container {
  background-color: $color-surface-1;
  width: 56px;
  height: 56px;
  align-items: center;
}

.preview-loading {
  padding-left: 20px;
  padding-top: 20px;
}

.media-link {
  .bubble {
    padding: 0;
    max-width: 350px;
  }

  .image-container {
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

.default-image-div {
  height: 160px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $color-surface-2;
  flex-direction: column;
}

.default-image {
  margin-bottom: 8px;
}
</style>
