<template>
  <div>
    <div v-if="editable && !isEditing" class="editIco" @click="toggleEdit">
      <img :src="editSvg" />
    </div>

    <div :class="'bubble ' + position">
      <div class="header" :id="id" v-if="!isEditing">
        <a :href="document.uri" target="_blank">
          <div :class="'ratio ratio' + aspect" :style="'background-image: url(' + previewUri + ')'">
          </div>
        </a>

        <div class="title" v-if="title || text">
            <strong v-if="title" v-html="title"></strong>
            <span v-if="text" v-html="text"></span>
        </div>
      </div>

      <div class="form" v-else>
        <form novalidate v-on:submit.prevent>
          <div v-if="errors.any()" class="saveIco" @click="imgCancel()" >
            <img :src="closeSvg" />
          </div>
          <div v-else class="saveIco" @click="imgSave()">
            <img :src="approveSvg" />
          </div>
          <div class="form-group">
            <input type="text" name="image" :class="{'input-error': errors.has('image') }" v-validate="'required|url'" class="form-control" v-model="editImage" placeholder="Image Uri" />
            <span v-if="errors.has('image')" class="help input-error">{{ errors.first('image') }}</span>
            <div class="upload-intructions">
              <span>Supported formats: JPEG,JPG,PNG,GIF.</span>
            </div>
          </div>
          <div class="form-check">
            <span>Aspect Ratio:</span><br>
            <label class="form-check-label">
              <input type="radio" class="form-check-input" v-model="editAspect" value="1-1"/> 1:1
            </label>
            <label class="form-check-label">
              <input type="radio" class="form-check-input" v-model="editAspect" value="2-1"/> 2:1
            </label>
          </div>
          <div class="form-group">
            <input type="text" class="form-control" v-model="editTitle" placeholder="Title" />
          </div>
          <div class="form-group">
            <textarea v-model="editText" class="form-control" placeholder="Text" />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>

import { guid } from '../../utils'
import { default as base } from '../../mixins/baseComponent.js'
import mime from 'mime-types'

export default {
  mixins: [
    base
  ],
  data: function () {
    return {
      id: guid(),
      title: this.document.title,
      text: this.document.text,
      preview: this.document.previewUri,
      image: this.document.uri,
      aspect: this.document.aspectRatio ? this.document.aspectRatio.replace(':', '-') : '1-1',
      editTitle: this.document.title,
      editText: this.document.text,
      editImage: this.document.uri,
      editAspect: this.document.aspectRatio ? this.document.aspectRatio.replace(':', '-') : '1-1'
    }
  },
  computed: {
    previewUri: function () {
      return this.preview ? this.preview : this.image
    },
    type: function () {
      return mime.lookup(this.image)
    }
  },
  methods: {
    imgSave: function () {
      this.title = this.editTitle
      this.text = this.editText
      this.image = this.editImage
      this.aspect = this.editAspect
      this.save({
        ...this.document,
        title: this.title,
        text: this.text,
        previewUri: this.preview,
        uri: this.image,
        type: this.type
      })
    },
    imgCancel: function () {
      this.editTitle = this.title
      this.editText = this.text
      this.editImage = this.image
      this.editAspect = this.aspect
      this.isEditing = false
    }
  },
  mounted: function () {
    let element = this.$el
    let container = element.parentNode
    let width = parseInt(window.getComputedStyle(container).width.toString().replace('px', ''))

    var bubble = element.querySelector('.bubble')

    if (width <= 400) {
      bubble.style.width = width + 'px'
    } else if (width < 700) {
      bubble.style.width = (width / 2) + 'px'
    } else {
      bubble.style.width = (width / 3) + 'px'
    }
  }
}
</script>

<style lang="scss">
   @import '../../styles/variables.scss';

   .media-link.image {

    .bubble {
      padding: 0;
    }

    .header {
      img {
        width: 100%;
        display: block;
      }
    }

    .form {
      padding: $bubble-padding;
    }

    .form-check {
      color: $vue-cloud;
      margin-top: 10px;
      margin-bottom: 15px;
      .form-check-label {
        margin-top: 3px;
      }
    }

    .form-group {
      color: $vue-london;
      .input-error {
        color: $vue-delete;
      }
      .help {
        padding: 5px;
        font-size: 11px;
      }
      .upload-intructions {
        padding: 5px;
        padding-bottom: 0px;
        font-size: 12px;
      }
      ::-webkit-input-placeholder {
        color: $vue-time;
        font-size: 12px;
      }
      ::-moz-placeholder {
        color: $vue-time;
        font-size: 12px;
      }
      :-ms-input-placeholder {
        color: $vue-time;
        font-size: 12px;
      }
      :-moz-placeholder {
        color: $vue-time;
        font-size: 12px;
      }
    }
   }
</style>
