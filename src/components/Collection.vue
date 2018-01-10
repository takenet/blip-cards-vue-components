<template>
  <div>
    <div :class="'blip-container collection'" v-if="document.itemType === 'application/vnd.lime.document-select+json'">
      <div :class="'slideshow-container ' + position" :id="id">
        <div class="slideshow-list">
          <div class="slideshow-track">
            <div v-for="(item, index) in items" v-bind:key="index">
              <document-select :length="95" class="slide-item" :position="position" :on-selected="onSelected" :document="item" :deletable="deletable"
                :editable="editable" :on-save="collectionSave" :style="styleObject" :on-deleted="deleteItem" />
            </div>
            <div v-if="isEditing">
              <document-select :style="styleObject" :length="95" class="slide-item" :position="position" :on-selected="onSelected"
                :document="newDocumentSelect" :editable="editable" :on-save="addToCollection" :init-editing="true" :on-deleted="deleteItem" />
            </div>
            <div v-if="editable" @click="isEditing = true">
              <div :class="'collection-editable slide-item'" :style="styleObject">
                <img :src="plusSvg" style="position: absolute; top: 50%; left: 50%; width: 50px; height: 50px; margin-top: -25px; margin-left: -25px" />
              </div>
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
    <div v-else>
      <div v-for="(item, index) in document.items" v-bind:key="index">
        <blip-card :position="position" :date="date" :on-selected="onSelected" :document="{ type: document.itemType, content: item }" :editable="editable" />
      </div>
    </div>
  </div>
</template>

<script>

import { guid } from '../utils'
import { default as base } from '../mixins/baseComponent.js'
import _ from 'lodash'

let newCollection = {'header': {'type': 'application/vnd.lime.media-link+json', 'value': {'title': '', 'text': '', 'type': '', 'uri': '', 'aspectRatio': ''}}, 'options': []}

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
  computed: {
    showPrev: function () {
      return this.slideIndex !== 1
    },
    showNext: function () {
      let length = this.editable ? this.items.length + 1 : this.items.length
      return this.slideIndex !== length
    }
  },
  data: function () {
    return {
      id: guid(),
      slideIndex: 1,
      width: 0,
      elementsWidth: 0,
      elementsLength: 0,
      items: this.document.items.map(function (x, i) {
        return {
          ...x,
          'id': i
        }
      }),
      styleObject: {
        'margin-top': '20px'
      },
      newDocumentSelect: _.cloneDeep(newCollection)
    }
  },
  watch: {
    document: function () {
      this.items = this.document.items.map(function (x, i) {
        return {
          ...x,
          'id': i
        }
      })
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
        if (this.width <= 400) {
          this.elementsWidth = this.width - 50
          elements[i].style.width = this.width - 50 + 'px'
        } else {
          this.elementsWidth = this.width / this.initWith
          elements[i].style.width = this.elementsWidth + 'px'
        }
      }

      this.styleObject['width'] = this.elementsWidth + 'px'
      this.showSlides(this.slideIndex)
    }
  },
  methods: {
    deleteItem: function (document) {
      this.items = this.items.filter(x => x !== document)

      if (this.items.length === 0) {
        this.trash({
          ...this.document,
          items: this.items
        })
      } else {
        this.save({
          ...this.document,
          items: this.items
        })
      }
    },
    addToCollection: function (document) {
      this.items.push(document)
      this.newDocumentSelect = _.cloneDeep(newCollection)

      this.save({
        ...this.document,
        items: this.items
      })
    },
    collectionSave: function (document) {
      let items = this.items.filter(x => x.id !== document.id)
      items.splice(document.id, 0, document)

      let tempEditing = this.isEditing
      this.save({
        ...this.document,
        items: items
      })
      this.isEditing = tempEditing
    },
    plusSlides: function (n) {
      this.showSlides(this.slideIndex += n)
    },
    showSlides: function (n) {
      var element = this.$el
      let trackElement = element.querySelector('.slideshow-track')

      if (n === 1) {
        trackElement.style.transform = 'translate3d(0px, 0px, 0px)'
      } else {
        let margin = this.elementsWidth === this.width ? -10 : 10
        trackElement.style.transform = 'translate3d(' + (this.elementsWidth * (n - 1) - margin) * -1 + 'px, 0px, 0px)'
      }
    }
  }
}
</script>

<style lang="scss">
  @import '../styles/variables.scss';

  .collection-editable {
    height: 100%;
    border: 1px dashed $vue-time;
    position: relative;
    cursor: pointer;
  }

  .collection {
    .slideshow-container {
      margin: auto;

      .slideshow-list {
        overflow: hidden;
        margin: 0;
        padding: 0px 30px;
      }

      .slideshow-track {
        transition: all .8s ease;
        opacity: 1;
        width: 30000px;
        transform: translate3d(0px, 0px, 0px);
        display: flex;
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

    .prev, .next {
      cursor: pointer;
      position: absolute;
      top: 50%;
      width: auto;
      margin-top: -22px;
      padding: 8px 16px;
      color: $vue-light-blip;
      font-weight: bold;
      font-size: 18px;
      transition: 0.6s ease;
      border-radius: 5px 0 0 5px;
      box-shadow: -2px 2px 20px 0 rgba(51, 60, 74, 0.4);
      background-color: #FFFFFF;
    }

    .prev {
      left: 0;
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
