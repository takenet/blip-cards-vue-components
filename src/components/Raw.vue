

<template>
  <div v-if="!isEditing">
  <div class="blip-container raw">
    <div :class="'bubble ' + position">
      <div v-if="editable" class="editIco trashIco" @click="trash(document)">
        <img :src="trashSvg" />
      </div>
      <div v-if="editable" class="editIco" @click="toggleEdit">
        <img :src="editSvg" />
      </div>

      <div v-html="json">
      </div>
    </div>

    <div :class="'notification ' + position" v-if="date">
      {{ date }}
    </div>
  </div>
</div>

<div class="blip-container plain-text" v-else>
  <div :class="'bubble ' + position">
    <div class="saveIco closeIco" @click="cancel()" >
      <img :src="closeSvg" />
    </div>
    <div class="saveIco" @click="saveRaw(json)" :class="{'is-disabled': errors.any() }">
      <img :src="approveSvg" />
    </div>
    <div class="form-group">
      <textarea name="json" class="form-control" v-validate="'required|json'" :class="{'input-error': errors.has('json') }" v-model="json" style="width: 100%; min-width: 300px"></textarea>
      <span v-show="errors.has('json')" class="help input-error">{{ errors.first('json') }}</span>
    </div>
  </div>
</div>
</template>

<script>

import { default as base } from '../mixins/baseComponent.js'

export default {
  name: 'blip-raw',
  mixins: [
    base
  ],
  data: function () {
    return {
      json: JSON.stringify(this.document)
    }
  },
  methods: {
    cancel: function () {
      this.json = JSON.stringify(this.document)
      this.isEditing = false
    },
    saveRaw: function () {
      this.save({
        ...this.document,
        content: JSON.parse(this.json)
      })
    }
  }
}
</script>


<style lang="scss">
   @import '../styles/variables.scss';

   .raw .bubble {
     padding: $bubble-padding;
     word-wrap: break-word;
   }
</style>
