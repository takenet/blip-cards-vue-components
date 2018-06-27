<template>
  <div v-if="!isEditing">
    <div v-if="previewDocument.content != null && previewDocument.content.length > 0" class="blip-container plain-text">
      <div :class="'bubble ' + position">
        <div v-if="deletable" class="editIco trashIco" @click="trash(document)">
          <img :src="trashSvg" />
        </div>
        <div v-if="editable" class="editIco" @click="toggleEdit">
          <img :src="editSvg" />
        </div>

        <div v-if="!previewDocument.hasPreview" v-html="previewDocument.content">
        </div>
        <div v-else >
          <div v-show="!showContent" v-html="previewDocument.previewContent">
          </div>
          <transition name="slide-fade">
            <div v-show="showContent" v-html="previewDocument.content">
            </div>
          </transition>
          <a style="display: block;" v-show="!showContent" v-on:click="showContent = true">Ver mais</a>
        </div>
      </div>

      <div class="flex" :class="'notification ' + position" v-if="date">
        <img v-if="this.status === 'accepted'" :src="checkSentSvg"/>
        <img v-else-if="this.status === 'received'" :src="doubleCheckReceivedSvg"/>
        <img v-else-if="this.status === 'consumed'" :src="doubleCheckReadSvg"/>
        <div v-else-if="this.status === 'failed'" class="failure">
          Falha ao enviar a mensagem.
        </div>
        <div>{{ date }}</div>
      </div>
    </div>
  </div>

  <div class="blip-container" v-else>
    <div :class="'bubble ' + position">
      <form novalidate v-on:submit.prevent>
        <button class="btn saveIco closeIco" @click="cancel()" >
          <img :src="closeSvg" />
        </button>
        <button type="submit" class="btn saveIco" @click="saveText()" :class="{'is-disabled': errors.any() }">
          <img :src="approveSvg" />
        </button>
        <div class="form-group">
          <textarea @keydown.enter="saveText($event)" name="text" v-auto-expand class="form-control" v-validate="'required'" :class="{'input-error': errors.has('text') }" v-model="text"></textarea>
          <span v-show="errors.has('text')" class="help input-error">{{ errors.first('text') }}</span>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { linkify } from '../utils/misc'
import { default as base } from '../mixins/baseComponent.js'

export default {
  name: 'plain-text',
  mixins: [base],
  props: {
    document: {
      type: String,
      required: true
    },
    status: {
      type: String,
      default: ''
    },
    length: {
      type: Number,
      default: 532
    }
  },
  computed: {
    previewDocument: function() {
      return {
        hasPreview: this.document.length > this.length,
        previewContent: linkify(
          this.document.substring(0, this.length - 3) + '...'
        ),
        content: linkify(this.document)
      }
    }
  },
  data: function() {
    return {
      text: undefined,
      showContent: undefined
    }
  },
  methods: {
    init: function() {
      this.text = this.document
      this.showContent = false
    },
    saveText: function($event) {
      if (this.errors.any() || ($event && $event.shiftKey)) {
        return
      }

      if ($event) {
        $event.stopPropagation()
        $event.preventDefault()
        $event.returnValue = false
      }

      this.showContent = false
      this.save(this.text)
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

.plain-text .bubble {
  padding: $bubble-padding;
  word-wrap: break-word;
  min-width: auto !important;
  text-align: left;
}
</style>
