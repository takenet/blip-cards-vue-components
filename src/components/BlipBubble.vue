<template>
  <div class="blip-bubble">
    <div v-for="(item, index) in documents" v-bind:key="index">
      <blip-card :position="item.position" :date="item.date" :on-selected="onSelected" :hide-options="false" :document="item" :on-save="onSave" :on-deleted="onDeleted" :editable="editable" :on-open-link="onOpenLink"/>
    </div>
  </div>
</template>

<script>

export default {
  name: 'blip-bubble',
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
    documents: {
      type: Array,
      required: true
    },
    position: {
      type: String,
      default: 'left'
    },
    date: {
      type: String
    },
    onSave: {
      type: Function
    },
    onDeleted: {
      type: Function
    },
    editable: {
      type: Boolean,
      default: false
    }
  }
}
</script>
