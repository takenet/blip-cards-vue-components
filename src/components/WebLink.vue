<template>
  <div class="blip-container web-link">
    <div v-if="this.title || this.text" :class="'bubble ' + position">
      <span class="link web-link-wrapper" @click="handleWeblink()">
        <img v-if="this.title" class="preview" :src="this.imgPreview">
        <div class="link-description-wrapper">
          <span class="text big-text" :title="title" v-text="title"></span>
          <span class="text light-text" :title="text">{{ text | limitContentFilter('60') }}</span>
          <span class="text small-text" :title="uri" v-text="uri"></span>
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
  },
  filters: {
    limitContentFilter: function (content, charLimit) {
      let data = content || ''

      let input = (typeof data === 'object') ? JSON.stringify(data) : data

      if (input && charLimit && input.length > charLimit) {
        return input.slice(0, charLimit) + '...'
      }

      return input
    }
  }
}
</script>


<style lang="scss">
   @import '../styles/variables.scss';

  .web-link .bubble {
    padding: 0;
    overflow: hidden;

    &.text-link {
      padding: $bubble-padding;
      height: auto;
    }

    .web-link-wrapper {
      display: flex;
      flex-direction: row;
      flex-grow: 1;

      &.link {
        cursor: pointer;
      }

      .preview {
        max-height: 100px;
        object-fit: contain;
        align-self: center;
      }

      .link-description-wrapper {
        display: flex;
        flex-direction: column;
        padding: 10px 16px;
        overflow: hidden;
        min-height: 100px;

        .text {
          overflow: hidden;
          position: relative;
          text-overflow: ellipsis;
        }

        .big-text {
          white-space: nowrap;
        }

        .light-text {
          font-size: 12px;
          font-weight: 100;
          flex-grow: 1;
        }

        .small-text {
          font-size: 10px;
          font-weight: 100;
          white-space: nowrap;
        }
      }
    }
  }
</style>
