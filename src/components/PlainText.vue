<template>
  <div>
    <div :class="'bubble plain-text ' + pos" v-for="(item, index) in previewDocuments">
      <div v-if="!item.hasPreview">
        {{ item.content }}
      </div>
      <div v-else>
        <div v-show="!item.showContent">
          {{ item.previewContent }}
        </div>
        <transition name="slide-fade">
          <div v-show="item.showContent">
            {{ item.content }}
          </div>
        </transition>
        <a v-show="!item.showContent" v-on:click="showContent(item)">Ver mais</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    length: {
      type: Number,
      default: 10
    },
    documents: {
      type: Array,
      required: true
    },
    pos: {
      type: String,
      default: 'left'
    }
  },
  data: function () {
    return {
      previewDocuments: this.documents.filter(x => {
        x.previewContent = x.content.substring(0, this.length)
        x.hasPreview = x.content.length > this.length
        x.showContent = false
        return x
      })}
  },
  methods: {
    showContent: function (document) {
      document.showContent = true
    }
  }
}
</script>

<style lang="scss" scoped>
   @import '../styles/common.scss';

   a {
     text-decoration: none;
     color: blue;
     display: block;
     color: #0CC8CC;
   }
</style>