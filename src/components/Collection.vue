<template>
  <div :class="'container collection'" v-if="document.itemType === 'application/vnd.lime.document-select+json'">

    <div :class="'slideshow-container ' + position" :id="id">
      <div class="slideshow-list">
        <div class="slideshow-track">
          <div v-for="(item, index) in document.items" v-bind:key="index">
            <document-select :length="95" class="slide-item" :position="position" :on-selected="onSelected" :document="item" :editable="editable" :on-save="collectionSave" />
          </div>
        </div>
      </div>

        <a class="prev" v-if="showPrev" @click="plusSlides(-1)">&#10094;</a>
        <a class="next" v-if="showNext" @click="plusSlides(1)">&#10095;</a>
    </div>

    <div :class="'notification ' + position" v-if="date">
      {{ date }}
    </div>
  </div>

  <div v-else-if="document.itemType === 'application/vnd.lime.container+json'">
    <div v-for="(item, index) in document.items" v-bind:key="index">
        <blip-card :position="position" :date="date" :on-selected="onSelected" :document="{ type: item.type, content: item.value }" :editable="editable" />
      </div>
    </div>
  </div>

  <div v-else>
    <div v-for="(item, index) in document.items" v-bind:key="index">
      <blip-card :position="position" :date="date" :on-selected="onSelected" :document="{ type: document.itemType, content: item }" :editable="editable" />
    </div>
  </div>
</template>

<script>

import { guid } from '../utils'
import { default as base } from '../mixins/baseComponent.js'

export default {
  name: 'collection',
  mixins: [
    base
  ],
  props: {
    length: {
      type: Number,
      default: 532
    },
    initWith: {
      type: Number,
      default: 2
    },
    onSelected: {
      type: Function
    }
  },
  data: function () {
    return {
      id: guid(),
      slideIndex: 1,
      width: 0,
      elementsWidth: 0,
      elementsLength: 0,
      showPrev: false,
      showNext: false
    }
  },
  mounted: function () {
    if (this.document.itemType === 'application/vnd.lime.document-select+json') {
      var element = this.$el
      let listElement = element.querySelector('.slideshow-list')
      this.width = parseInt(window.getComputedStyle(listElement).width.toString().replace('px', ''))

      let elements = element.querySelectorAll('.slide-item')
      this.elementsLength = elements.length

      for (let i = 0; i < this.elementsLength; i++) {
        if (this.width < 350) {
          this.elementsWidth = this.width
          elements[i].style.width = this.width + 'px'
        } else {
          this.elementsWidth = this.width / this.initWith
          elements[i].style.width = this.elementsWidth + 'px'
        }
      }

      this.showSlides(this.slideIndex)
    }
  },
  methods: {
    collectionSave: function (document) {
      console.log(document)
    },
    plusSlides: function (n) {
      this.showSlides(this.slideIndex += n)
    },
    showSlides: function (n) {
      var element = document.getElementById(this.id)
      let trackElement = element.querySelector('.slideshow-track')

      this.showPrev = true
      this.showNext = true

      if (n === 1) {
        this.showPrev = false
        trackElement.style.transform = 'translate3d(0px, 0px, 0px)'
      } else {
        let margin = this.elementsWidth === this.width ? 15 : 45
        trackElement.style.transform = 'translate3d(' + (this.elementsWidth * (n - 1) - margin) * -1 + 'px, 0px, 0px)'
      }

      if (n === this.elementsLength) {
        this.showNext = false
      }
    }
  }
}
</script>

<style lang="scss">
   @import '../styles/variables.scss';

    .collection {
    .slideshow-container {
      position: relative;
      margin: auto;

      .slideshow-list {
        position: relative;
        display: block;
        overflow: hidden;
        margin: 0;
        padding: 0px 30px;
      }

      .slideshow-track {
        position: relative;
        transition: all .8s ease;
        opacity: 1;
        width: 30000px;
        transform: translate3d(0px, 0px, 0px);
        display: block;
        top: 0;
        left: 0;
      }

      .bubble {
        width: 100%;
      }

      .slide-item {
        float: left;
        height: 100%;
        min-height: 1px;
      }

      a {
        text-decoration: none;
      }
    }

    .slide-item {
        // display: none;
    }

    .prev, .next {
      cursor: pointer;
      position: absolute;
      top: 50%;
      width: auto;
      margin-top: -22px;
      padding: 16px;
      color: $vue-light-blip;
      font-weight: bold;
      font-size: 18px;
      transition: 0.6s ease;
      border-radius: 5px 0 0 5px;
      box-shadow: -8px 3px 12px 0 #D3D3D3;
      background-color: #FFFFFF;
    }

    /* Position the "next button" to the right */
    .next {
      right: 0;
      border-radius: 3px 0 0 3px;
    }

    /* On hover, add a black background color with a little bit see-through */
    .prev:hover, .next:hover {
      background-color: rgba(0,0,0,0.8);
    }

    .fade {
      -webkit-animation-name: fade;
      -webkit-animation-duration: 1.5s;
      animation-name: fade;
      animation-duration: 1.5s;
    }

    @-webkit-keyframes fade {
      from {opacity: .4}
      to {opacity: 1}
    }

    @keyframes fade {
      from {opacity: .4}
      to {opacity: 1}
    }
  }
</style>
