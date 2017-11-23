<template>
  <div class="blip-container web-link">
    <div v-if="this.title || this.text" :class="'bubble ' + position">
      <span class="link web-link-wrapper" @click="handleWeblink()">
        <img v-if="this.title" class="preview" :src="this.imgPreview">
        <div class="right-column">
          <div class="link-description">
            <span class="text big-text" v-text="this.title"></span>
            <span class="text light-text" v-text="this.text"></span>
          </div>
          <span class="text small-text" v-text="this.uri"></span>
        </div>
      </span>
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
    onOpenLink: {
      type: Function
    }
  },
  data: function () {
    return {
      imgPreview: this.document.previewUri,
      title: this.document.title,
      text: this.document.text,
      uri: this.document.uri,
      target: this.document.target || 'blank'
    }
  },
  computed: {
    textLink: function () {
      return linkify(this.document.uri)
    }
  },
  created: function () {
    var client = new MetaInspector(this.uri, { timeout: 5000 })
    client.on('fetch', () => {
      if (!this.title && client.title) this.title = client.title
      if (!this.text && client.description) this.text = client.description
      if (!this.imgPreview && client.image) this.imgPreview = client.image
    })
    client.fetch()
  },
  methods: {
    handleWeblink: function () {
      if (this.target === 'blank') {
        window.open(this.uri, '_blank')
      } else {
        this.onOpenLink(this.uri, this.target)
      }
    }
  }
}
</script>


<style lang="scss">
   @import '../styles/variables.scss';

  .web-link .bubble {
    padding: 0;
    height: 100px;
    overflow: hidden;

    &.text-link {
      padding: $bubble-padding;
      height: auto;

      a {
        word-break: break-all;
      }
    }

    &.right .web-link-wrapper {
      .text::after {
        content: "";
        background: linear-gradient(to right, rgba(255, 255, 255, 0), $vue-light-blip 50%);
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

      &.link {
        cursor: pointer;
      }

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
        width: 50px;
        height: 19px;
        background: linear-gradient(to right, rgba(255, 255, 255, 0), $vue-white 50%);
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
