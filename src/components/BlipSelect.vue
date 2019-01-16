<template>
  <div v-if="!isEditing" @show="checkForEndOfSlider" class="blip-container select">
    <div v-if="document.scope === 'immediate'" :class="isFailedMessage(status, position)">
      <div :class="'bubble ' + position">
        <div v-if="deletable" class="editIco trashIco" @click="trash(document)">
          <img :src="trashSvg" />
        </div>
        <div v-if="editable && !isEditing" class="editIco" @click="toggleEdit">
          <img :src="editSvg" />
        </div>
        <div v-html="computedText" v-if="computedText"></div>
      </div>

      <div class="flex" :class="'notification ' + position" v-if="date">
        <img v-if="status === 'accepted' && this.position === 'right'" :src="checkSentSvg"/>
        <img v-else-if="status === 'received' && this.position === 'right'" :src="doubleCheckReceivedSvg"/>
        <img v-else-if="status === 'consumed' && this.position === 'right'" :src="doubleCheckReadSvg"/>
        <div
          class="failure"
          v-else-if="this.status === 'failed' && this.position === 'right'">
          Falha ao enviar a mensagem.
        </div>
        {{ date }}
      </div>
      <transition name="fade">
      <div :class="'slideshow-container ' + position" :id="id" v-touch:swipe.left="swipeLeftHandler" v-touch:swipe.right="swipeRightHandler" v-if="!hide">
        <div class="slideshow-list">
          <div class="slideshow-track options">
            <ul class="item-list">
              <li v-for="(item, index) in options" v-bind:key="index" @click="select(item)" class="disable-selection">
                <div v-html="item.previewText"></div>
              </li>
            </ul>
          </div>
        </div>

        <a class="prev" v-if="showPrev" @dblclick="$event.stopPropagation()" @click="plusSlides(-1)">&#10094;</a>
        <a class="next" v-if="showNext" @dblclick="$event.stopPropagation()" @click="plusSlides(1)">&#10095;</a>
      </div>

      </transition>
    </div>

    <div v-else :class="isFailedMessage(status, position)">
      <div :class="'bubble ' + position">
        <div v-if="deletable" class="editIco trashIco" @click="trash(document)">
          <img :src="trashSvg" />
        </div>
        <div v-if="editable && !isEditing" class="editIco" @click="toggleEdit">
          <img :src="editSvg" />
        </div>
        <div class="text-left" v-html="computedText"></div>
        <div class="fixed-options disable-selection">
          <ul>
            <li v-for="(item, index) in options" v-bind:key="index" @click="select(item)">
              <div v-html="item.text"></div>
            </li>
          </ul>
        </div>
      </div>

      <div class="flex" :class="'notification ' + position" v-if="date">
        <img v-if="status === 'accepted' && this.position === 'right'" :src="checkSentSvg"/>
        <img v-else-if="status === 'received' && this.position === 'right'" :src="doubleCheckReceivedSvg"/>
        <img v-else-if="status === 'consumed' && this.position === 'right'" :src="doubleCheckReadSvg"/>
        <div v-else-if="this.status === 'failed' && this.position === 'right'" class="failure" >
          Falha ao enviar a mensagem.
        </div>
        {{ date }}
      </div>
    </div>
  </div>

  <div class="blip-container select" v-else-if="!addOption">
    <form :class="'bubble ' + position" novalidate v-on:submit.prevent>
      <button class="btn saveIco closeIco" @click="selectCancel()" >
        <img :src="closeSvg" />
      </button>
      <button class="btn saveIco" :class="{'is-disabled': errors.any() }" @click="selectSave(text)">
        <img :src="approveSvg" />
      </button>
      <div class="form-group">
        <textarea @keydown.enter="selectSave(text, $event)" type="text" name="text" :class="{'input-error': errors.has('text') }" v-validate="'required'" class="form-control" v-auto-expand v-model="text" />
        <span v-show="errors.has('text')" class="help input-error">{{ errors.first('text') }}</span>
      </div>

      <div class="text-center" :class="{ 'fixed-options': document.scope !== 'immediate', 'options': document.scope === 'immediate'}">
        <ul>
          <li v-for="(item, index) in options" v-bind:key="index" @click="editOption(item, index, $event)">
            <span v-html="item.text"></span>
            <span @click="deleteOption(index, $event)" class="remove-option"><img :src="closeBlueSvg"></span>
          </li>
          <li class="btn-dashed primary-color" v-if="document.scope === 'immediate'" @click="editOption({}, -1, $event)">
            <span>Add option</span>
          </li>
        </ul>
        <span v-show="hasDeleteOptionError" class="remove-option-error">Requires at least 1 option</span>
        <div v-if="document.scope !== 'immediate'" @click="editOption({}, -1, $event)" class="btn-dashed primary-color btn" style="margin-top: 10px; width: 100%;">
          <span>Add Button</span>
        </div>
      </div>

      <button v-if="typeof onMetadataEdit === 'function'" class="define-metadata blip-select-metadata" @click="editMetadata(fullDocument)">
        {{ metadataButtonText }}
      </button>
    </form>
  </div>

  <div class="blip-container" v-else>
    <form novalidate v-on:submit.prevent :class="'bubble ' + position">
      <div class="tabs">
        <span :class="{ 'active': headerTab === 'plainText'}" @click="setTab('plainText')">Text</span>
      </div>

      <div v-if="headerTab === 'plainText'">
        <div class="form-group">
          <input type="text" name="optionText" v-validate="'required'" class="form-control" v-model="selectedOption.text" placeholder="Text" />
          <span v-show="errors.has('optionText')" class="help input-error">{{ errors.first('optionText') }}</span>
        </div>

        <input id="showPayload" type="checkbox"  v-model="showPayload"><label for="showPayload">Set Payload</label>
        <div class="line"></div>

        <div v-show="showPayload">
          <div class="form-group">
            <input type="text" name="type" v-validate="showPayload ? 'required|mime' : ''"  class="form-control" v-model="selectedOption.type" placeholder="Postback mime type" />
            <span v-show="errors.has('type')" class="help input-error">{{ errors.first('type') }}</span>
          </div>
          <div class="form-group">
            <textarea @keydown.enter="saveOption($event)" v-if="selectedOption.type && selectedOption.type.includes('json')" name="value" v-validate="showPayload ? 'required|json' : ''" class="form-control" v-model="selectedOption.value" placeholder="Postback value" />
            <textarea @keydown.enter="saveOption($event)" v-else name="value" v-validate="showPayload ? 'required' : ''" class="form-control" v-model="selectedOption.value" placeholder="Postback value" />
            <span v-show="errors.has('value')" class="help input-error">{{ errors.first('value') }}</span>
          </div>
        </div>
      </div>

      <div class="form-group blip-card-flex">
        <div class="flex-item">
          <button type="button" @click="cancelOption()" class="btn btn-white color-gray">Cancel</button>
        </div>
        <div class="flex-item">
          <button @click="saveOption()" class="btn btn-white primary-color" :class="{'is-disabled': errors.any() }">Apply</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { default as base } from '../mixins/baseComponent.js'
import { linkify, guid, isFailedMessage } from '../utils/misc'
import debounce from 'lodash/debounce'
const optionSize = 34

export default {
  name: 'blip-select',
  mixins: [base],
  props: {
    hideOptions: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      default: ''
    },
    onSelected: {
      type: Function
    }
  },
  data: function() {
    return {
      addOption: undefined,
      showPayload: undefined,
      headerTab: undefined,
      selectedOption: undefined,
      hide: undefined,
      text: undefined,
      options: undefined,
      id: undefined,
      slideIndex: undefined,
      endOfSlider: undefined,
      hasDeleteOptionError: false,
      isFailedMessage
    }
  },
  updated: function() {
    this.$nextTick(function() {
      this.checkForEndOfSlider()
    })
  },
  mounted: function() {
    this.$nextTick(function() {
      this.checkForEndOfSlider()
    })
  },
  computed: {
    computedText: function() {
      return linkify(this.document.text)
    },
    showPrev: function() {
      return this.slideIndex !== 1
    },
    showNext: function() {
      return !this.endOfSlider
    }
  },
  watch: {
    hideOptions: function() {
      this.hide = this.hideOptions
    }
  },
  methods: {
    init: function() {
      this.id = guid()
      this.slideIndex = 1
      this.endOfSlider = false
      this.addOption = false
      this.showPayload = false
      this.headerTab = 'plainText'
      this.selectedOption = { value: {} }
      this.hide = this.hideOptions
      this.text = this.document.text
      this.options = this.document.options.map(function(x) {
        let value
        if (x.value) {
          if (x.type && x.type.includes('json')) {
            value = JSON.stringify(x.value)
          } else {
            value = x.value
          }
        } else {
          value = ''
        }

        let opts = {
          ...x,
          previewText:
            x.text.length > optionSize
              ? x.text.substring(0, optionSize) + '...'
              : x.text,
          value
        }

        return opts
      })
    },
    plusSlides: function(n) {
      this.showSlides((this.slideIndex += n))
      this.checkForEndOfSlider()
    },
    swipeLeftHandler: function() {
      if (this.showNext) {
        this.plusSlides(1)
      }
    },
    swipeRightHandler: function() {
      if (this.showPrev) {
        this.plusSlides(-1)
      }
    },
    checkForEndOfSlider: function() {
      var element = this.$el
      let slider = element.querySelector('.slideshow-list')
      let itemList = element.querySelector('.item-list')
      if (!element || !slider || !itemList) {
        return
      }
      let sliderWidth = parseInt(
        window
          .getComputedStyle(slider)
          .width.toString()
          .replace('px', '')
      )
      let itemListWidth = parseInt(
        window
          .getComputedStyle(itemList)
          .width.toString()
          .replace('px', '')
      )
      this.endOfSlider =
        sliderWidth + 0.5 * sliderWidth * (this.slideIndex - 1) - 20 >
        itemListWidth
    },
    showSlides: function(n) {
      var element = this.$el
      if (!element) {
        return
      }
      let trackElement = element.querySelector('.slideshow-track')
      if (n === 1) {
        trackElement.setAttribute(
          'style',
          'transform: translate3d(0px, 0px, 0px); -webkit-transform: translate3d(0px, 0px, 0px);'
        )
      } else {
        let slider = element.querySelector('.slideshow-list')
        let sliderWidth = parseInt(
          window
            .getComputedStyle(slider)
            .width.toString()
            .replace('px', '')
        )
        let translation = -0.5 * sliderWidth * (n - 1)
        const data = `translate3d(${translation}px, 0px, 0px)`
        trackElement.setAttribute(
          'style',
          `transform: ${data}; -webkit-transform: ${data};`
        )
      }
    },
    setTab: function(name) {
      this.headerTab = name
    },
    deleteOption: function(index, $event) {
      if ($event) {
        $event.stopPropagation()
      }
      if (this.options.length < 2) {
        this.hasDeleteOptionError = true
        return
      }
      this.options.splice(index, 1)
    },
    cancelOption: function(item) {
      this.errors.clear()
      this.$validator.clean()
      this.selectedOption = {}
      this.addOption = false
    },
    saveOption: function($event) {
      this.$validator.validateAll()
      if (this.errors.any() || ($event && $event.shiftKey)) {
        return
      }

      if ($event) {
        $event.stopPropagation()
        $event.preventDefault()
        $event.returnValue = false
      }

      this.addOption = false
      this.selectedOption.previewText =
        this.selectedOption.text.length > optionSize
          ? this.selectedOption.text.substring(0, optionSize) + '...'
          : this.selectedOption.text
      if (!this.showPayload) {
        this.selectedOption.value = this.selectedOption.type = null
      }
      if (this.selectedOption.index === -1) {
        this.options.push(this.selectedOption)
      } else {
        this.options.splice(this.selectedOption.index, 1, this.selectedOption)
      }

      this.selectedOption = {}
      this.errors.clear()
      this.$validator.clean()

      this.addOption = false
    },
    editOption: function(item, index, $event) {
      this.hasDeleteOptionError = false
      this.addOption = true

      this.selectedOption = { ...item }

      if (!this.selectedOption.value || !this.selectedOption.type) {
        this.showPayload = false
      } else {
        this.showPayload = true
      }

      this.selectedOption.index = index
    },
    selectSave: function(text, $event) {
      this.hasDeleteOptionError = false
      if (this.errors.any() || ($event && $event.shiftKey)) {
        return
      }
      this.slideIndex = 1
      if ($event) {
        $event.stopPropagation()
        $event.preventDefault()
        $event.returnValue = false
      }

      this.$validator.validateAll().then((result) => {
        if (!result) return
        this.selectedOption = {}
        this.addOption = false

        this.save({
          ...this.document,
          text: this.text,
          options: this.options.map(function(x) {
            let value
            if (x.value) {
              if (x.type.includes('json')) {
                value = JSON.parse(x.value)
              } else {
                value = x.value
              }
            } else {
              value = null
            }

            return {
              ...x,
              value
            }
          })
        })
      })
    },
    selectCancel: function() {
      this.hasDeleteOptionError = false
      this.cancel()
    },
    select: debounce(
      function(item) {
        if (!this.editable) {
          this.hide = true
        }

        if (this.onSelected) {
          if (item.value) {
            this.onSelected(item.text, {
              type: item.type,
              content:
                item.type.indexOf('json') !== -1
                  ? JSON.parse(item.value)
                  : item.value
            })
          } else {
            this.onSelected(item.text, {
              content: item.order ? item.order.toString() : item.text,
              type: 'text/plain'
            })
          }
        }
      },
      500,
      { leading: true, trailing: false }
    )
  }
}
</script>

<style lang="scss">
@import '../styles/variables.scss';

.select .bubble {
  padding: $bubble-padding;
  min-width: auto;
  text-align: left;
}

.select .options ul {
  list-style-type: none;
  clear: both;
  margin: 0;
  padding: 10px;
}

.select {
  a {
    text-decoration: none;
  }
  .slideshow-container {
    margin: auto;
    clear: both;

    .slideshow-list {
      overflow: hidden;
      margin: 0;
      padding: 0px;
    }

    .slideshow-track {
      transition: all 0.8s ease;
      opacity: 1;
      width: 30000px;
      transform: translate3d(0px, 0px, 0px);
      display: flex;
      top: 0;
      left: 0;
    }

    .slide-item {
      float: left;
      min-height: 1px;
      margin-right: 10px;
      height: calc(100% - 35px);
    }
  }
  .prev,
  .next {
    cursor: pointer;
    position: absolute;
    bottom: 15px;
    width: auto;
    padding: 8px 16px;
    opacity: 0.8;
    color: $vue-light-blip;
    font-weight: bold;
    font-size: 18px;
    transition: 0.6s ease;
    border-radius: 5px 0 0 5px;
    box-shadow: -2px 2px 20px 0 rgba(51, 60, 74, 0.4);
    background-color: #ffffff;
  }

  .prev {
    left: 0;
    border-radius: 0 5px 5px 0;
  }

  /* Position the "next button" to the right */
  .next {
    right: 0px;
    border-radius: 3px 0 0 3px;
    @media screen and (max-width: 480px) {
      right: 0;
    }
  }

  /* On hover, add a black background color with a little bit see-through */
  .slideshow-container:hover .prev,
  .slideshow-container:hover .next {
    opacity: 1;
  }

  .fade {
    -webkit-animation-name: fade;
    -webkit-animation-duration: 1.5s;
    animation-name: fade;
    animation-duration: 1.5s;
  }

  .blip-select-metadata {
    padding: 10px 0 0 0;
  }
}

.select .options li {
  cursor: pointer;
  display: inline-flex;
  align-items: end;
  background-color: #daf2f4;
  border: 1px solid #0cc8cc;
  box-shadow: 0 -1px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 19px;
  padding: 10px 16px;
  margin: 4px;
  color: #0cc8cc;
  font-size: 16px;
  font-weight: 500;

  span {
    line-height: 1;
  }

  .remove-option {
    margin-left: 8px;

    img {
      width: 12px;
      height: 14px;
    }
  }
}

.select .fixed-options li:last-child {
  padding-bottom: 0px;
}

.remove-option-error {
  color: $vue-warning;
  size: 5px;
  font-size: 12px;
  text-align: left;
  display: flex;
  padding-left: 15px;
  margin-top: -10px;
}
</style>
