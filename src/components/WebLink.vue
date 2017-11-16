<template>
  <div class="container web-link">
    <div :class="'bubble ' + position">
      <a :href="this.uri" :target="this.target" v-if="this.title || this.text" class="web-link-wrapper">
        <img class="preview" :src="this.imgPreview">
        <div class="description-column">
          <span>{{this.title}}</span>
          <span class="light-text" v-text="this.text"></span>
          <span class="small-text" v-text="this.uri"></span>
        </div>
      </a>
      <div v-else>
        <span v-html="this.textLink"></span>
      </div>
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
      uri: new URL(this.document.uri),
      target: this.document.target === 'blank' ? '_blank' : '_self'
    }
  },
  computed: {
    textLink: function () {
      return linkify(this.document.uri)
    }
  },
  created: async function () {
    if (this.title && this.title.length > this.length) this.title = this.title.substring(0, this.length - 3) + '...'
    if (this.text && this.text.length > this.length) this.text = this.text.substring(0, this.length - 3) + '...'
    this.uri = this.uri.protocol + '//' + this.uri.hostname

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
    padding: $bubble-padding;

    a.web-link-wrapper {
      color: inherit;
      text-decoration: inherit;
    }

    .web-link-wrapper {
      display: flex;
      flex-direction: row;
      flex-grow: 1;

      .preview {
        max-width: 100px;
        max-height: 100px;
        object-fit: contain;
        align-self: center;
      }

      .light-text {
        font-size: 12px;
        font-weight: 100;
        flex-grow: 1;
      }
      .small-text {
        font-size: 10px;
        font-weight: 100;
      }

      .description-column {
        display: flex;
        flex-direction: column;
      }
    }
  }
</style>
