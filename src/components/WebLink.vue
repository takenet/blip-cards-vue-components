<template>
  <div class="container web-link">
    <div v-if="this.title || this.text" :class="'bubble ' + position">
      <a :href="this.uri" :target="this.target" class="web-link-wrapper">
        <img class="preview" :src="this.imgPreview">
        <div class="right-column">
          <div class="link-description">
            <span class="text big-text" v-text="this.title"></span>
            <span class="text light-text" v-text="this.text"></span>
          </div>
          <span class="text small-text" v-text="this.uri"></span>
        </div>
      </a>
    </div>
    <div v-else :class="'bubble text-link ' + position">
        <span v-html="this.textLink"></span>
    </div>
    <div :class="'notification ' + position" v-if="date">
      {{ date }}
    </div>
  </div>
</template>

<script>

import { default as base } from '../mixins/baseComponent.js'
import { linkify } from '../utils'
import MetaInspector from 'node-metainspector'

export default {
  name: 'web-link',
  mixins: [
    base
  ],
  props: {
    length: {
      type: Number,
      default: 532
    }
  },
  data: function () {
    return {
      imgPreview: this.document.previewUri,
      title: this.document.title,
      text: this.document.text,
      uri: this.document.uri,
      target: this.document.target === 'blank' ? '_blank' : '_self'
    }
  },
  computed: {
    textLink: function () {
      return linkify(this.document.uri)
    }
  },
  created: function () {
    if (this.title && this.title.length > this.length) this.title = this.title.substring(0, this.length - 3) + '...'
    if (this.text && this.text.length > this.length) this.text = this.text.substring(0, this.length - 3) + '...'
    this.uri = new URL(this.uri)
    this.uri = (this.uri.protocol + '//' + this.uri.hostname)

    var client = new MetaInspector(this.uri, { timeout: 5000 })
    client.on('fetch', () => {
      if (!this.title && client.title) this.title = client.title
      if (!this.text && client.description) this.text = client.description
      if (!this.imgPreview && client.image) this.imgPreview = client.image
    })
    client.fetch()
  }
}
</script>


<style lang="scss">
   @import '../styles/variables.scss';

  .web-link .bubble {
    padding: 0;
    height: 100px;

    &.text-link {
      padding: $bubble-padding;
      height: auto;

      a {
        word-break: break-all;
      }
    }

    a.web-link-wrapper {
      color: inherit;
      text-decoration: inherit;
    }

    .web-link-wrapper {
      display: flex;
      flex-direction: row;
      flex-grow: 1;

      .preview {
        height: 100px;
        object-fit: contain;
      }

      .link-description {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        max-height: 76px;
      }

      .text {
        overflow: hidden;
        position: relative;
      }
      .text::after {
        content: "";
        text-align: right;
        position: absolute;
        bottom: 0;
        right: 0;
        width: 40%;
        height: 19px;
        background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 50%);
      }


      .big-text {
        max-height: 38px;
      }

      .light-text {
        font-size: 12px;
        font-weight: 100;
        max-height: 38px;
      }

      .small-text {
        font-size: 10px;
        font-weight: 100;
        word-break: break-all;
        height: 19px;
      }
      .small-text::after {
        width: 25%;
      }

      .right-column {
        display: flex;
        flex-direction: column;
        padding: 5px 10px 0 10px;
      }
    }
  }
</style>
