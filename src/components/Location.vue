<template>
  <div v-if="!isEditing" class="location" :class="isFailedMessage(status, position) + ' ' + getBlipContainer">
    <bds-grid justifyContent="space-between" gap="1" align-items="center" :direction="position === 'left' ? 'row' : 'row-reverse'">
      <div :class="simplified ? '' : 'bubble ' + position" :style=" simplified ? '' : 'width: ' + bubbleWidth">
        <bds-button-icon v-if="deletable"
          class="editIco trashIco icon-button-margin"
          icon="trash"
          variant="delete"
          size="short"
          v-on:click="trash(document)"
        ></bds-button-icon>
        <bds-button-icon v-if="editable"
          class="editIco icon-button-margin"
          icon="edit"
          variant="primary"
          size="short"
          v-on:click="toggleEdit"
        ></bds-button-icon>
        <div v-if="simplified" class="header">
          <bds-grid gap="4" align-items="center" justify-content="space-between">
            <bds-grid margin="r-1" align-items="center" gap="1">
              <bds-icon class="typo" size="small" name="localization" theme="outline"></bds-icon>
              <bds-typo
                tag="span"
                margin="false"
                class="location-simplified-text typo"
                v-html="sanitize(document.text)">
              </bds-typo>
            </bds-grid>
            <bds-grid>
              <div class="location-preview-container">
                <div class="ratio ratio1-1 pointer" :style="styleObject" id="simplifiedLocation"></div>
              </div>
            </bds-grid>
          </bds-grid>
        </div>
        <div v-if="!simplified" class="header">
          <div
            class="ratio ratio1-1"
            :style="styleObject"
            @click="(editable ? null : handleLocationLink())"
            :class="editable ? '' : ' pointer'"
          ></div>
          <div class="title" v-if="document.text">
            <span v-if="document.text" v-html="sanitize(document.text)"></span>
          </div>
        </div>
      </div>
      <blip-card-reply
        :document="fullDocument"
        :reply-callback="replyCallback"
      />
    </bds-grid>
    <blip-card-date
      :status="status"
      :position="position"
      :date="date"
      :failed-to-send-msg="failedToSendMsg"
      :is-external-message="isExternalMessage"
      :external-message-text="externalMessageText"
    />
  </div>
  <div v-else class="blip-container location">
    <form :class="'editing bubble ' + position" novalidate v-on:submit.prevent>
      <bds-button-icon
        class="btn saveIco closeIco"
        icon="close"
        variant="ghost"
        size="short"
        v-on:click="cancel()"
      ></bds-button-icon>
      <bds-button-icon 
        class="btn saveIco"
        icon="check"
        variant="primary"
        size="short"
        :disabled="errors.any()"
        v-on:click="locationSave()"
      ></bds-button-icon>
      <div class="form-group">
        <input type="text" name="text" class="form-control" v-model="text" :placeholder="textMsg">
      </div>
      <div class="form-group">
        <input
          type="text"
          name="latitude"
          class="form-control"
          v-validate="'required'"
          v-model="latitude"
          :placeholder="latitudeMsg"
        >
        <span
          v-show="errors.has('latitude')"
          class="help input-error"
        >{{ errors.first('latitude') }}</span>
      </div>
      <div class="form-group">
        <input
          type="text"
          name="longitude"
          class="form-control"
          v-validate="'required'"
          v-model="longitude"
          :placeholder="longitudeMsg"
        >
        <span
          v-show="errors.has('longitude')"
          class="help input-error"
        >{{ errors.first('longitude') }}</span>
      </div>
      <button
        v-if="typeof onMetadataEdit === 'function'"
        class="define-metadata blip-location-metadata"
        @click="editMetadata(fullDocument)"
      >{{ metadataButtonText }}</button>
    </form>
  </div>
</template>

<script>
import { default as base } from '../mixins/baseComponent.js'
import DefaultMap from '../assets/img/DefaultMap.png'
import { isFailedMessage } from '../utils/misc'

export default {
  name: 'location',
  mixins: [base],
  props: {
    status: {
      type: String,
      default: ''
    },
    latitudeMsg: {
      type: String,
      default: 'Latitude'
    },
    longitudeMsg: {
      type: String,
      default: 'Longitude'
    },
    textMsg: {
      type: String,
      default: 'Text'
    },
    failedToSendMsg: {
      type: String,
      default: 'Falha ao enviar a mensagem'
    },
    simplified: {
      type: Boolean,
      default: false
    },
    replyCallback: {
      type: Function,
      default: undefined
    }
  },
  data: function() {
    return {
      text: undefined,
      latitude: undefined,
      longitude: undefined,
      bubbleWidth: undefined,
      apiKey: undefined,
      isFailedMessage
    }
  },
  computed: {
    mapUrl: function() {
      return (
        'http://www.google.com/maps/place/' +
        this.document.latitude +
        ',' +
        this.document.longitude
      )
    },
    previewUrl: function() {
      return (
        'https://maps.googleapis.com/maps/api/staticmap?&size=400x300&markers=' +
        this.document.latitude +
        ',' +
        this.document.longitude +
        '&key=' +
        this.apiKey
      )
    },
    styleObject: function() {
      var coordinatesRegex = new RegExp(new RegExp(/^-?1?\d{1,2}\.\d{1,}$/))
      if (
        coordinatesRegex.test(this.document.latitude) &&
        coordinatesRegex.test(this.document.longitude)
      ) {
        return { 'background-image': 'url("' + this.previewUrl + '")' }
      } else {
        return { 'background-image': 'url("' + DefaultMap + '")' }
      }
    },
    getBlipContainer: function() {
      if (this.simplified) {
        return ''
      }

      return 'blip-container'
    }
  },
  mounted: function() {
    this.mounted()
  },
  methods: {
    mounted: function() {
      let element = this.$el
      let container = element.parentNode
      let width = parseInt(
        window
          .getComputedStyle(container)
          .width.toString()
          .replace('px', '')
      )

      if (width <= 500) {
        this.bubbleWidth = width + 'px'
      } else if (width < 800) {
        this.bubbleWidth = width / 2 + 'px'
      } else {
        this.bubbleWidth = width / 3 + 'px'
      }
    },
    init: function() {
      this.text = this.document.text
      this.latitude = this.document.latitude
      this.longitude = this.document.longitude
      this.bubbleWidth = '500px'
      this.apiKey = 'AIzaSyAlC3a3DZZBscR0QIbQpee13Op9Y05m_wc'

      if (this.$el) {
        this.mounted()
      }
    },
    locationSave: async function() {
      let result = await this.$validator.validateAll()
      if (!result) return

      this.save({
        ...this.document,
        text: this.text,
        latitude: this.latitude,
        longitude: this.longitude
      })
    },
    handleLocationLink: function() {
      window.open(this.mapUrl, '_blank', 'noopener')
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables.scss';

.location {
  .header {
    overflow: hidden;
    border-radius: inherit;
  }

  .blip-location-metadata {
    margin-top: -10px;
    padding: 0 10px 0 0;
  }
}

.select .bubble {
  padding: $bubble-padding;
  min-width: auto;
}

.select .options ul {
  list-style-type: none;
  clear: both;
  margin: 0;
  padding: 10px;
}

.select .options li {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  height: 40px;
  background-color: $color-system;
  border: 1px solid $color-content-ghost;
  border-radius: 19px;
  padding: 10px 16px;
  margin: 4px;
  color: $color-content-default;
  font-size: 16px;
  font-weight: 500;
}

.select .fixed-options li:last-child {
  padding-bottom: 0px;
}

#simplifiedLocation {
  object-fit: fill;
  border-radius: 0 !important;
}

.location-preview-container {
  background-color: $color-surface-1;
  width: 56px;
  height: 56px;
  align-items: center;
}

.location-simplified-text {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  margin: 0;
  text-align: left;
  -webkit-line-clamp: 1;
  max-width: 150px;
}
</style>
