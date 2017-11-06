<template>
  <div v-if="document != null" class="container document-select">
    <div :class="'bubble ' + position">
      <div class="header">
        <div :class="'ratio' + aspectRatio">
          <img :src="document.header.value.uri" />
        </div>

        <div class="title" v-if="document.header.value.title || document.header.value.text">
            <strong v-if="document.header.value.title" v-html="document.header.value.title"></strong>
            <span v-if="previewContent && !showContent" v-html="previewContent"></span>
            <transition name="slide-fade">
              <div v-if="showContent && hasPreview" v-html="document.header.value.text">
              </div>
            </transition>
            <a style="display: block;" v-if="!showContent && hasPreview" @click="showContent = true">Ver mais</a>
        </div>
      </div>

      <div class="fixed-options">
        <ul>
          <li v-for="(item, index) in options">
            <span v-if="!item.isLink" @click="select(item)" v-html="item.previewText"></span>
            <a v-if="item.isLink" :href="item.label.value.uri" target="_blank" v-html="item.previewText"></a>
          </li>
        </ul>
      </div>
    </div>

    <div :class="'notification ' + position" v-if="date">
      {{ date }}
    </div>
  </div>
</template>

<script>

import { linkify } from '../utils'

export default {
  props: {
    length: {
      type: Number,
      default: 532
    },
    document: {
      type: Object,
      required: true
    },
    position: {
      type: String,
      default: 'left'
    },
    date: {
      type: String
    },
    onSelected: {
      type: Function
    }
  },
  data: function () {
    return {
      showContent: false
    }
  },
  computed: {
    aspectRatio: function () {
      return this.document.header.value.aspectRatio ? this.document.header.value.aspectRatio.replace(':', '-') : '2-1'
    },
    previewContent: function () {
      return this.document.header.value.text ? linkify(this.document.header.value.text.substring(0, this.length)) : ''
    },
    hasPreview: function () {
      return this.document.header.value.text && this.document.header.value.text.length > this.length
    },
    options: function () {
      return this.document.options.map(function (x) {
        let opts = {
          ...x,
          isLink: x.label.type === 'application/vnd.lime.web-link+json',
          previewText: x.label.type === 'application/vnd.lime.web-link+json' ? x.label.value.title || x.label.value.text : x.label.value
        }
        return opts
      })
    }
  },
  methods: {
    select: function (item) {
      if (this.onSelected) {
        this.onSelected(item.previewText, {
          type: item.value.type,
          content: item.value.value
        })
      }
    }
  }
}
</script>

<style lang="scss">
   @import '../styles/variables.scss';

  .document-select {

    .header {
      max-width: 350px;
      min-width: 200px;

      .ratio1-1 {
        overflow: hidden;
        position: relative;

        &:before {
          content: '';
          display: block;
          padding-top: 100%; // ratio 1:1
        }
      }

      .ratio2-1 {
        overflow: hidden;
        position: relative;

        &:before {
          content: '';
          display: block;
          padding-top: 50%; // ratio 2:1
        }
      }

      img {
          position: absolute;
          width: 100%;
          height: 100%;
          object-fit: cover;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
        }

      .title {
        strong {
          color: $vue-dark-gray;
          display: block;
        }

        margin: 0;
        padding: 10px 20px;
        border-bottom: 0.5px solid #e4e2e2;
      }
    }

    .fixed-options ul {
      margin: 0px;
    }

    .fixed-options li:first-child {
      border-top: 0px;
    }
  }

</style>
