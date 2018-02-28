<template>
  <div v-if="editableDocument" class="blip-relative" @dblclick="editCard">
    <div :class="'blip-card-photo ' + position" v-if="photo && position === 'left'" :style="{ top: photoMargin + 'px', width: '25px', height: '25px', 'background-image': 'url(&quot;' + photo + '&quot;)' }">
    </div>
    <div :class="{'blip-container--with-photo': photo, [position]: true}">
      <div class="blip-card-container">

        <plain-text v-if="document.metadata && document.metadata['#blip.payload.text']" :length="length" :position="position" :document="document.metadata['#blip.payload.text']" :date="date" :on-save="saveCard" :editable="editable" class="blip-card" :on-deleted="deleteCard" :deletable="deletable" :editing="isCardEditing"/>

        <plain-text v-else-if="document.type === 'text/plain'" :length="length" :position="position" :document="editableDocument.content" :date="date" :on-save="saveCard" :editable="editable" class="blip-card" :on-deleted="deleteCard" :deletable="deletable" :editing="isCardEditing"/>

        <media-link @updated="updatedPhotoMargin" v-else-if="document.type === 'application/vnd.lime.media-link+json'" :position="position" :document="editableDocument.content" :date="date" :on-save="saveCard" :editable="editable" class="blip-card" :on-deleted="deleteCard" :deletable="deletable" :editing="isCardEditing"/>

        <document-select v-else-if="document.type === 'application/vnd.lime.document-select+json'" :length="length" :position="position" :document="editableDocument.content" :date="date" :on-selected="onSelected" :on-save="saveCard" :editable="editable" :on-open-link="onOpenLink" class="blip-card" :on-deleted="deleteCard" :deletable="deletable" :editing="isCardEditing"/>

        <collection v-else-if="document.type === 'application/vnd.lime.collection+json'" :length="length" :position="position" :document="editableDocument.content" :date="date" :on-selected="onSelected" :on-save="saveCard" :editable="editable" class="blip-card" :on-deleted="deleteCard" :deletable="deletable" :editing="isCardEditing"/>

        <blip-select v-else-if="document.type === 'application/vnd.lime.select+json'" :position="position" :document="editableDocument.content" :date="date" :on-selected="onSelected" :on-save="saveCard" :editable="editable" class="blip-card" :on-deleted="deleteCard" :deletable="deletable" :hide-options="hideOptions" :editing="isCardEditing"/>

        <web-link v-else-if="document.type === 'application/vnd.lime.web-link+json'" :position="position" :document="editableDocument.content" :date="date" :on-save="saveCard" :editable="editable" :on-open-link="onOpenLink" class="blip-card" :on-deleted="deleteCard" :deletable="deletable" :editing="isCardEditing"/>

        <location v-else-if="document.type === 'application/vnd.lime.location+json'" :position="position" :document="editableDocument.content" :date="date" :on-save="saveCard" :editable="editable" class="blip-card" :on-deleted="deleteCard" :deletable="deletable" :editing="isCardEditing"/>

        <request-location v-else-if="document.type === 'application/vnd.lime.input+json'" :position="position" :document="editableDocument.content" :date="date" :on-save="saveCard" :editable="editable" class="blip-card" :on-deleted="deleteCard" :deletable="deletable" :editing="isCardEditing"/>

        <chat-state v-else-if="document.type === 'application/vnd.lime.chatstate+json'" :position="position" :document="editableDocument.content" :date="date" :on-save="saveCard" :editable="editable" class="blip-card" :on-deleted="deleteCard" :deletable="deletable" :editing="isCardEditing"/>

        <blip-redirect v-else-if="document.type === 'application/vnd.lime.redirect+json'" :position="position" :document="editableDocument.content" :date="date" :on-save="saveCard" :editable="editable" class="blip-card" :on-deleted="deleteCard" :deletable="deletable" :editing="isCardEditing"/>

        <ticket v-else-if="document.type === 'application/vnd.iris.ticket+json'" :position="position" :document="editableDocument.content" :date="date" :on-save="saveCard" :editable="editable" class="blip-card" :on-deleted="deleteCard" :deletable="deletable" :editing="isCardEditing"/>

        <blip-raw @unsupportedType="unsupportedType" v-else :position="position" :document="editableDocument.content" :date="date" :on-save="saveCard" :editable="editable" class="blip-card" :on-deleted="deleteCard" :deletable="deletable" :editing="isCardEditing"/>
      </div>
      <div :class="'blip-card-photo ' + position" v-if="photo && position === 'right'" :style="{ top: photoMargin + 'px', right: '0%', width: '25px', height: '25px', 'background-image': 'url(&quot;' + photo + '&quot;)' }">
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
      isCardEditing: this.editing,
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
    editCard() {
      if (!this.isCardEditing) {
        this.isCardEditing = true
      }
    },
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
      this.isCardEditing = false
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
  background-size: 100%;

  &.left {
    margin-right: 10px;
  }

  &.right {
    margin-right: 20px;
  }
}
</style>
