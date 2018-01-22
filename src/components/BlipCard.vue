<template>
  <div v-if="editableDocument" class="blip-relative">
    <div :class="'blip-card-photo ' + position" v-if="photo && position === 'left'" :style="{ top: photoMargin + 'px', width: '25px', height: '25px', 'background-image': 'url(' + photo + ')' }">
    </div>
    <div :class="{'blip-container--with-photo': photo, [position]: true}">
      <div class="blip-card-container">

        <plain-text v-if="document.metadata && document.metadata['#blip.payload.text']" :length="length" :position="position" :document="document.metadata['#blip.payload.text']" :date="date" :on-save="saveCard" :editable="editable" class="blip-card" :on-deleted="deleteCard" :deletable="deletable"/>

        <plain-text v-else-if="document.type === 'text/plain'" :length="length" :position="position" :document="editableDocument.content" :date="date" :on-save="saveCard" :editable="editable" class="blip-card" :on-deleted="deleteCard" :deletable="deletable"/>

        <media-link @updated="updatedPhotoMargin" v-else-if="document.type === 'application/vnd.lime.media-link+json'" :position="position" :document="editableDocument.content" :date="date" :on-save="saveCard" :editable="editable" class="blip-card" :on-deleted="deleteCard" :deletable="deletable"/>

        <document-select v-else-if="document.type === 'application/vnd.lime.document-select+json'" :length="length" :position="position" :document="editableDocument.content" :date="date" :on-selected="onSelected" :on-save="saveCard" :editable="editable" :on-open-link="onOpenLink" class="blip-card" :on-deleted="deleteCard" :deletable="deletable"/>

        <collection v-else-if="document.type === 'application/vnd.lime.collection+json'" :length="length" :position="position" :document="editableDocument.content" :date="date" :on-selected="onSelected" :on-save="saveCard" :editable="editable" class="blip-card" :on-deleted="deleteCard" :deletable="deletable"/>

        <blip-select v-else-if="document.type === 'application/vnd.lime.select+json'" :position="position" :document="editableDocument.content" :date="date" :on-selected="onSelected" :on-save="saveCard" :editable="editable" class="blip-card" :on-deleted="deleteCard" :deletable="deletable" :hide-options="hideOptions"/>

        <web-link v-else-if="document.type === 'application/vnd.lime.web-link+json'" :position="position" :document="editableDocument.content" :date="date" :on-save="saveCard" :editable="editable" :on-open-link="onOpenLink" class="blip-card" :on-deleted="deleteCard" :deletable="deletable"/>

        <location v-else-if="document.type === 'application/vnd.lime.location+json'" :position="position" :document="editableDocument.content" :date="date" :on-save="saveCard" :editable="editable" class="blip-card" :on-deleted="deleteCard" :deletable="deletable"/>

        <request-location v-else-if="document.type === 'application/vnd.lime.input+json'" :position="position" :document="editableDocument.content" :date="date" :on-save="saveCard" :editable="editable" class="blip-card" :on-deleted="deleteCard" :deletable="deletable"/>

        <chat-state v-else-if="document.type === 'application/vnd.lime.chatstate+json'" :position="position" :document="editableDocument.content" :date="date" :on-save="saveCard" :editable="editable" class="blip-card" :on-deleted="deleteCard" :deletable="deletable"/>

        <blip-redirect v-else-if="document.type === 'application/vnd.lime.redirect+json'" :position="position" :document="editableDocument.content" :date="date" :on-save="saveCard" :editable="editable" class="blip-card" :on-deleted="deleteCard" :deletable="deletable"/>

        <ticket v-else-if="document.type === 'application/vnd.iris.ticket+json'" :position="position" :document="editableDocument.content" :date="date" :on-save="saveCard" :editable="editable" class="blip-card" :on-deleted="deleteCard" :deletable="deletable"/>

        <blip-raw @unsupportedType="unsupportedType" v-else :position="position" :document="editableDocument.content" :date="date" :on-save="saveCard" :editable="editable" class="blip-card" :on-deleted="deleteCard" :deletable="deletable"/>
      </div>
      <div :class="'blip-card-photo ' + position" v-if="photo && position === 'right'" :style="{ top: photoMargin + 'px', right: '0%', width: '25px', height: '25px', 'background-image': 'url(' + photo + ')' }">
      </div>
    </div>
  </div>
</template>

<script>
import { default as base } from '../mixins/baseComponent.js'

export default {
  name: 'blip-card',
  mixins: [base],
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
    },
    photo: {},
    onUnsupportedType: {
      type: Function
    }
  },
  data() {
    return {
      editableDocument: this.document,
      photoMargin: 0
    }
  },
  watch: {
    document: function() {
      this.editableDocument = this.document
    }
  },
  updated() {
    this.updatedPhotoMargin()
  },
  mounted() {
    this.updatedPhotoMargin()
  },
  methods: {
    removeEmpty(obj) {
      Object.keys(obj).forEach((key) => {
        if (obj[key] && typeof obj[key] === 'object') {
          this.removeEmpty(obj[key])
        } else if (obj[key] == null) {
          delete obj[key]
        }
      })

      return obj
    },
    deleteCard(document) {
      this.trash(this.editableDocument)
      this.editableDocument = null
    },
    saveCard(document) {
      this.editableDocument.content = document
      this.save(this.editableDocument)
    },
    updatedPhotoMargin() {
      this.photoMargin = this.getPhotoMargin()
    },
    getPhotoMargin() {
      if (!this.editableDocument) return
      const element = this.$el

      const bubbleHeight = element.querySelector('.bubble')
        ? element.querySelector('.bubble').offsetHeight
        : 0
      const photoHeight = 25

      return bubbleHeight - photoHeight
    },
    unsupportedType(document) {
      if (this.onUnsupportedType) {
        this.onUnsupportedType(this.editableDocument)
      }
    }
  }
}
</script>

<style lang="scss">
@import '../styles/common.scss';
@import '../styles/variables.scss';

.blip-container--with-photo {

  &.left {
    margin-left: 35px;
  }

  &.right {
    margin-right: 55px;
  }
}

.blip-card-photo {
  position: absolute;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;

  &.left {
    margin-right: 10px;
  }

  &.right {
    margin-right: 20px;
  }
}
</style>
