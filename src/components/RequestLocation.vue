<template>
  <div v-if="!isEditing" class="blip-container request-location">
    <div :class="`bubble ${position}`">
      <div v-if="deletable" class="editIco trashIco" @click="trash(document)">
        <img :src="trashSvg" />
      </div>
      <div v-if="editable" class="editIco" @click="toggleEdit">
        <img :src="editSvg" />
      </div>

      <div v-if="!previewDocument.hasPreview" class="label-wrappper">
        <span>{{ previewDocument.content }}</span>
      </div>
      <div v-else class="label-wrapper">
        <div v-show="!showContent">
          <span>{{ previewDocument.previewContent }}</span>
        </div>
        <transition name="slide-fade">
          <div v-show="showContent">
            <span>{{ previewDocument.content }}</span>
          </div>
        </transition>
        <a style="display: block;" v-show="!showContent" v-on:click="showContent = true">Ver mais</a>
      </div>
    </div>

    <div class="flex" v-if="date" :class="'notification ' + position">
      <img v-if="status === 'accepted' && this.position === 'right'" :src="checkSentSvg"/>
      <img v-else-if="status === 'received' && this.position === 'right'" :src="doubleCheckReceivedSvg"/>
      <img v-else-if="status === 'consumed' && this.position === 'right'" :src="doubleCheckReadSvg"/>
      <div class="failure" v-else-if="this.status === 'failed' && this.position === 'right'">
          Falha ao enviar a mensagem.
      </div>
      {{ date }}
    </div>

    <transition name="fade">
      <div v-if="!hide" class="options">
        <ul>
          <li @click="select()">
            <div class="wrapper">
              <div class="locationIcon">
                <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="pinIcon">
                        <path d="M0,12 C0,5.372583 5.37112582,0 12,0 C18.627417,0 24,5.37112582 24,12 C24,18.627417 18.6288742,24 12,24 C5.372583,24 0,18.6288742 0,12 Z M12,12 C10.8956,12 10,11.1044 10,10 C10,8.8952 10.8956,8 12,8 C13.1044,8 14,8.8952 14,10 C14,11.1044 13.1044,12 12,12 Z M7,10.0017561 C7,10.9978049 7.327,11.9392195 7.82066667,12.7099024 C8.83966667,14.3000976 12,19 12,19 C12,19 15.1603333,14.3000976 16.1793333,12.7099024 C16.673,11.9392195 17,10.9978049 17,10.0017561 C17,7.24443902 14.768,5 12,5 C9.232,5 7,7.24443902 7,10.0017561 Z" id="Combined-Shape"></path>
                    </g>
                  </g>
              </svg>
              </div>
              <div class="text">
                <span v-text="previewDocument.buttonLabel"></span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </transition>
  </div>
  <div v-else>
    <div class="blip-container">
      <div :class="`bubble ${position}`">
        <form novalidate v-on:submit.prevent>
          <button class="btn saveIco closeIco" @click="cancel()">
            <img :src="closeSvg" />
          </button>
          <button class="btn saveIco" @click="saveLocation()" :class="{'is-disabled': errors.any() }">
            <img :src="approveSvg" />
          </button>
          <div class="form-group">
            <textarea @keydown.enter="saveLocation($event)" name="text" class="form-control" v-validate="'required'" :class="{'input-error': errors.has('text') }" v-model="text"></textarea>
            <span v-show="errors.has('text')" class="help input-error">{{ errors.first('text') }}</span>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>


<script>
import { linkify } from '../utils/misc'
import { default as base } from '../mixins/baseComponent.js'

export default {
  name: 'request-location',
  mixins: [base],
  props: {
    hideOptions: {
      type: Boolean,
      default: false
    },
    onSelected: {
      type: Function
    },
    status: {
      type: String,
      default: ''
    },
    length: {
      type: Number,
      default: 532
    },
    onLocationError: {
      type: Function
    }
  },
  computed: {
    previewDocument: function() {
      return {
        hasPreview: this.document.label.value.length > this.length,
        previewContent: linkify(
          this.document.label.value.substring(0, this.length - 3) + '...'
        ),
        buttonLabel:
          navigator.language.toLowerCase().startsWith('pt')
            ? 'Enviar Localização'
            : 'Send Location',
        content: linkify(this.document.label.value)
      }
    }
  },
  data: function() {
    return {
      hide: undefined,
      text: undefined,
      showContent: undefined
    }
  },
  watch: {
    hideOptions: function() {
      this.hide = this.hideOptions
    }
  },
  methods: {
    init: function() {
      this.hide = this.hideOptions
      this.text = this.document.label.value
      this.showContent = false
    },
    select: function() {
      if (!navigator.geolocation) {
        return
      }
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          if (this.onSelected) {
            this.onSelected(null, {
              type: 'application/vnd.lime.location+json',
              content: { latitude, longitude }
            })
          }
        },
        (error) => {
          if (this.onLocationError) {
            this.onLocationError(error)
            this.hide = this.hideOptions
          }
        },
        {
          timeout: 5000
        }
      )

      if (!this.editable) {
        this.hide = true
      }
    },
    saveLocation: function($event) {
      if (this.errors.any() || ($event && $event.shiftKey)) {
        return
      }

      if ($event) {
        $event.stopPropagation()
        $event.preventDefault()
        $event.returnValue = false
      }

      this.showContent = false
      this.save({
        ...this.document,
        label: {
          ...this.document.label,
          value: this.text
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables.scss';
.flex {
  display: flex;
}

.failure {
  color: $vue-warning;
  font-size: 10px;
  margin-right: 5px;
}

.request-location {
  .bubble {
    padding: $bubble-padding;
  }
  .options {
    ul {
      list-style-type: none;
      clear: both;
      margin: 0;
      padding: 10px;
    }

    li {
      cursor: pointer;
      display: inline-flex;
      align-items: end;
      background-color: #daf2f4;
      border: 1px solid #0cc8cc;
      box-shadow: 0 -1px 12px 0 rgba(0, 0, 0, 0.1);
      border-radius: 20px;
      padding: 7px 10px;
      margin: 2px;
      color: #0cc8cc;
      font-size: 16px;
      font-weight: 500;
      min-width: 70px;

      .wrapper {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        .locationIcon {
          justify-content: center;
          border-radius: 50%;
          width: 25px;
          height: 25px;
        }
        .text {
          margin: 0px 10px;
        }
      }
    }
  }
  #pinIcon {
    fill: #0cc8cc;
  }
}
</style>
