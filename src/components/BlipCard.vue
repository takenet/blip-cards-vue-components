<template>
  <div v-if="editableDocument" class="blip-relative" @dblclick="editCard">
    <div :class="'blip-card-photo ' + position" v-if="photo && position === 'left'" :style="{ top: photoMargin + 'px', width: '25px', height: '25px', 'background-image': 'url(&quot;' + photo + '&quot;)' }">
    </div>
    <div :class="{'blip-container--with-photo': photo, [position]: true}">
      <div class="blip-card-container">

        <plain-text v-if="document.metadata && document.metadata['#blip.payload.text']" :status="status" :length="length" :position="position" :document="document.metadata['#blip.payload.text']" :full-document="editableDocument" :date="date" :on-save="saveCard" :editable="editable" class="blip-card" :on-deleted="deleteCard" :on-metadata-edit="isMetadataReady" :deletable="deletable" :editing="isCardEditing" :on-cancel="cancel"/>

        <plain-text v-else-if="document.type === 'text/plain'" :status="status" :length="length" :position="position" :document="editableDocument.content" :full-document="editableDocument" :date="date" :on-save="saveCard" :editable="editable" class="blip-card" :on-deleted="deleteCard" :on-metadata-edit="isMetadataReady" :deletable="deletable" :editing="isCardEditing" :on-cancel="cancel" :disable-link="disableLink" />

        <media-link @updated="updatedPhotoMargin" v-else-if="document.type === 'application/vnd.lime.media-link+json'" :status="status" :position="position" :document="editableDocument.content" :full-document="editableDocument" :date="date" :on-save="saveCard" :editable="editable" class="blip-card" :on-deleted="deleteCard" :on-metadata-edit="isMetadataReady" :deletable="deletable" :editing="isCardEditing" :on-cancel="cancel"/>

        <document-select v-else-if="document.type === 'application/vnd.lime.document-select+json'" :status="status" :length="length" :position="position" :document="editableDocument.content" :full-document="editableDocument" :date="date" :on-selected="onSelected" :on-save="saveCard" :editable="editable" :on-open-link="onOpenLink" class="blip-card" :on-deleted="deleteCard" :on-metadata-edit="isMetadataReady" :deletable="deletable" :editing="isCardEditing" :on-cancel="cancel"/>

        <collection v-else-if="document.type === 'application/vnd.lime.collection+json'" :status="status" :length="length" :position="position" :document="editableDocument.content" :full-document="editableDocument" :date="date" :on-selected="onSelected" :on-save="saveCard" :editable="editable" :on-open-link="onOpenLink" class="blip-card" :on-deleted="deleteCard" :on-metadata-edit="isMetadataReady" :deletable="deletable" :editing="isCardEditing" :on-cancel="cancel"/>

        <blip-select v-else-if="document.type === 'application/vnd.lime.select+json'" :status="status" :position="position" :document="editableDocument.content" :full-document="editableDocument" :date="date" :on-selected="onSelected" :on-save="saveCard" :editable="editable" class="blip-card" :on-deleted="deleteCard" :on-metadata-edit="isMetadataReady" :deletable="deletable" :hide-options="hideOptions" :editing="isCardEditing" :on-cancel="cancel"/>

        <web-link v-else-if="document.type === 'application/vnd.lime.web-link+json'" :status="status" :position="position" :document="editableDocument.content" :full-document="editableDocument" :date="date" :on-save="saveCard" :editable="editable" :on-open-link="onOpenLink" class="blip-card" :on-deleted="deleteCard" :on-metadata-edit="isMetadataReady" :deletable="deletable" :editing="isCardEditing" :on-cancel="cancel"/>

        <location v-else-if="document.type === 'application/vnd.lime.location+json'" :status="status" :position="position" :document="editableDocument.content" :full-document="editableDocument" :date="date" :on-save="saveCard" :editable="editable" class="blip-card" :on-deleted="deleteCard" :on-metadata-edit="isMetadataReady" :deletable="deletable" :editing="isCardEditing" :on-cancel="cancel"/>

        <request-location v-else-if="document.type === 'application/vnd.lime.input+json' && document.content.validation && document.content.validation.type === 'application/vnd.lime.location+json'" :status="status" :position="position" :document="editableDocument.content" :full-document="editableDocument" :date="date" :on-selected="onSelected" :on-save="saveCard" :editable="editable" class="blip-card" :on-deleted="deleteCard" :on-metadata-edit="isMetadataReady" :deletable="deletable" :hide-options="hideOptions" :editing="isCardEditing" :on-cancel="cancel"  :on-location-error="onLocationError"/>

        <lime-input v-else-if="document.type === 'application/vnd.lime.input+json'" :status="status" :position="position" :document="editableDocument.content" :full-document="editableDocument" :date="date" :on-selected="onSelected" :on-save="saveCard" :editable="editable" class="blip-card" :on-deleted="deleteCard" :on-metadata-edit="isMetadataReady" :deletable="deletable" :hide-options="hideOptions" :editing="isCardEditing" :on-cancel="cancel"  :on-location-error="onLocationError"/>

        <chat-state v-else-if="document.type === 'application/vnd.lime.chatstate+json'" :status="status" :position="position" :document="editableDocument.content" :full-document="editableDocument" :date="date" :on-save="saveCard" :editable="editable" class="blip-card" :on-deleted="deleteCard" :on-metadata-edit="isMetadataReady" :deletable="deletable" :editing="isCardEditing" :on-cancel="cancel"/>

        <blip-redirect v-else-if="document.type === 'application/vnd.lime.redirect+json'" :status="status" :position="position" :document="editableDocument.content" :date="date" :on-save="saveCard" :editable="editable" class="blip-card" :on-deleted="deleteCard" :deletable="deletable" :editing="isCardEditing" :on-cancel="cancel"/>

        <ticket v-else-if="document.type === 'application/vnd.iris.ticket+json'" :status="status" :position="position" :document="editableDocument.content" :date="date" :on-save="saveCard" :editable="editable" class="blip-card" :on-deleted="deleteCard" :deletable="deletable" :editing="isCardEditing" :on-cancel="cancel"/>

        <unsuported-content v-else :position="position" :document="editableDocument.content" :date="date" :on-save="saveCard" :editable="editable" class="blip-card" :on-deleted="deleteCard" :deletable="deletable" :editing="isCardEditing" :on-cancel="cancel"/>
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
    status: {
      type: String,
      default: ''
    },
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
    },
    onLocationError: {
      type: Function
    },
    disableLink: {
      type: Boolean,
      default: false
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
      if (!this.isCardEditing && this.editable) {
        this.isCardEditing = true
      }
    },
    cancel() {
      this.isCardEditing = false
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

      let bubbleHeight = 0
      const relatives = element.querySelectorAll('.blip-relative') // Element has relatives if is a collection
      if (relatives.length > 0) {
        relatives.forEach((relative) => {
          bubbleHeight += relative.offsetHeight
        })
        bubbleHeight -= 10 // Time height
      } else {
        bubbleHeight = element.querySelector('.bubble')
          ? element.querySelector('.bubble').offsetHeight
          : 0
      }
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
