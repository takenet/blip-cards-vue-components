<template>
  <div v-if="editableDocument">
    <plain-text v-if="document.type === 'text/plain'" :length="length" :position="position" :document="editableDocument.content" :date="date" :on-save="saveCard" :editable="editable" class="blip-card" :on-deleted="deleteCard" :deletable="deletable"/>

    <media-link v-else-if="document.type === 'application/vnd.lime.media-link+json'" :position="position" :document="editableDocument.content" :date="date" :on-save="saveCard" :editable="editable" class="blip-card" :on-deleted="deleteCard" :deletable="deletable"/>

    <document-select v-else-if="document.type === 'application/vnd.lime.document-select+json'" :length="length" :position="position" :document="editableDocument.content" :date="date" :on-selected="onSelected" :on-save="saveCard" :editable="editable" :on-open-link="onOpenLink" class="blip-card" :on-deleted="deleteCard" :deletable="deletable"/>

    <collection v-else-if="document.type === 'application/vnd.lime.collection+json'" :length="length" :position="position" :document="editableDocument.content" :date="date" :on-selected="onSelected" :on-save="saveCard" :editable="editable" class="blip-card" :on-deleted="deleteCard" :deletable="deletable"/>

    <blip-select v-else-if="document.type === 'application/vnd.lime.select+json'" :position="position" :document="editableDocument.content" :date="date" :on-selected="onSelected" :on-save="saveCard" :editable="editable" class="blip-card" :on-deleted="deleteCard" :deletable="deletable"/>

    <web-link v-else-if="document.type === 'application/vnd.lime.web-link+json'" :position="position" :document="editableDocument.content" :date="date" :on-save="saveCard" :editable="editable" :on-open-link="onOpenLink" class="blip-card" :on-deleted="deleteCard" :deletable="deletable"/>

    <location v-else-if="document.type === 'application/vnd.lime.location+json'" :position="position" :document="editableDocument.content" :date="date" :on-save="saveCard" :editable="editable" class="blip-card" :on-deleted="deleteCard" :deletable="deletable"/>

    <request-location v-else-if="document.type === 'application/vnd.lime.input+json'" :position="position" :document="editableDocument.content" :date="date" :on-save="saveCard" :editable="editable" class="blip-card" :on-deleted="deleteCard" :deletable="deletable"/>

    <chat-state v-else-if="document.type === 'application/vnd.lime.chatstate+json'" :position="position" :document="editableDocument.content" :date="date" :on-save="saveCard" :editable="editable" class="blip-card" :on-deleted="deleteCard" :deletable="deletable"/>

    <blip-raw v-else :position="position" :document="editableDocument.content" :date="date" :on-save="saveCard" :editable="editable" class="blip-card" :on-deleted="deleteCard" :deletable="deletable"/>
  </div>
</template>

<script>

import { default as base } from '../mixins/baseComponent.js'

export default {
  name: 'blip-card',
  mixins: [
    base
  ],
  props: {
    length: {
      type: Number
    },
    hideOptions: {
      type: Boolean,
      default: false
    },
    onSelected: {
      type: Function
    },
    onOpenLink: {
      type: Function
    }
  },
  data: function () {
    return {
      editableDocument: this.document
    }
  },
  methods: {
    removeEmpty: function (obj) {
      Object.keys(obj).forEach(key => {
        if (obj[key] && typeof obj[key] === 'object') {
          this.removeEmpty(obj[key])
        } else if (obj[key] == null) {
          delete obj[key]
        }
      })

      return obj
    },
    deleteCard: function (document) {
      this.trash(this.editableDocument)
      this.editableDocument = null
    },
    saveCard: function (document) {
      console.log(JSON.stringify(document))
      this.editableDocument.content = document
      this.save(this.editableDocument)
    }
  }
}
</script>

<style lang="scss">
   @import '../styles/common.scss';
   @import '../styles/variables.scss';

</style>
