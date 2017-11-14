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

      <div v-else>
        <form novalidate v-on:submit.prevent>
          <div class="saveIco" @click="imgSave()" :class="{'is-disabled': errors.any() }">
            <img :src="approveSvg" />
          </div>
          <div class="form-group">
            <input type="text" name="preview" :class="{'input-error': errors.has('preview') }" v-validate="'url'" class="form-control" v-model="preview" placeholder="Preview Uri" />
            <span v-if="errors.has('preview')" class="help input-error">{{ errors.first('preview') }}</span>
          </div>
          <div class="form-group">
            <input type="text" name="image" :class="{'input-error': errors.has('image') }" v-validate="'required|url'" class="form-control" v-model="image" placeholder="Image Uri" />
            <span v-if="errors.has('image')" class="help input-error">{{ errors.first('image') }}</span>
          </div>
          <div class="form-check">
            <span>Aspect Ratio:</span>
            <label class="form-check-label">
              <input type="radio" class="form-check-input" v-model="aspect" value="1-1"/> 1:1
            </label>
            <label class="form-check-label">
              <input type="radio" class="form-check-input" v-model="aspect" value="2-1"/> 2:1
            </label>
          </div>
          <hr />
          <div class="form-group">
            <input type="text" class="form-control" v-model="title" placeholder="Title" />
          </div>
          <div class="form-group">
            <textarea v-model="text" class="form-control" placeholder="Text" />
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
      aspect: this.document.aspectRatio ? this.document.aspectRatio.replace(':', '-') : '1-1'
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
      this.save({
        ...this.document,
        title: this.title,
        text: this.text,
        previewUri: this.preview,
        uri: this.image,
        type: this.type
      })
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
   }
</style>
