<template>
  <div v-if="!isEditing" class="blip-container location">
    <div :class="'bubble ' + position" :style="'width: ' + bubbleWidth">
      <div v-if="deletable" class="editIco trashIco" @click="trash(document)">
        <img :src="trashSvg" />
      </div>
      <div v-if="editable" class="editIco" @click="toggleEdit">
        <img :src="editSvg" />
      </div>
      <div class="header">
        <a :href="mapUrl" target="_blank">
          <div class="ratio ratio1-1" :style="styleObject">
          </div>
        </a>

        <div class="title" v-if="document.text">
            <span v-if="document.text" v-html="document.text"></span>
        </div>
      </div>
    </div>

    <div :class="'notification ' + position" v-if="date">
      {{ date }}
    </div>
  </div>
  <div v-else class="blip-container location">
    <form class="editing bubble left" novalidate v-on:submit.prevent>
      <div class="btn saveIco" @click="locationSave()" :class="{'is-disabled': errors.any() }">
        <img :src="approveSvg" />
      </div>
      <div class="btn saveIco closeIco" @click="locationCancel()">
        <img :src="closeSvg" />
      </div>
      <div class="form-group">
        <input type="text" name="text" class="form-control" v-model="text" placeholder="Text" />
      </div>
      <div class="form-group">
        <input type="text" name="latitude" class="form-control" v-validate="'required'" v-model="latitude" placeholder="Latitude" />
        <span v-show="errors.has('latitude')" class="help input-error">{{ errors.first('latitude') }}</span>
      </div>
      <div class="form-group">
        <input type="text" name="longitude" class="form-control" v-validate="'required'" v-model="longitude" placeholder="Longitude" />
        <span v-show="errors.has('longitude')" class="help input-error">{{ errors.first('longitude') }}</span>
      </div>
    </form>
  </div>
</template>

<script>

import { default as base } from '../mixins/baseComponent.js'
import DefaultMap from '../assets/img/DefaultMap.png'

export default {
  name: 'location',
  mixins: [
    base
  ],
  props: {
  },
  data: function () {
    return {
      text: this.document.text,
      latitude: this.document.latitude,
      longitude: this.document.longitude,
      bubbleWidth: '500px',
      apiKey: 'AIzaSyC2BjLFJiNXFTOWeyss8cPTx7csKBBrRBY'
    }
  },
  computed: {
    mapUrl: function () {
      return 'http://www.google.com/maps/place/' + this.document.latitude + ',' + this.document.longitude
    },
    previewUrl: function () {
      return 'https://maps.googleapis.com/maps/api/staticmap?&size=400x300&markers=' +
          this.document.latitude + ',' + this.document.longitude +
          '&key=' + this.apiKey
    },
    styleObject: function () {
      var coordinatesRegex = new RegExp(new RegExp(/^-?1?\d{1,2}\.\d{1,10}$/))
      if (coordinatesRegex.test(this.document.latitude) && coordinatesRegex.test(this.document.longitude)) {
        return { 'background-image': 'url("' + this.previewUrl + '")' }
      } else {
        return { 'background-image': 'url("' + DefaultMap + '")' }
      }
    }
  },
  mounted: function () {
    let element = this.$el
    let container = element.parentNode
    let width = parseInt(window.getComputedStyle(container).width.toString().replace('px', ''))

    if (width <= 500) {
      this.bubbleWidth = width + 'px'
    } else if (width < 800) {
      this.bubbleWidth = (width / 2) + 'px'
    } else {
      this.bubbleWidth = (width / 3) + 'px'
    }
  },
  methods: {
    locationSave: async function () {
      let result = await this.$validator.validateAll()
      if (!result) return

      this.save({
        ...this.document,
        text: this.text,
        latitude: this.latitude,
        longitude: this.longitude
      })
    },
    locationCancel: function () {
      this.text = this.document.text
      this.latitude = this.document.latitude
      this.longitude = this.document.longitude
      this.isEditing = false
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
     background-color: #DAF2F4;
     border: 1px solid #0CC8CC;
     box-shadow: 0 -1px 12px 0 #EEEEEE;
     border-radius: 19px;
     padding: 10px 16px;
     margin: 2px;
     color: #0CC8CC;
     font-size: 14px;
     font-weight: 500;
     min-width: 70px;
   }

  .select .fixed-options li:last-child {
    padding-bottom: 0px;
  }

</style>
