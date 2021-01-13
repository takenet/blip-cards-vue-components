<template>
  <div v-if="!isEditing" class="blip-container location" :class="isFailedMessage(status, position)">
    <div>
      <div :class="'bubble ' + position" :style="'width: ' + bubbleWidth">
        <div v-if="deletable" class="editIco trashIco" @click="trash(document)">
          <img :src="trashSvg">
        </div>
        <div v-if="editable" class="editIco" @click="toggleEdit">
          <img :src="editSvg">
        </div>
        <div class="header">
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
    </div>
    <div class="flex" :class="'notification ' + position" v-if="date">
      <img v-if="this.status === 'waiting' && this.position === 'right'" :src="clockSvg">
      <img v-else-if="status === 'accepted' && this.position === 'right'" :src="checkSentSvg">
      <img
        v-else-if="status === 'received' && this.position === 'right'"
        :src="doubleCheckReceivedSvg"
      >
      <img v-else-if="status === 'consumed' && this.position === 'right'" :src="doubleCheckReadSvg">
      <div
        class="failure"
        v-else-if="this.status === 'failed' && this.position === 'right'"
      >{{ failedToSendMsg }}</div>
      {{ date }}
    </div>
  </div>
  <div v-else class="blip-container location">
    <form :class="'editing bubble ' + position" novalidate v-on:submit.prevent>
      <button class="btn saveIco" @click="locationSave()" :class="{'is-disabled': errors.any() }">
        <img :src="approveSvg">
      </button>
      <button class="btn saveIco closeIco" @click="cancel()">
        <img :src="closeSvg">
      </button>
      <div class="form-group">
        <input type="text" name="text" class="form-control" v-model="text" placeholder="Text">
      </div>
      <div class="form-group">
        <input
          type="text"
          name="latitude"
          class="form-control"
          v-validate="'required'"
          v-model="latitude"
          placeholder="Latitude"
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
          placeholder="Longitude"
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
    failedToSendMsg: {
      type: String,
      default: 'Falha ao enviar a mensagem'
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
      this.apiKey = 'AIzaSyC2BjLFJiNXFTOWeyss8cPTx7csKBBrRBY'

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
      window.open(this.mapUrl, '_blank')
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
  display: inline-block;
  background-color: #daf2f4;
  border: 1px solid #0cc8cc;
  box-shadow: 0 -1px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 19px;
  padding: 10px 16px;
  margin: 2px;
  color: #0cc8cc;
  font-size: 16px;
  font-weight: 500;
  min-width: 70px;
}

.select .fixed-options li:last-child {
  padding-bottom: 0px;
}
</style>
