<template>
  <div>
    <div v-if="editable && !isEditing" class="editIco" @click="toggleEdit">
      <img :src="editSvg" />
    </div>

    <div :class="'bubble ' + position">
      <div class="header" :id="id" v-if="!isEditing">
        <a :href="document.uri" target="_blank">
          <div :class="'ratio ratio' + aspectRatio" :style="'background-image: url(' + previewUri + ')'">
          </div>
        </a>

        <div class="title" v-if="title || text">
            <strong v-if="title" v-html="title"></strong>
            <span v-if="text" v-html="text"></span>
        </div>
      </div>

      <div v-else>
        <div class="saveIco" @click="imgSave()">
          <img :src="approveSvg" />
        </div>

        <input type="text" v-model="preview" placeholder="Preview Uri" />
        <input type="text" v-model="image" placeholder="Image Uri" />
        <input type="text" v-model="title" placeholder="Title" />
        <textarea v-model="text" placeholder="Text" />
      </div>
    </div>
  </div>
</template>

<script>

import { guid } from '../../utils'
import { default as base } from '../../mixins/baseComponent.js'

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
      image: this.document.uri
    }
  },
  computed: {
    aspectRatio: function () {
      return this.document.aspectRatio ? this.document.aspectRatio.replace(':', '-') : '1-1'
    },
    previewUri: function () {
      return this.preview ? this.preview : this.image
    }
  },
  methods: {
    imgSave: function () {
      this.save({
        ...this.document,
        title: this.title,
        text: this.text,
        previewUri: this.preview,
        uri: this.image
      })
    }
  },
  mounted: function () {
    console.log(JSON.stringify(this.document))
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
