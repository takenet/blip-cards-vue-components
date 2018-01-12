<template>
  <div>
    <div :class="'bubble ' + position">
      <div v-if="deletable" class="editIco trashIco" @click="trash(document)">
        <img :src="trashSvg" />
      </div>
      <div v-if="editable && !isEditing" class="editIco" @click="toggleEdit">
        <img :src="editSvg" />
      </div>
      <div class="header" :id="id" v-if="!isEditing">
        <a :href="document.uri" target="_blank">
          <div :class="'ratio ratio' + documentAspect" :style="styleObject">
          </div>
        </a>

        <div class="title" v-if="document.title || document.text">
            <strong v-if="document.title" v-html="document.title"></strong>
            <span v-if="document.text" v-html="document.text"></span>
        </div>
      </div>

      <div class="form" v-else>
        <form novalidate v-on:submit.prevent>
          <div class="saveIco closeIco" @click="imgCancel()" >
            <img :src="closeSvg" />
          </div>
          <div class="saveIco" @click="imgSave()" :class="{'is-disabled': errors.any() }">
            <img :src="approveSvg" />
          </div>
          <div class="form-group">
            <input type="text" name="image" :class="{'input-error': errors.has('image') }" v-validate="'required|url'" class="form-control" v-model="image" placeholder="Image Uri" />
            <span v-if="errors.has('image')" class="help input-error">{{ errors.first('image') }}</span>
            <div class="upload-intructions">
              <span>Supported formats: JPEG,JPG,PNG,GIF.</span>
            </div>
          </div>
          <div class="form-check">
            <div>
              <span>Aspect Ratio:</span>
            </div>
            <div class="form-check-wrapper">
              <span class="form-check-container">
                <input type="radio" name="aspect-selector" :id="_uid+'1-1'" class="form-check-input" v-model="aspect" value="1-1"/>
                <label class="form-check-label" :for="_uid+'1-1'"><span class="radio">1:1</span></label>
                <div class="check"></div>
              </span>
              <span class="form-check-container">
                <input type="radio" name="aspect-selector" :id="_uid+'2-1'" class="form-check-input" v-model="aspect" value="2-1"/>
                <label class="form-check-label" :for="_uid+'2-1'"><span class="radio">2:1</span></label>
                <div class="check"></div>
              </span>
            </div>
          </div>
          <div class="form-group">
            <input type="text" class="form-control" v-model="title" placeholder="Title" />
            <textarea v-model="text" class="form-control text" placeholder="Text" />
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
      styleObject: {
        'border-radius': this.document.title || this.document.text ? '13px 13px 0px 0px' : '13px 13px 13px 0px',
        'background-image': 'url(' + this.document.uri + ')'
      },
      id: guid(),
      title: this.document.title,
      text: this.document.text,
      image: this.document.uri,
      aspect: this.document.aspectRatio ? this.document.aspectRatio.replace(':', '-') : '1-1'
    }
  },
  watch: {
    document: function () {
      this.styleObject = {
        'border-radius': this.document.title || this.document.text ? '13px 13px 0px 0px' : '13px 13px 13px 0px',
        'background-image': 'url(' + this.document.uri + ')'
      }
    }
  },
  computed: {
    documentAspect: function () {
      return this.document.aspectRatio ? this.document.aspectRatio.replace(':', '-') : '1-1'
    },
    type: function () {
      return mime.lookup(this.image) ? mime.lookup(this.image) : 'image/jpeg'
    }
  },
  methods: {
    imgSave: function () {
      this.$validator.validateAll().then((result) => {
        if (!result) return
        this.styleObject['border-radius'] = this.title || this.text ? '13px 13px 0px 0px' : '13px 13px 13px 0px'

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
    imgCancel: function () {
      this.isEditing = false
      this.title = this.document.title
      this.text = this.document.text
      this.image = this.document.uri
      this.aspect = this.document.aspectRatio ? this.document.aspectRatio.replace(':', '-') : '1-1'
    }
  },
  mounted: function () {
    let element = this.$el
    let container = element.parentNode
    let width = parseInt(window.getComputedStyle(container).width.toString().replace('px', ''))

    var bubble = element.querySelector('.bubble')

    if (width <= 500) {
      bubble.style.width = width + 'px'
    } else if (width < 800) {
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
      form {
        width: auto;
      }
      .form-group .form-control.text {
        margin-top: 10px;
      }
    }

    .form-check {
      padding: 0 10px;
      color: $vue-cloud;
      margin: 0;

      input[type="radio"] {
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

      label{
        position: absolute;
        z-index: 1;
        cursor: pointer;
      }
      .check{
        display: block;
        position: absolute;
        border: 1px solid $vue-time;
        border-radius: 100%;
        height: 16px;
        width: 16px;
        top: 0px;
        left: 0px;
        transition: border .25s linear;
        -webkit-transition: border .25s linear;
        -moz-transition: border .25s linear;
        -ms-transition: border .25s linear;
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
      input[type=radio]:checked ~ .check {
        border: 1px solid $vue-light-blip;
      }

      input[type=radio]:checked ~ .check::before{
        background: $vue-light-blip;
      }
    }
  }
</style>
